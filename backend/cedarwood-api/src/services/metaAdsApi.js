const API_VERSION = process.env.FACEBOOK_API_VERSION || 'v21.0';
const FIELDS = 'campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,clicks,reach';

function toDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

// Facebook/Meta Marketing API'dan kunlik, reklama darajasidagi xarajat ma'lumotlarini tortib oladi.
// Natija: [{ date, campaignId, campaignName, adsetId, adsetName, adId, adName, spend, impressions, clicks, reach }]
export async function fetchAdInsights(since, until) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
  if (!accessToken || !adAccountId) {
    throw new Error('FACEBOOK_ACCESS_TOKEN va FACEBOOK_AD_ACCOUNT_ID sozlanmagan');
  }

  const timeRange = JSON.stringify({ since: toDateOnly(since), until: toDateOnly(until) });
  const params = new URLSearchParams({
    level: 'ad',
    fields: FIELDS,
    time_range: timeRange,
    time_increment: '1',
    limit: '500',
    access_token: accessToken,
  });

  let url = `https://graph.facebook.com/${API_VERSION}/${adAccountId}/insights?${params.toString()}`;
  const rows = [];

  while (url) {
    const response = await fetch(url);
    const body = await response.json();

    if (!response.ok || body.error) {
      throw new Error(`Meta Ads API xatosi: ${body.error?.message ?? response.statusText}`);
    }

    for (const row of body.data ?? []) {
      rows.push({
        date: row.date_start,
        campaignId: row.campaign_id ?? null,
        campaignName: row.campaign_name ?? null,
        adsetId: row.adset_id ?? null,
        adsetName: row.adset_name ?? null,
        adId: row.ad_id,
        adName: row.ad_name ?? null,
        spend: Number(row.spend ?? 0),
        impressions: Number(row.impressions ?? 0),
        clicks: Number(row.clicks ?? 0),
        reach: Number(row.reach ?? 0),
      });
    }

    url = body.paging?.next ?? null;
  }

  return rows;
}
