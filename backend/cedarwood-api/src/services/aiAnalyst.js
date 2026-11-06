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
- Javobni faqat so'ralgan JSON formatida qaytaring, boshqa matn qo'shmang.`;

function buildUserPrompt(summary, extra = '') {
  return `Analytics ma'lumotlari (JSON):\n${JSON.stringify(summary)}\n\n${extra}`;
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
  const prompt = `${buildUserPrompt(summary)}\n\nAdmin savoli: "${question}"\n\nShu ma'lumotlar asosida qisqa va aniq javob bering (3-6 jumla). Agar savolga javob berish uchun ma'lumot yetarli bo'lmasa, shuni ayting.`;

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_RULES },
      { role: 'user', content: prompt },
    ],
  });

  return response.choices[0].message.content;
}
