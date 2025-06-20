import { NextResponse } from 'next/server';

// Disable Vercel's automatic authentication protection
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  // Validate Bitcoin address format (basic validation)
  if (!address.match(/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/)) {
    return NextResponse.json({ error: 'Invalid Bitcoin address format' }, { status: 400 });
  }

  try {
    // Use Blockstream API (free public API)
    const blockstreamUrl = `https://blockstream.info/api/address/${address}`;
    
    const response = await fetch(blockstreamUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error('Blockstream API Error:', response.status);
      return NextResponse.json({ 
        error: 'Failed to fetch balance from Blockstream' 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Convert satoshis to BTC (1 BTC = 100,000,000 satoshis)
    const balanceInSatoshis = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const balanceInBtc = balanceInSatoshis / 100000000;
    
    // Get current BTC price from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true', {
      next: { revalidate: 60 } // Cache for 1 minute
    });

    let currentPrice = 65000; // Fallback price
    let change24h = 0;
    
    if (priceResponse.ok) {
      const priceData = await priceResponse.json();
      if (priceData.bitcoin) {
        currentPrice = priceData.bitcoin.eur;
        change24h = priceData.bitcoin.eur_24h_change || 0;
      }
    }

    return NextResponse.json({
      address,
      balance: balanceInBtc,
      currentPrice,
      valueInEur: balanceInBtc * currentPrice,
      change24h,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to fetch Bitcoin balance:', error);
    
    return NextResponse.json({ 
      error: 'Network error while fetching balance'
    }, { status: 500 });
  }
} 