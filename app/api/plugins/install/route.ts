import { NextRequest, NextResponse } from 'next/server';
import { pluginManager } from '@/lib/plugins';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plugin } = body;

    if (!plugin || typeof plugin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Plugin name is required' },
        { status: 400 }
      );
    }

    const installedPlugin = await pluginManager.installPlugin(plugin);

    if (!installedPlugin) {
      return NextResponse.json(
        {
          success: false,
          error: `Plugin "${plugin}" not found in any marketplace source. Make sure you've added the marketplace first.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Plugin "${plugin}" installed successfully`,
      plugin: installedPlugin,
    });
  } catch (error) {
    console.error('Error installing plugin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to install plugin' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plugin = searchParams.get('plugin');

    if (!plugin) {
      return NextResponse.json(
        { success: false, error: 'Plugin parameter is required' },
        { status: 400 }
      );
    }

    const removed = await pluginManager.uninstallPlugin(plugin);

    if (removed) {
      return NextResponse.json({
        success: true,
        message: `Plugin "${plugin}" uninstalled successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Plugin "${plugin}" not found` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error uninstalling plugin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to uninstall plugin' },
      { status: 500 }
    );
  }
}
