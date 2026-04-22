import { NextResponse } from 'next/server';

/**
 * PersonaFlow n8n Proxy (Dual-Mode)
 * Handles both Production (/webhook/) and Test (/webhook-test/) endpoints.
 */

export async function POST(request: Request) {
  // 1. Get URLs from environment variables
  const prodUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_DEMO_WEBHOOK_URL;
  const testUrl = process.env.NEXT_PUBLIC_DEMO_WEBHOOK_TEST_URL;

  try {
    const body = await request.json();

    // Check if the request explicitly asks for "test mode" or if it's a test source
    // (Added flexibility for "incorporating both")
    const isTestMode = body.useTestMode === true || body.source === 'test';

    const targetUrl = isTestMode && testUrl ? testUrl : prodUrl;

    if (!targetUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 });
    }

    console.log(`[API-PROXY] Routing to: ${isTestMode ? 'TEST' : 'PRODUCTION'} endpoint`);

    // 2. Forward to n8n
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'n8n workflow failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[API-PROXY] Critical error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
