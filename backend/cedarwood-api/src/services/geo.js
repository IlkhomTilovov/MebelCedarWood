import geoip from 'geoip-lite';

// ISO 3166-2:UZ subdivision code -> inson o'qiydigan hudud nomi (frontend/src/lib/regions.ts bilan mos).
// Taxminiy: mobil operatorlarning IP-NAT tufayli aniqlik past bo'lishi mumkin.
const REGION_CODE_MAP = {
  TK: 'Toshkent shahri',
  TO: 'Toshkent viloyati',
  AN: 'Andijon viloyati',
  FA: "Farg'ona viloyati",
  NG: 'Namangan viloyati',
  SA: 'Samarqand viloyati',
  BU: 'Buxoro viloyati',
  NW: 'Navoiy viloyati',
  QA: 'Qashqadaryo viloyati',
  SU: 'Surxondaryo viloyati',
  JI: 'Jizzax viloyati',
  SI: 'Sirdaryo viloyati',
  XO: 'Xorazm viloyati',
  QR: "Qoraqalpog'iston Respublikasi",
};

// Taxminiy hudud/davlatni aniqlaydi va chaqiruvchiga faqat shu natijani qaytaradi —
// xom IP manzil hech qachon qaytarilmaydi yoki boshqa joyda saqlanmaydi.
const MAX_IP_LENGTH = 45; // to'liq IPv6 manzilining maksimal uzunligi

export function resolveApproxLocation(ip) {
  if (!ip || ip.length > MAX_IP_LENGTH) return { country: null, region: null };

  const cleanIp = ip.replace(/^::ffff:/, '');
  const lookup = geoip.lookup(cleanIp);
  if (!lookup) return { country: null, region: null };

  const regionCode = (lookup.region ?? '').toUpperCase();
  return {
    country: lookup.country ?? null,
    region: lookup.country === 'UZ' ? (REGION_CODE_MAP[regionCode] ?? null) : null,
  };
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? null;
}
