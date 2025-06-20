import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const apiKey = process.env.COINGECKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'CoinGecko API Key is not configured.' }, { status: 500 });
  }
  
  if (!from || !to) {
    return NextResponse.json({ error: 'Missing "from" or "to" parameters' }, { status: 400 });
  }

  const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${from}&to=${to}&precision=2&x_cg_demo_api_key=${apiKey}`;

  try {
    const response = await fetch(coingeckoUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API Error:', errorText);
      return NextResponse.json({ error: `CoinGecko API Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Failed to fetch from CoinGecko API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 