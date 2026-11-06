const RANGE_PRESETS = {
  today: 0,
  yesterday: 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export function resolveDateRange(query) {
  const { range = '7d', from: fromParam, to: toParam } = query;

  if (range === 'custom' && fromParam && toParam) {
    return { from: new Date(fromParam), to: new Date(toParam) };
  }

  if (range === 'yesterday') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { from: start, to: end };
  }

  if (range === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { from: start, to: new Date() };
  }

  const days = RANGE_PRESETS[range] ?? 7;
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from, to };
}

export function previousPeriod({ from, to }) {
  const spanMs = to.getTime() - from.getTime();
  return { from: new Date(from.getTime() - spanMs), to: new Date(from.getTime()) };
}

export function percentChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
