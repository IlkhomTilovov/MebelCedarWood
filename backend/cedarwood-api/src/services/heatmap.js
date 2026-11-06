import { pool } from '../db/pool.js';

const COORD_BUCKET_PX = 24;

function viewportBucket(viewportWidth) {
  if (!viewportWidth) return 'unknown';
  return viewportWidth < 768 ? 'mobile' : viewportWidth < 1200 ? 'tablet' : 'desktop';
}

export async function bumpClickHeatmap({ pagePath, x, y, viewportWidth }) {
  if (!pagePath || typeof x !== 'number' || typeof y !== 'number') return;
  const xBucket = Math.floor(x / COORD_BUCKET_PX);
  const yBucket = Math.floor(y / COORD_BUCKET_PX);
  await pool.query(
    `INSERT INTO analytics_click_heatmap (page_path, viewport_bucket, x_bucket, y_bucket, click_count)
     VALUES ($1, $2, $3, $4, 1)
     ON CONFLICT (page_path, viewport_bucket, x_bucket, y_bucket)
     DO UPDATE SET click_count = analytics_click_heatmap.click_count + 1, updated_at = now()`,
    [pagePath, viewportBucket(viewportWidth), xBucket, yBucket],
  );
}

export async function bumpScrollHeatmap({ pagePath, depth, viewportWidth }) {
  if (!pagePath || typeof depth !== 'number') return;
  await pool.query(
    `INSERT INTO analytics_scroll_heatmap (page_path, viewport_bucket, depth_bucket, visitor_count)
     VALUES ($1, $2, $3, 1)
     ON CONFLICT (page_path, viewport_bucket, depth_bucket)
     DO UPDATE SET visitor_count = analytics_scroll_heatmap.visitor_count + 1, updated_at = now()`,
    [pagePath, viewportBucket(viewportWidth), depth],
  );
}
