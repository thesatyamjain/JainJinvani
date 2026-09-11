/**
 * Cloudflare Pages Serverless Function for User Feedback & Scripture Typo Reporting
 * Endpoint: POST /api/feedback
 */

interface FeedbackPayload {
  type: string;
  scriptureName: string;
  details: string;
  email: string;
  timestamp?: string;
}

const GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzuu8oiNAXX6NFrzeIxk32g2FWrJQOBdIID2uUezafAFz9lnMZQJ0yMH1Kbg6zuCJ6lHQ/exec';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

export async function onRequestPost(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;

  try {
    const data: FeedbackPayload = await request.json();

    // Input validation
    if (!data.details || !data.details.trim()) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया अशुद्धि या सुझाव का विवरण अवश्य लिखें।' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!data.email || !data.email.includes('@')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया एक वैध ईमेल पता दर्ज करें।' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const payload = {
      type: data.type || 'सामान्य सुझाव',
      scriptureName: data.scriptureName || 'अज्ञात',
      details: data.details.trim(),
      email: data.email.trim(),
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // 1. Forward to Google Sheets via server-side fetch (no client CORS limits)
    let sheetForwardSuccess = false;
    try {
      const gRes = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      sheetForwardSuccess = gRes.ok;
    } catch (gErr) {
      console.error('Failed to forward to Google Sheets:', gErr);
    }

    // 2. Optional: Forward to Telegram if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID exist in Cloudflare environment
    if (env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      try {
        const text =
          `📬 *नया जिनवाणी सुझाव / अशुद्धि सुधार रिपोर्ट*\n\n` +
          `📌 *प्रकार:* ${payload.type}\n` +
          `📖 *ग्रंथ/रचना:* ${payload.scriptureName}\n` +
          `📝 *विवरण:* ${payload.details}\n` +
          `📧 *ईमेल:* ${payload.email}\n` +
          `⏰ *समय:* ${payload.timestamp}`;

        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'आपका सुझाव सफलतापूर्वक प्राप्त हुआ। जिनवाणी सेवा में योगदान के लिए धन्यवाद!',
        syncedToSheet: sheetForwardSuccess,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'सर्वर पर अनुरोध प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
