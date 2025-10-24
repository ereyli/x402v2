import { Hono } from "hono";

// Lazy imports for Vercel optimization
let paymentMiddleware: any;
let Network: any;
let facilitator: any;

// Vercel optimization
const isVercel = process.env.VERCEL === '1';

// Lazy load heavy dependencies
async function loadDependencies() {
  if (!paymentMiddleware) {
    const x402Hono = await import("x402-hono");
    const coinbaseX402 = await import("@coinbase/x402");
    
    paymentMiddleware = x402Hono.paymentMiddleware;
    Network = x402Hono.Network;
    facilitator = coinbaseX402.facilitator;
  }
  return { paymentMiddleware, Network, facilitator };
}

const facilitatorUrl: string = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const payTo = (process.env.ADDRESS || '0xda8d766bc482a7953b72283f56c12ce00da6a86a') as `0x${string}`;
const network = (process.env.NETWORK || 'base') as any;

const app = new Hono();

// Initialize x402 middleware lazily
let middlewareInitialized = false;

async function initializeMiddleware() {
  if (!middlewareInitialized) {
    const { paymentMiddleware, facilitator } = await loadDependencies();
    
    app.use(
      paymentMiddleware(
        payTo,
        {
          "GET /payment/1usdc": {
            price: "$1",
            network: network,
            config: {
              description: "Pay 1 USDC → Get 5,000 PAYX tokens",
            }
          },
          "GET /payment/5usdc": {
            price: "$5",
            network: network,
            config: {
              description: "Pay 5 USDC → Get 25,000 PAYX tokens",
            }
          },
          "GET /payment/10usdc": {
            price: "$10",
            network: network,
            config: {
              description: "Pay 10 USDC → Get 50,000 PAYX tokens",
            }
          },
          "GET /payment/100usdc": {
            price: "$100",
            network: network,
            config: {
              description: "Pay 100 USDC → Get 500,000 PAYX tokens",
            }
          }
        },
        facilitator
      )
    );
    
    middlewareInitialized = true;
  }
}

// Protected endpoints - Payment confirmations
app.get("/payment/1usdc", async (c) => {
  await initializeMiddleware();
  return c.json({
    success: true,
    message: "Payment confirmed! Your PAYX tokens will be sent to your wallet soon.",
    payment: {
      amount: "1 USDC",
      tokens: "5,000 PAYX",
      status: "Payment recorded - Tokens will be distributed later"
    }
  });
});

app.get("/payment/5usdc", async (c) => {
  await initializeMiddleware();
  return c.json({
    success: true,
    message: "Payment confirmed! Your PAYX tokens will be sent to your wallet soon.",
    payment: {
      amount: "5 USDC",
      tokens: "25,000 PAYX",
      status: "Payment recorded - Tokens will be distributed later"
    }
  });
});

app.get("/payment/10usdc", async (c) => {
  await initializeMiddleware();
  return c.json({
    success: true,
    message: "Payment confirmed! Your PAYX tokens will be sent to your wallet soon.",
    payment: {
      amount: "10 USDC",
      tokens: "50,000 PAYX",
      status: "Payment recorded - Tokens will be distributed later"
    }
  });
});

app.get("/payment/100usdc", async (c) => {
  await initializeMiddleware();
  return c.json({
    success: true,
    message: "Payment confirmed! Your PAYX tokens will be sent to your wallet soon.",
    payment: {
      amount: "100 USDC",
      tokens: "500,000 PAYX",
      status: "Payment recorded - Tokens will be distributed later"
    }
  });
});

// Simple info page with links to protected endpoints
app.get("/", (c) => {
  // Vercel optimization - faster response
  if (isVercel) {
    c.header('Cache-Control', 'public, max-age=60');
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PAYx402 - x402 Payment</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box;
          image-rendering: pixelated;
        }
        body {
          font-family: 'Press Start 2P', monospace;
          background: #000814;
          min-height: 100vh;
          padding: 40px 20px;
          color: #0052FF;
        }
        .container {
          background: #001d3d;
          max-width: 700px;
          margin: 0 auto;
          padding: 30px;
          border: 4px solid #0052FF;
          box-shadow: 0 0 20px rgba(0, 82, 255, 0.3);
        }
        h1 {
          font-size: 32px;
          color: #0052FF;
          margin-bottom: 20px;
          text-shadow: 2px 2px 0px #001845;
          letter-spacing: 2px;
        }
        .subtitle {
          color: #4d94ff;
          font-size: 12px;
          margin-bottom: 30px;
          line-height: 1.8;
        }
        a {
          display: block;
          background: #001845;
          color: #0052FF;
          text-decoration: none;
          padding: 16px 20px;
          font-size: 11px;
          margin-bottom: 16px;
          border: 3px solid #0052FF;
          cursor: pointer;
          transition: all 0.1s;
          text-align: center;
          letter-spacing: 1px;
        }
        a:hover {
          background: #0052FF;
          color: #fff;
          box-shadow: 0 0 10px rgba(0, 82, 255, 0.8);
        }
        a:active {
          transform: scale(0.98);
        }
        .info {
          margin-top: 30px;
          padding: 20px;
          background: #000814;
          border: 3px solid #003d99;
          font-size: 10px;
          line-height: 2;
        }
        .info strong {
          color: #0052FF;
        }
        .info p {
          margin-bottom: 10px;
          color: #4d94ff;
        }
        .social-links {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .social-links a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          padding: 0;
          margin: 0;
          background: #001845;
          border: 3px solid #0052FF;
          font-size: 24px;
          text-decoration: none;
        }
        .social-links a:hover {
          background: #0052FF;
          color: #fff;
          transform: scale(1.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="social-links">
          <a href="#" title="X (Twitter)">𝕏</a>
          <a href="#" title="Telegram">✈</a>
        </div>
        
        <h1>PAYx402</h1>
        <p class="subtitle">Buy PAYX Tokens with USDC</p>
        
        <a href="/payment/1usdc">1 USDC → 5,000 PAYX</a>
        <a href="/payment/5usdc">5 USDC → 25,000 PAYX</a>
        <a href="/payment/10usdc">10 USDC → 50,000 PAYX</a>
        <a href="/payment/100usdc">100 USDC → 500,000 PAYX</a>
        
        <div class="info">
          <p><strong>Token Information:</strong></p>
          <p>• Token: PAYX</p>
          <p>• Total Supply: 1,000,000,000 PAYX</p>
          <p>• Rate: 1 USDC = 5,000 PAYX</p>
          <p>• Network: Base Mainnet</p>
          
          <p style="margin-top: 15px;"><strong>Payment Options:</strong></p>
          <p>• 1 USDC = 5,000 PAYX</p>
          <p>• 5 USDC = 25,000 PAYX</p>
          <p>• 10 USDC = 50,000 PAYX</p>
          <p>• 100 USDC = 500,000 PAYX</p>
          
          <p style="margin-top: 15px;"><strong>How it works:</strong></p>
          <p>1. Choose your payment amount</p>
          <p>2. x402 paywall will appear</p>
          <p>3. Connect your wallet</p>
          <p>4. Complete USDC payment on Base</p>
          <p>5. Payment will be recorded</p>
          
          <p style="margin-top: 15px; color: #4d94ff;">
            <strong>✅ PAYX tokens will be distributed to your wallet later</strong>
          </p>
          
          <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #003d99; font-size: 0.85rem; color: #4d94ff;">
            <strong>About PAYx402:</strong><br>
            This is an experimental project testing x402 protocol for automated token distribution. 
            PAYX is a meme token created for demonstration purposes.
          </p>
          
          <p style="margin-top: 10px; font-size: 0.85rem; color: #ff4d4d;">
            <strong>⚠️ DISCLAIMER:</strong><br>
            Use at your own risk. This is not financial advice. 
            PAYX is an experimental meme token with no intrinsic value. 
            Only participate with funds you can afford to lose.
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Export for Vercel - NO app.listen() needed!
export default app.fetch;
