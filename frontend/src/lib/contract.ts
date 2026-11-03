export const CONTRACT_ID = 'contract-v1';
export const CONTRACT_VERSION = 'v1.0-qoralama';
export const CONTRACT_TITLE = 'Mebel buyurtma shartnomasi';

// Haqiqiy fayl joylashtirilganda shu yo'lni to'ldiring, masalan: '/contract/cedarwood-v1.pdf'
export const CONTRACT_PDF_URL: string | null = null;

export const CONTRACT_SUMMARY =
  "Ijrochi Buyurtmachi uchun buyurtma asosida mebel tayyorlaydi, yetkazib beradi va o'rnatadi; " +
  "Buyurtmachi uni qabul qilib, kelishilgan haqni to'laydi. Qavs ichidagi joylarni to'ldiring.";

export type ContractBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers?: string[]; rows: string[][] };

export interface ContractSection {
  id: string;
  heading: string;
  blocks: ContractBlock[];
}

export const CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: 'parties',
    heading: '1. Taraflar va shartnoma predmeti',
    blocks: [
      {
        type: 'list',
        items: [
          "Ijrochi: [kompaniya nomi], [manzil], [STIR], vakil: [F.I.Sh., lavozim]",
          "Buyurtmachi: [F.I.Sh.], [pasport ma'lumotlari], [yashash manzili], telefon: [raqam]",
        ],
      },
      {
        type: 'p',
        text: "1.1. Mebel turi, o'lchami, materiali (taxta turi va qoplama), furnitura (sharnir va yo'naltirgich markasi) hamda rangi 1-ilovadagi tasdiqlangan loyihada yozilgan.",
      },
      {
        type: 'p',
        text: "1.2. 1-ilova shartnomaning ajralmas qismi. Ilovada yozilmagan material, o'lcham yoki qismni talab qilish uchun taraflar qo'shimcha kelishuv tuzadi.",
      },
      { type: 'p', text: "1.3. O'rnatish manzili: [manzil]." },
    ],
  },
  {
    id: 'payment',
    heading: "2. Narx va to'lov tartibi",
    blocks: [
      {
        type: 'p',
        text: "Shartnoma summasi [___] so'm; narx loyiha tasdiqlangandan keyin o'zgarmaydi, faqat Buyurtmachi qo'shimcha ish so'rasa o'zgaradi.",
      },
      { type: 'p', text: "2.1. To'lov to'rt bosqichda amalga oshiriladi:" },
      {
        type: 'table',
        headers: ['Bosqich', 'Qachon', 'Ulushi'],
        rows: [
          ['Avans', 'Shartnoma imzolanganda', '30%'],
          ['Material to\'lovi', 'Material sotib olinganda', '[30]%'],
          ["Tayyor bo'lganda", 'Mebel tayyor bo\'lib, yetkazishdan oldin', '[30]%'],
          ['Yakuniy to\'lov', "O'rnatilib, dalolatnoma imzolanganda", '[10]%'],
        ],
      },
      {
        type: 'p',
        text: "2.2. To'lov [naqd / karta / bank o'tkazmasi] orqali qabul qilinadi; har bir to'lov uchun Ijrochi chek yoki kvitansiya beradi.",
      },
      {
        type: 'p',
        text: "2.3. Buyurtmachi to'lovni kechiktirsa, 3.3-bandga ko'ra tayyorlash muddati shu kechikish qadar suriladi.",
      },
    ],
  },
  {
    id: 'deadline',
    heading: '3. Tayyorlash muddati',
    blocks: [
      {
        type: 'p',
        text: "Ijrochi mebelni [21] ish kuni ichida tayyorlab, o'rnatib beradi. Muddat avans to'langan va Buyurtmachi loyihani yozma yoki xabar orqali tasdiqlagan kundan boshlanadi.",
      },
      {
        type: 'p',
        text: "3.1. Buyurtmachi loyihani tasdiqlagan sana [sana] va avans to'langan sana [sana] shartnomaga yoziladi.",
      },
      {
        type: 'p',
        text: "3.2. Muddat tugash sanasi shu ikki sanadan keyingisiga qarab hisoblanadi va [sana] deb yoziladi.",
      },
      {
        type: 'p',
        text: "3.3. Quyidagi hollarda muddat shu kechikish qadar suriladi va Ijrochi kechikish uchun javobgar bo'lmaydi:",
      },
      {
        type: 'list',
        items: [
          "Buyurtmachi loyihaga o'zgartirish kiritsa yoki qo'shimcha ish so'rasa;",
          "Buyurtmachi to'lovni kechiktirsa;",
          "xona tayyor bo'lmasa (ta'mir tugamagan, o'lchovga kirishga ruxsat berilmagan);",
          "Buyurtmachi o'rnatish kuniga kelmasa yoki kirishga imkon bermasa;",
          "ko'zda tutilmagan holatlar yuz bersa: tabiiy ofat, uzoq elektr uzilishi, rasmiy cheklovlar yoki yetkazib beruvchining materialni o'z vaqtida bermasligi, agar Ijrochi buni Buyurtmachiga [2] kun ichida xabar qilgan bo'lsa.",
        ],
      },
      {
        type: 'p',
        text: "3.4. Suriladigan muddat taraflar o'rtasida yozma yoki xabar (Telegram) orqali tasdiqlanadi.",
      },
    ],
  },
  {
    id: 'penalty',
    heading: '4. Muddat buzilganda javobgarlik',
    blocks: [
      {
        type: 'p',
        text: "Ijrochi aybi bilan muddat buzilsa, har bir kechikkan kun uchun shartnoma summasining [0,5]% miqdorida jarima to'laydi. Jami jarima shartnoma summasining 50% idan oshmaydi.",
      },
      {
        type: 'p',
        text: "4.1. Misol: shartnoma summasi 10 000 000 so'm bo'lib, mebel 10 kun kechiksa, jarima 10 kun × 0,5% = 5%, ya'ni 500 000 so'm bo'ladi. Eng ko'pi bilan 5 000 000 so'm.",
      },
      {
        type: 'p',
        text: "4.2. Jarima yakuniy to'lov summasidan ushlab qolinadi yoki Buyurtmachiga [5] kun ichida qaytariladi.",
      },
      { type: 'p', text: '4.3. Kechikish 3.3-bandda sanalgan holatlar tufayli bo\'lsa, jarima hisoblanmaydi.' },
      {
        type: 'p',
        text: "4.4. Kechikish [30] kundan oshsa, Buyurtmachi shartnomani bekor qilib, to'langan pulni 8-bo'limdagi tartibda qaytarib olishi mumkin.",
      },
    ],
  },
  {
    id: 'customer-duties',
    heading: '5. Buyurtmachining majburiyatlari',
    blocks: [
      {
        type: 'p',
        text: 'Muddatga amal qilish ikki tomonga bog\'liq, shuning uchun Buyurtmachi quyidagilarni bajaradi:',
      },
      {
        type: 'list',
        items: [
          "loyihani [2] kun ichida ko'rib chiqib, tasdiqlaydi yoki o'zgartirish so'raydi;",
          "to'lovlarni 2.1-bandda yozilgan muddatda amalga oshiradi;",
          "o'lchov va o'rnatish kunlari xonaga kirishga imkon beradi (xona bo'sh, ta'mir ishlari tugagan, devor va pol tekis, elektr va suv ulangan bo'lishi kerak);",
          "o'rnatish kuniga o'zi yoki vakili orqali keladi;",
          "ishlab chiqarish boshlangandan keyin loyihaga o'zgartirish kiritish kerak bo'lsa, buni Ijrochi bilan yozma kelishadi; narx va muddat shunga mos o'zgaradi.",
        ],
      },
    ],
  },
  {
    id: 'delivery',
    heading: '6. Yetkazish, o\'rnatish va qabul qilish',
    blocks: [
      {
        type: 'p',
        text: "Mebel tayyor bo'lgach, Ijrochi Buyurtmachi bilan yetkazish kunini kelishadi va o'rnatishni o'zi bajaradi. Mebel dalolatnoma imzolangandan keyin qabul qilingan hisoblanadi.",
      },
      {
        type: 'p',
        text: "6.1. Yetkazish va o'rnatish narxga kiritilgan. [Agar kiritilmagan bo'lsa, alohida narxini shu yerga yozing.]",
      },
      {
        type: 'p',
        text: "6.2. O'rnatish tugagach, Buyurtmachi mebelni 1-ilovadagi loyiha bilan solishtirib ko'radi va qabul qilish dalolatnomasini imzolaydi.",
      },
      {
        type: 'p',
        text: "6.3. Kamchilik topilsa, u dalolatnomaga yoziladi. Ijrochi uni [7] kun ichida bepul tuzatadi. Kamchilik tuzatilgach, dalolatnoma yakuniy imzolanadi.",
      },
      {
        type: 'p',
        text: "6.4. Buyurtmachi mebelni ko'rishdan asossiz bosh tortsa yoki [3] kun ichida e'tiroz bildirmasa, mebel dalolatnomasiz qabul qilingan hisoblanadi.",
      },
      { type: 'p', text: '6.5. Yakuniy to\'lov dalolatnoma imzolangandan keyin amalga oshiriladi.' },
    ],
  },
  {
    id: 'warranty',
    heading: '7. Kafolat',
    blocks: [
      {
        type: 'p',
        text: "Ijrochi tayyorlangan mebelga qabul qilish dalolatnomasi imzolangan kundan boshlab [12] oy kafolat beradi. Kafolat davrida ishlab chiqarish va o'rnatishdagi kamchiliklar bepul tuzatiladi.",
      },
      {
        type: 'p',
        text: "7.1. Kafolat muddati furnitura (sharnir, yo'naltirgich) uchun [12] oy, taxta va qoplama uchun [12] oy.",
      },
      {
        type: 'p',
        text: "7.2. Buyurtmachi kamchilik haqida Ijrochiga [telefon / Telegram] orqali xabar beradi; Ijrochi [10] kun ichida ko'rib chiqadi va tuzatadi.",
      },
      { type: 'p', text: '7.3. Kafolat quyidagi hollarda amal qilmaydi:' },
      {
        type: 'list',
        items: [
          "mebel noto'g'ri ishlatilsa yoki me'yordan ortiq yuklansa;",
          "mebelga suv tegsa yoki u haddan tashqari nam xonada saqlansa;",
          "Buyurtmachi yoki uchinchi shaxs mebelni o'zi qismlarga ajratib, o'zgartirsa yoki tuzatsa;",
          "mexanik shikast (zarba, tirnalish, kesilish) yetkazilsa;",
          'tabiiy eskirish bo\'lsa.',
        ],
      },
    ],
  },
  {
    id: 'final',
    heading: '8. Bekor qilish, nizolar va yakuniy qoidalar',
    blocks: [
      {
        type: 'p',
        text: "8.1. Ijrochi muddatni 4.4-bandda yozilgan [30] kundan ortiq kechiktirsa, Buyurtmachi shartnomani bekor qilib, to'langan pulni [10] kun ichida to'liq qaytarib olishi mumkin. Bunda 4.1-bandga ko'ra hisoblangan jarima ham to'lanadi.",
      },
      {
        type: 'p',
        text: "8.2. Buyurtmachi shartnomani o'z xohishi bilan bekor qilsa, Ijrochi shu paytgacha bajargan ish va sotib olgan material qiymatini ushlab qolib, qolgan summani [10] kun ichida qaytaradi. Ishlab chiqarilgan ish qiymati dalolatnoma bilan tasdiqlanadi.",
      },
      {
        type: 'p',
        text: "8.3. Nizolar avval muzokara yo'li bilan hal qilinadi. Kelishilmasa, nizo O'zbekiston Respublikasi qonunchiligiga muvofiq [sud nomi] sudida ko'riladi.",
      },
      {
        type: 'p',
        text: "8.4. Shartnomaga o'zgartirish va qo'shimchalar faqat yozma shaklda yoki ikkala tomon tasdiqlagan xabar (Telegram) orqali kiritiladi.",
      },
      { type: 'p', text: "8.5. Shartnoma ikki nusxada tuzilgan, har ikkala nusxa teng yuridik kuchga ega." },
    ],
  },
  {
    id: 'signatures',
    heading: 'Taraflarning imzolari',
    blocks: [
      {
        type: 'table',
        headers: ['Ijrochi', 'Buyurtmachi'],
        rows: [
          ['[kompaniya nomi]', '[F.I.Sh.]'],
          ['Imzo: _______________________', 'Imzo: _______________________'],
          ['Sana: _______________________', 'Sana: _______________________'],
        ],
      },
    ],
  },
];

export const CONSENT_TEXT =
  'Men CEDAR WOOD kompaniyasining shartnoma shartlari bilan to‘liq tanishib chiqdim va ularni qabul qilaman.';
