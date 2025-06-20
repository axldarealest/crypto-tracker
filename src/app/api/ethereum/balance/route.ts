import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  // Validate Ethereum address format
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    return NextResponse.json({ error: 'Invalid Ethereum address format' }, { status: 400 });
  }

  try {
    // Use public Ethereum RPC endpoint
    const rpcUrl = 'https://ethereum-rpc.publicnode.com';
    
    const rpcPayload = {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1
    };
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rpcPayload),
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error('RPC API Error:', response.status);
      return NextResponse.json({ 
        error: 'Failed to fetch balance from RPC' 
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('RPC API Error:', data.error);
      return NextResponse.json({ 
        error: data.error.message || 'Failed to fetch balance' 
      }, { status: 400 });
    }

    // Convert hex Wei to ETH (1 ETH = 10^18 Wei)
    const balanceInWei = parseInt(data.result, 16);
    const balanceInEth = balanceInWei / Math.pow(10, 18);
    
    // Get current ETH price from CoinGecko
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur&include_24hr_change=true', {
      next: { revalidate: 60 } // Cache for 1 minute
    });

    let currentPrice = 3200; // Fallback price
    let change24h = 0;
    
    if (priceResponse.ok) {
      const priceData = await priceResponse.json();
      if (priceData.ethereum) {
        currentPrice = priceData.ethereum.eur;
        change24h = priceData.ethereum.eur_24h_change || 0;
      }
    }

    return NextResponse.json({
      address,
      balance: balanceInEth,
      currentPrice,
      valueInEur: balanceInEth * currentPrice,
      change24h,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to fetch Ethereum balance:', error);
    
    return NextResponse.json({ 
      error: 'Network error while fetching balance'
    }, { status: 500 });
  }
} 