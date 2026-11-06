import OpenAI from 'openai';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

let client = null;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY sozlanmagan');
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

const SYSTEM_RULES = `Siz CEDAR WOOD mebel kompaniyasi uchun Conversion Analyst AI'siz.
Sizga faqat agregatsiya qilingan analytics raqamlari (xom eventlar emas) beriladi.
QOIDALAR:
- Faqat berilgan ma'lumotlar asosida xulosa chiqaring, hech narsani to'qib chiqarmang.
- Agar sabab aniq ma'lumot bilan isbotlanmasa, uni fakt sifatida emas, "ehtimoliy sabab" deb yozing.
- Agar ma'lumot hajmi kichik bo'lsa (masalan, jami tashriflar yoki konversiyalar juda kam), buni ochiq ayting va xulosalarni ehtiyotkorlik bilan bering.
- Har doim o'zbek tilida, qisqa va aniq yozing.
- Javobni har safar aynan so'ralgan formatda qaytaring (JSON so'ralsa — faqat JSON, oddiy matn so'ralsa — oddiy matn, JSON'ga o'rab yubormang).`;

function buildUserPrompt(summary, extra = '') {
  return `Analytics ma'lumotlari (JSON):\n${JSON.stringify(summary)}\n\n${extra}`;
}

// Model ba'zan oddiy matnni ham JSON/kod blokiga o'rab yuborishi mumkin — himoya sifatida
// shunday holatlarda ichidagi matnni ajratib olamiz.
function extractPlainAnswer(raw) {
  let text = raw.trim();
  const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) text = fenceMatch[1].trim();

  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed === 'object') {
        const value = parsed.answer ?? parsed.javob ?? parsed.text ?? parsed.summary;
        if (typeof value === 'string') return value;
      }
    } catch {
      // JSON emas ekan — matnni xomligicha qoldiramiz
    }
  }
  return text;
}

// Bitta kunlik/haftalik hisobot uchun: matnli AI xulosa + tuzilgan insight'lar ro'yxati.
export async function analyzeAndSummarize(summary) {
  const prompt = `${buildUserPrompt(summary)}

Quyidagi JSON formatida javob bering:
{
  "summary": "Bugungi/shu davrdagi holatning 3-5 jumlali o'zbekcha xulosasi, asosiy raqamlar bilan",
  "insights": [
    {
      "type": "funnel_drop_off | contract | form_field | cta | traffic",
      "severity": "critical | high | medium | low",
      "title": "qisqa sarlavha",
      "description": "aniq tavsif, raqamlar bilan",
      "evidence": {"any": "relevant numbers from the summary"},
      "recommendation": "konkret tavsiya",
      "priority": "critical | high | medium | low"
    }
  ]
}
Eng ko'pi bilan 5 ta insight qaytaring, eng muhimidan boshlab.`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_RULES },
      { role: 'user', content: prompt },
    ],
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return {
    summary: parsed.summary ?? '',
    insights: Array.isArray(parsed.insights) ? parsed.insights : [],
  };
}

// Admin AI chat uchun — erkin savolga matnli javob.
export async function answerQuestion(question, summary) {
  const chatSystemRules = `${SYSTEM_RULES}
Bu javob ADMIN uchun oddiy chat xabari sifatida ko'rsatiladi. Hech qanday holatda JSON formatidan yoki \`\`\` kod blokidan foydalanmang — faqat tabiiy, o'zbekcha gaplar yozing.`;
  const prompt = `${buildUserPrompt(summary)}\n\nAdmin savoli: "${question}"\n\nShu ma'lumotlar asosida qisqa va aniq javob bering (3-6 jumla), oddiy matn ko'rinishida. Agar savolga javob berish uchun ma'lumot yetarli bo'lmasa, shuni ayting.`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: chatSystemRules },
      { role: 'user', content: prompt },
    ],
  });

  return extractPlainAnswer(response.choices[0].message.content);
}
