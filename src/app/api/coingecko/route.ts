import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const apiKey = process.env.COINGECKO_API_KEY;
  
  if (!from || !to) {
    return NextResponse.json({ error: 'Missing "from" or "to" parameters' }, { status: 400 });
  }

  // Use different URL based on whether API key is available
  let coingeckoUrl: string;
  let headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (apiKey) {
    // Pro API with key
    coingeckoUrl = `https://pro-api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${from}&to=${to}&precision=2`;
    headers['x-cg-pro-api-key'] = apiKey;
  } else {
    // Free public API (no key required)
    coingeckoUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${from}&to=${to}&precision=2`;
  }

  try {
    const response = await fetch(coingeckoUrl, {
      headers,
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API Error:', response.status, errorText);
      
      // If we get rate limited, return cached/mock data
      if (response.status === 429) {
        return NextResponse.json({ 
          error: 'Rate limited - using cached data',
          prices: [] // Empty for now, dashboard will use fallback
        }, { status: 200 });
      }
      
      return NextResponse.json({ 
        error: `CoinGecko API Error: ${response.statusText}` 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Failed to fetch from CoinGecko API:', error);
    
    // Return empty data so dashboard can use fallback
    return NextResponse.json({ 
      error: 'Network error - using fallback data',
      prices: []
    }, { status: 200 });
  }
} 