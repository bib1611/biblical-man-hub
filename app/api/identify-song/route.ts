import { NextResponse } from 'next/server';

// Helper function to parse Icecast metadata from stream
async function parseIcecastMetadata(streamUrl: string): Promise<{ title?: string; artist?: string } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(streamUrl, {
      headers: {
        'Icy-MetaData': '1',
        'User-Agent': 'Mozilla/5.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const metadataInterval = response.headers.get('icy-metaint');
    if (!metadataInterval) {
      console.log('No metadata interval in stream headers');
      return null;
    }

    const interval = parseInt(metadataInterval);
    const reader = response.body?.getReader();
    if (!reader) return null;

    // Read audio data + metadata
    let audioBuffer = new Uint8Array(0);
    let totalRead = 0;

    // Read until we get past the first metadata block
    while (totalRead < interval + 1000) {
      const { value, done } = await reader.read();
      if (done || !value) break;

      const newBuffer = new Uint8Array(audioBuffer.length + value.length);
      newBuffer.set(audioBuffer);
      newBuffer.set(value, audioBuffer.length);
      audioBuffer = newBuffer;
      totalRead += value.length;

      // If we have enough data, look for metadata
      if (totalRead >= interval) {
        // Metadata starts at position = interval
        const metadataLengthByte = audioBuffer[interval];
        const metadataLength = metadataLengthByte * 16;

        if (metadataLength > 0 && audioBuffer.length >= interval + 1 + metadataLength) {
          const metadataBytes = audioBuffer.slice(interval + 1, interval + 1 + metadataLength);
          const metadata = new TextDecoder('latin1').decode(metadataBytes);

          // Parse StreamTitle='Artist - Title';
          const titleMatch = metadata.match(/StreamTitle='([^']+)'/);
          if (titleMatch && titleMatch[1]) {
            const fullTitle = titleMatch[1].trim();
            const parts = fullTitle.split(' - ');

            reader.cancel();

            if (parts.length >= 2) {
              return {
                artist: parts[0].trim(),
                title: parts.slice(1).join(' - ').trim(),
              };
            } else {
              return {
                title: fullTitle,
                artist: 'The King\'s Radio',
              };
            }
          }
        }
        break;
      }
    }

    reader.cancel();
    return null;
  } catch (error) {
    console.error('Icecast metadata parsing error:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { streamUrl } = await request.json();

    console.log('Attempting to identify song from stream:', streamUrl);

    // Primary method: Parse Icecast metadata directly from stream
    const metadata = await parseIcecastMetadata(streamUrl);
    if (metadata && metadata.title) {
      console.log('Successfully parsed metadata:', metadata);
      return NextResponse.json({
        success: true,
        title: metadata.title,
        artist: metadata.artist || 'The King\'s Radio',
      });
    }

    // Fallback: Use AudD API for audio fingerprinting
    const auddApiKey = process.env.AUDD_API_KEY;
    if (auddApiKey && auddApiKey !== 'test') {
      console.log('Trying AudD API...');
      const formData = new FormData();
      formData.append('url', streamUrl);
      formData.append('return', 'spotify,apple_music');
      formData.append('api_token', auddApiKey);

      const response = await fetch('https://api.audd.io/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success' && data.result) {
        console.log('AudD identification successful:', data.result);
        return NextResponse.json({
          success: true,
          title: data.result.title,
          artist: data.result.artist,
          album: data.result.album,
          artwork: data.result.spotify?.album?.images?.[0]?.url ||
                   data.result.apple_music?.artwork?.url ||
                   undefined,
          releaseDate: data.result.release_date,
          label: data.result.label,
        });
      }
    }

    console.log('All identification methods failed');
    return NextResponse.json({
      success: false,
      error: 'Unable to identify song',
    });
  } catch (error) {
    console.error('Song identification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Identification failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
