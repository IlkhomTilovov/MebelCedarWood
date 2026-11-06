// Sessiya bo'yicha "intent score" — saqlanmaydi, har doim o'qishda hisoblanadi
// (loyihadagi event-sourced dizaynga mos). SQL ichida qo'shiladigan ifoda.
export const CONVERSION_SCORE_SQL = `
  LEAST(100,
    COALESCE((SELECT 15 FROM analytics_events e WHERE e.session_id = s.session_id AND e.event_type = 'contract_open' LIMIT 1), 0) +
    COALESCE((SELECT 15 FROM analytics_events e WHERE e.session_id = s.session_id AND e.event_type IN ('contract_scroll_75','contract_scroll_90','contract_scroll_100') LIMIT 1), 0) +
    COALESCE((SELECT 25 FROM analytics_events e WHERE e.session_id = s.session_id AND e.event_type = 'contract_accept' LIMIT 1), 0) +
    COALESCE((SELECT 15 FROM analytics_events e WHERE e.session_id = s.session_id AND e.event_type IN ('product_select','order_start') LIMIT 1), 0) +
    COALESCE((SELECT 10 FROM analytics_events e WHERE e.session_id = s.session_id AND e.event_type = 'form_start' LIMIT 1), 0) +
    CASE WHEN s.page_view_count > 3 THEN 10 ELSE 0 END +
    CASE WHEN s.click_count > 0 THEN 10 ELSE 0 END
  )
`;

export const CONVERSION_SCORE_LABEL_SQL = `
  CASE
    WHEN (${CONVERSION_SCORE_SQL}) >= 70 THEN 'HIGH'
    WHEN (${CONVERSION_SCORE_SQL}) >= 40 THEN 'MEDIUM'
    ELSE 'LOW'
  END
`;
