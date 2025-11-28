import { NextResponse } from 'next/server';
import { pluginManager } from '@/lib/plugins';

export async function GET() {
  try {
    const plugins = await pluginManager.listInstalledPlugins();
    return NextResponse.json({ success: true, plugins });
  } catch (error) {
    console.error('Error listing installed plugins:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list installed plugins' },
      { status: 500 }
    );
  }
}
