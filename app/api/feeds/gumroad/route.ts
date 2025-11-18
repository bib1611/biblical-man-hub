import { NextResponse } from 'next/server';
import { products } from '@/lib/data/products';

export async function GET() {
  try {
    // For now, return our curated product list
    // In production, you could integrate with Gumroad API
    // https://app.gumroad.com/api#products

    const gumroadProducts = products.map((product) => ({
      id: product.id,
      title: product.name,
      url: product.gumroadUrl,
      preview: product.description,
      date: new Date().toISOString(), // Would come from Gumroad API
      platform: 'Gumroad' as const,
      price: product.price,
      category: product.category,
      features: product.features,
    }));

    return NextResponse.json({ products: gumroadProducts });
  } catch (error) {
    console.error('Gumroad feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gumroad products', products: [] },
      { status: 500 }
    );
  }
}

// If you want to integrate with real Gumroad API:
// 1. Get API key from https://app.gumroad.com/settings/advanced#application-form
// 2. Add GUMROAD_ACCESS_TOKEN to .env.local
// 3. Use this function:

/*
async function fetchGumroadProducts() {
  const response = await fetch('https://api.gumroad.com/v2/products', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
    },
  });

  const data = await response.json();
  return data.products;
}
*/
