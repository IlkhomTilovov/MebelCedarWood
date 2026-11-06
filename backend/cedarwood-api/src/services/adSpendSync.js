import { pool } from '../db/pool.js';
import { fetchAdInsights, fetchCampaignObjectives } from './metaAdsApi.js';

// Meta Ads'dan tortilgan qatorlarni ad_spend_daily'ga yozadi (kun+reklama bo'yicha upsert).
export async function syncAdSpend(since, until) {
  const [rows, objectivesByCampaignId] = await Promise.all([
    fetchAdInsights(since, until),
    fetchCampaignObjectives(),
  ]);

  for (const row of rows) {
    const campaignObjective = objectivesByCampaignId.get(row.campaignId) ?? null;
    await pool.query(
      `INSERT INTO ad_spend_daily (platform, stat_date, campaign_id, campaign_name, campaign_objective, adset_id, adset_name, ad_id, ad_name, spend, impressions, clicks, reach, meta_leads)
       VALUES ('facebook',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (platform, stat_date, ad_id) DO UPDATE SET
         campaign_id = EXCLUDED.campaign_id,
         campaign_name = EXCLUDED.campaign_name,
         campaign_objective = EXCLUDED.campaign_objective,
         adset_id = EXCLUDED.adset_id,
         adset_name = EXCLUDED.adset_name,
         ad_name = EXCLUDED.ad_name,
         spend = EXCLUDED.spend,
         impressions = EXCLUDED.impressions,
         clicks = EXCLUDED.clicks,
         reach = EXCLUDED.reach,
         meta_leads = EXCLUDED.meta_leads`,
      [
        row.date,
        row.campaignId,
        row.campaignName,
        campaignObjective,
        row.adsetId,
        row.adsetName,
        row.adId,
        row.adName,
        row.spend,
        row.impressions,
        row.clicks,
        row.reach,
        row.metaLeads,
      ],
    );
  }

  return rows.length;
}
