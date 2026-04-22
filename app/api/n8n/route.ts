import { NextResponse } from 'next/server';

/**
 * PersonaFlow n8n Proxy
 * Forwards requests server-side to bypass CORS.
 * Reads N8N_WEBHOOK_URL from Vercel's secret environment variables.
 */

export async function POST(request: Request) {
  const targetUrl = process.env.N8N_WEBHOOK_URL;

  if (!targetUrl) {
    console.error('[API-PROXY] N8N_WEBHOOK_URL is not set in environment variables');
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL not configured on server' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    console.log('[API-PROXY] Forwarding to:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API-PROXY] n8n error:', response.status, errorText);
      return NextResponse.json(
        { error: 'n8n returned an error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('[API-PROXY] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to reach n8n', details: error.message },
      { status: 502 }
    );
  }
}
