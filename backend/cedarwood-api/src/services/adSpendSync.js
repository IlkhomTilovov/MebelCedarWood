import { pool } from '../db/pool.js';
import { fetchAdInsights } from './metaAdsApi.js';

// Meta Ads'dan tortilgan qatorlarni ad_spend_daily'ga yozadi (kun+reklama bo'yicha upsert).
export async function syncAdSpend(since, until) {
  const rows = await fetchAdInsights(since, until);

  for (const row of rows) {
    await pool.query(
      `INSERT INTO ad_spend_daily (platform, stat_date, campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, spend, impressions, clicks, reach)
       VALUES ('facebook',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (platform, stat_date, ad_id) DO UPDATE SET
         campaign_id = EXCLUDED.campaign_id,
         campaign_name = EXCLUDED.campaign_name,
         adset_id = EXCLUDED.adset_id,
         adset_name = EXCLUDED.adset_name,
         ad_name = EXCLUDED.ad_name,
         spend = EXCLUDED.spend,
         impressions = EXCLUDED.impressions,
         clicks = EXCLUDED.clicks,
         reach = EXCLUDED.reach`,
      [
        row.date,
        row.campaignId,
        row.campaignName,
        row.adsetId,
        row.adsetName,
        row.adId,
        row.adName,
        row.spend,
        row.impressions,
        row.clicks,
        row.reach,
      ],
    );
  }

  return rows.length;
}
