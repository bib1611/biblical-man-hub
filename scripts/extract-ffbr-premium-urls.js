// Script to help extract FFBR Premium stream URLs
// Run this in the browser console on the FFBR premium page after logging in

console.log('🎵 FFBR Stream URL Extractor\n');
console.log('Instructions:');
console.log('1. Log in to https://ffbrmobile.com/ffbr-premium-player-page-mobile/');
console.log('2. Open browser DevTools (F12)');
console.log('3. Go to Console tab');
console.log('4. Paste this entire script and press Enter\n');
console.log('---\n');

// Function to extract stream URLs from audio elements
function extractStreamUrls() {
  const results = {};

  // Method 1: Find all audio elements
  const audioElements = document.querySelectorAll('audio');
  console.log(`Found ${audioElements.length} audio elements`);

  audioElements.forEach((audio, index) => {
    const src = audio.src || audio.currentSrc;
    if (src) {
      const label = audio.closest('.stream-container')?.querySelector('.stream-title')?.textContent ||
                   audio.closest('[class*="stream"]')?.querySelector('[class*="title"]')?.textContent ||
                   `Stream ${index + 1}`;
      results[label.trim()] = src;
      console.log(`\n${label}:`);
      console.log(`  ${src}`);
    }
  });

  // Method 2: Check for data attributes
  const streamContainers = document.querySelectorAll('[data-stream-url], [data-src], [data-audio-url]');
  console.log(`\nFound ${streamContainers.length} elements with stream data attributes`);

  streamContainers.forEach((el) => {
    const url = el.dataset.streamUrl || el.dataset.src || el.dataset.audioUrl;
    const label = el.querySelector('[class*="title"], [class*="name"]')?.textContent || 'Unknown Stream';
    if (url && !results[label]) {
      results[label.trim()] = url;
      console.log(`\n${label}:`);
      console.log(`  ${url}`);
    }
  });

  // Method 3: Scan all network requests
  console.log('\n📡 Network Monitoring Active');
  console.log('Now play each stream one by one...');
  console.log('Watch for stream URLs appearing below:\n');

  // Monitor fetch/XHR requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (url.includes('stream') || url.includes('radio') || url.includes('.mp3') || url.includes('listen'))) {
      console.log(`🎵 STREAM URL DETECTED: ${url}`);
    }
    return originalFetch.apply(this, args);
  };

  return results;
}

// Run extraction
const streamUrls = extractStreamUrls();

console.log('\n\n=== EXTRACTED STREAM URLS ===');
console.log(JSON.stringify(streamUrls, null, 2));
console.log('\n=== COPY THIS JSON ===\n');

// Also monitor for dynamically loaded streams
console.log('✅ Network monitoring active. Play each stream to capture URLs.');
console.log('💡 Check the Network tab (filter by "media" or "xhr") while playing streams\n');
