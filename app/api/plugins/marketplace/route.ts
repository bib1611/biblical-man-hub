import { NextRequest, NextResponse } from 'next/server';
import { pluginManager } from '@/lib/plugins';

export async function GET() {
  try {
    const sources = await pluginManager.listMarketplaceSources();
    return NextResponse.json({ success: true, sources });
  } catch (error) {
    console.error('Error listing marketplace sources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list marketplace sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source } = body;

    if (!source || typeof source !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Source is required (format: owner/repo)' },
        { status: 400 }
      );
    }

    const parts = source.split('/');
    if (parts.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid source format. Use: owner/repo' },
        { status: 400 }
      );
    }

    const [owner, repo] = parts;
    const addedSource = await pluginManager.addMarketplaceSource(owner, repo);

    return NextResponse.json({
      success: true,
      message: `Marketplace source "${source}" added successfully`,
      source: addedSource,
    });
  } catch (error) {
    console.error('Error adding marketplace source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add marketplace source' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'Source parameter is required' },
        { status: 400 }
      );
    }

    const removed = await pluginManager.removeMarketplaceSource(source);

    if (removed) {
      return NextResponse.json({
        success: true,
        message: `Marketplace source "${source}" removed successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Source "${source}" not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error removing marketplace source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove marketplace source' },
      { status: 500 }
    );
  }
}
