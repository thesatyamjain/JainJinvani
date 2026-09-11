/**
 * Cloudflare Pages Functions - Workers AI Endpoint for Aagam AI (आगम जिज्ञासा)
 * Route: POST /api/ask
 */

interface AskPayload {
  question: string;
}

const JAIN_AI_SYSTEM_PROMPT = `आप "जैन जिनवाणी AI (आगम जिज्ञासा)" हैं — जैन धर्म, दर्शन, आगम और नित्य साधना के एक परम विनम्र एवं प्रामाणिक आध्यात्मिक मार्गदर्शक।
नियम:
1. उत्तर सदैव "जय जिनेन्द्र।" से प्रारम्भ करें।
2. दिगम्बर एवं श्वेताम्बर दोनों महान परंपराओं का पूर्ण आदर करें।
3. तत्त्वार्थ सूत्र (आचार्य उमास्वामी), समयसार (आचार्य कुन्दकुन्द), छहढाला (पंडित दौलतराम), रत्नकरण्ड श्रावकाचार एवं प्रामाणिक जैन शास्त्रों के अनुसार ही उत्तर दें।
4. भाषा शुद्ध, मधुर, विनम्र एवं स्पष्ट देवनागरी हिन्दी में हो।
5. उत्तर सारगर्भित, सटीक एवं आवश्यक श्लोक/गाथा संदर्भ युक्त हो (अधिकतम 3-4 पैराग्राफ)।`;

// Curated verified knowledge base for instant answers or when Workers AI binding is loading
const CURATED_ANSWERS: Record<string, string> = {
  'अष्टमूल गुण': `जय जिनेन्द्र।

श्रावक के **अष्टमूल गुण (8 Basic Virtues)** गृहस्थ धर्म की पहली सीढ़ी हैं। 

आचार्य समंतभद्र (रत्नकरण्ड श्रावकाचार) के अनुसार:
1. **मद्य त्याग** — किसी भी प्रकार के नशीले पदार्थों का सेवन न करना।
2. **मांस त्याग** — त्रस जीवों के घात से उत्पन्न किसी भी वस्तु का सर्वथा त्याग।
3. **मधु (शहद) त्याग** — मधुमक्खियों के अंडों व जीवन के विनाश से बचने हेतु शहद का त्याग।
4-8. **पाँच उदम्बर फलों का त्याग** — बड़, पीपल, ऊमर, कठूमर और पाकर (इनमें सूक्ष्म जीवों का वास होता है)।

*अन्य परंपरा में:* ५ अणुव्रत (अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य, परिग्रह परिमाण) एवं मद्य-मांस-मधु त्याग को अष्टमूल गुण माना जाता है।`,

  'सामायिक': `जय जिनेन्द्र।

**सामायिक (Equanimity Meditation)** जैन धर्म की परम शांतिदायक नित्य साधना है।
* **अर्थ:** 'सम' भाव में स्थित होना — राग और द्वेष को छोड़कर समस्त जीवों के प्रति समता और मैत्री भाव रखना।
* **समय मर्यादा:** सामान्यतः सामायिक का समय **दो घड़ी (४८ मिनट)** का होता है।
* **विधि:**
  1. एकांत, शांत एवं प्रासुक स्थान का चयन करें।
  2. तीन बार णमोकार महामंत्र का स्मरण एवं इर्यावही पाठ पढ़कर ईर्ष्या व प्रमाद की क्षमा माँगें।
  3. उत्तर या पूर्व दिशा की ओर मुख करके पद्मासन अथवा खड्गासन में बैठें।
  4. 'मेरी भावना' अथवा 'सामायिक पाठ' का शांत चित्त से स्वाध्याय करें।`,

  'नवकार मंत्र': `जय जिनेन्द्र।

**श्री णमोकार (नवकार) महामंत्र** जैन धर्म का अनादि-निधन, सर्वोपरि एवं सार्वभौमिक मूलमंत्र है:

> **णमो अरिहंताणं** — अनंत चतुष्टय युक्त अरिहंत देव को नमस्कार।  
> **णमो सिद्धाणं** — अष्टकर्म मुक्त अशरीरी सिद्ध परमेष्ठी को नमस्कार।  
> **णमो आयरियाणं** — मुनिसंघ नायक पंचमहाव्रत धारी आचार्यों को नमस्कार।  
> **णमो उवज्झायाणं** — द्वादशांग जिनवाणी पाठी उपाध्यायों को नमस्कार।  
> **णमो लोए सव्वसाहूणं** — लोक के समस्त दिगम्बर-श्वेताम्बर वीतरागी साधुओं को नमस्कार।  
> **एसो पंच णमोक्कारो, सव्वपावप्पणासणो।**  
> **मंगलाणं च सव्वेसिं, पढमं हवइ मंगलं॥**

यह किसी व्यक्ति विशेष को नहीं, बल्कि वीतरागता एवं सर्वोच्च आत्मिक गुणों को नमन करता है।`,

  'सात तत्त्व': `जय जिनेन्द्र।

आचार्य उमास्वामी के तत्त्वार्थ सूत्र के अनुसार सम्यग्दर्शन हेतु **सात तत्त्वों (7 Fundamentals)** का श्रद्धान आवश्यक है:
1. **जीव (Soul):** चेतना लक्षण युक्त, सुख-दुःख का ज्ञाता।
2. **अजीव (Matter/Non-living):** चेतना रहित (पुद्गल, धर्म, अधर्म, आकाश, काल)।
3. **आस्रव (Inflow):** मन-वचन-काय के योग से आत्मा में कर्मों का आना।
4. **बंध (Bondage):** कषायों के कारण आत्मा और कर्म परमाणुओं का एक-मेक हो जाना।
5. **संवर (Stoppage):** गुप्ति, समिति और धर्म द्वारा नए कर्मों के आने को रोकना।
6. **निर्जरा (Shedding):** तप और संयम से पूर्व बंधे कर्मों को क्षय करना।
7. **मोक्ष (Liberation):** समस्त कर्मों के सर्वथा नाश से पूर्ण स्वाधीनता व केवलज्ञान प्राप्त होना।`,
};

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
    const data: AskPayload = await request.json();
    const question = (data.question || '').trim();

    if (!question) {
      return new Response(
        JSON.stringify({ ok: false, error: 'कृपया अपना आध्यात्मिक प्रश्न दर्ज करें।' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Try Cloudflare Workers AI if the AI binding is active
    if (env && env.AI && typeof env.AI.run === 'function') {
      try {
        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: JAIN_AI_SYSTEM_PROMPT },
            { role: 'user', content: question },
          ],
          max_tokens: 600,
          temperature: 0.3,
        });

        if (aiResponse && aiResponse.response) {
          return new Response(
            JSON.stringify({
              ok: true,
              answer: aiResponse.response,
              source: 'workers-ai',
            }),
            { status: 200, headers: corsHeaders }
          );
        }
      } catch (aiErr) {
        console.error('Workers AI execution failed:', aiErr);
      }
    }

    // 2. Check Curated Knowledge Base
    for (const [key, answer] of Object.entries(CURATED_ANSWERS)) {
      if (question.toLowerCase().includes(key.toLowerCase())) {
        return new Response(
          JSON.stringify({
            ok: true,
            answer,
            source: 'aagam-dictionary',
          }),
          { status: 200, headers: corsHeaders }
        );
      }
    }

    // 3. Graceful Fallback
    const genericResponse = `जय जिनेन्द्र।

आपके द्वारा पूछे गए विषय — *"**${question}**"* पर जिनवाणी में गहरा विवेचन मिलता है। 

जैन दर्शन का मूल आधार **अहिंसा परमो धर्मः**, **अनेकांतवाद** और **स्याद्वाद** है। जीवन में किसी भी कार्य को करते समय सम्यग्दर्शन, सम्यग्ज्ञान और सम्यकचारित्र (रत्नत्रय) का पालन ही मोक्ष का सच्चा मार्ग है।

*सुझाव:* इस विषय पर विस्तृत स्वाध्याय हेतु आप ऐप के 'शास्त्र ग्रंथालय' में **तत्त्वार्थ सूत्र**, **समयसार** अथवा **छहढाला** का अध्ययन कर सकते हैं।`;

    return new Response(
      JSON.stringify({
        ok: true,
        answer: genericResponse,
        source: 'jain-library',
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'अनुरोध प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।',
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
