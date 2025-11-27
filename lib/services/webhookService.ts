/**
 * n8n Webhook Service for PersonaFlow Hybrid
 * Sends messages to n8n workflows for AI processing
 */

export const sendToN8nWebhook = async (
  url: string,
  source: string,
  message: string,
  history: any[]
): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source, // e.g., 'chat', 'therapy', 'journal_insight'
        message,
        history, // Passing history context if the webhook supports it
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Attempt to resolve the answer from common n8n return patterns
    return data.text || data.output || data.response || data.message || JSON.stringify(data);

  } catch (error: any) {
    console.error("n8n Webhook Error:", error);
    let errorMessage = `Error connecting to your local brain (n8n): ${error.message}`;
    if (error.message.includes('Failed to fetch')) {
      errorMessage = "Error connecting to n8n: Failed to fetch. This is likely a CORS issue. Please go to your n8n Webhook node settings, find the 'Options' section, and enable 'Respond to Preflight Request (OPTIONS)'.";
    }
    return errorMessage;
  }
};
