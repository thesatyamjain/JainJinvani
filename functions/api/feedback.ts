/**
 * Cloudflare Pages Serverless Function for User Feedback & Scripture Typo Reporting
 * Endpoint: POST /api/feedback
 */

import { getCorsHeaders, handleOptionsResponse } from './cors.ts';
import { isRateLimited } from './rateLimit.ts';

interface FeedbackPayload {
  type: string;
  scriptureName: string;
  details: string;
  email: string;
  timestamp?: string;
}

export async function onRequestOptions(context: { request: Request; env: Record<string, any> }): Promise<Response> {
  return handleOptionsResponse(context.request, context.env, 'POST, OPTIONS');
}

export async function onRequestPost(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request, env } = context;
  const cors = getCorsHeaders(request, env, 'POST, OPTIONS');
  const headers = { ...cors, 'Content-Type': 'application/json; charset=utf-8' };

  try {
    // 1. Rate limiting: max 5 submissions per 60s per IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (await isRateLimited(env, 'feedback', ip, 5, 60)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'अत्यधिक अनुरोध। कृपया 1 मिनट बाद पुनः प्रयास करें।' }),
        { status: 429, headers }
      );
    }

    let data: FeedbackPayload;
    try {
      data = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: 'अमान्य JSON अनुरोध।' }),
        { status: 400, headers }
      );
    }

    // 2. Input validation
    const details = (data.details || '').trim();
    const email = (data.email || '').trim();
    const scriptureName = (data.scriptureName || '').trim() || 'अज्ञात';
    const type = (data.type || '').trim() || 'सामान्य सुझाव';

    if (!details) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया अशुद्धि या सुझाव का विवरण अवश्य लिखें।' }),
        { status: 400, headers }
      );
    }

    if (details.length > 2000) {
      return new Response(
        JSON.stringify({ ok: false, error: 'सुझाव का विवरण अधिकतम 2000 अक्षरों का होना चाहिए।' }),
        { status: 400, headers }
      );
    }

    if (scriptureName.length > 200) {
      return new Response(
        JSON.stringify({ ok: false, error: 'ग्रंथ का नाम अधिकतम 200 अक्षरों का होना चाहिए।' }),
        { status: 400, headers }
      );
    }

    if (!email || !email.includes('@') || email.length > 100) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया एक वैध ईमेल पता (अधिकतम 100 अक्षर) दर्ज करें।' }),
        { status: 400, headers }
      );
    }

    const payload = {
      type,
      scriptureName,
      details,
      email,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // 3. Forward to Google Sheets if configured in Cloudflare environment
    let sheetForwardSuccess = false;
    const webhookUrl = env?.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const gRes = await fetch(webhookUrl, {
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
    }

    // 4. Optional: Forward to Telegram if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID exist
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
      { status: 200, headers }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'सर्वर पर अनुरोध प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।',
      }),
      { status: 500, headers }
    );
  }
}
