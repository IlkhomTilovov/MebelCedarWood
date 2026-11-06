import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { adminApi } from '@/admin/adminApi';
import { KpiCard } from '@/admin/components/KpiCard';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface KpisResponse {
  current: {
    visits: number;
    uniqueVisitors: number;
    repeatVisits: number;
    pageViews: number;
    avgSessionSeconds: number;
    conversionRate: number;
    leads: number;
    orders: number;
  };
  comparison: Record<string, number>;
}

interface TimeseriesPoint {
  day: string;
  visits: number;
  uniqueVisitors: number;
}

interface TopPage {
  pagePath: string;
  views: number;
  uniqueViewers: number;
}

interface FunnelStep {
  name: string;
  label: string;
  sessions: number;
  percentOfStart: number;
}

interface DeviceBreakdown {
  byDevice: { deviceType: string; sessions: number }[];
}

interface TrafficSource {
  trafficSource: string;
  sessions: number;
  conversions: number;
}

interface RealtimeSnapshot {
  count: number;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function DashboardPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [kpis, setKpis] = useState<KpisResponse | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [devices, setDevices] = useState<DeviceBreakdown | null>(null);
  const [traffic, setTraffic] = useState<TrafficSource[]>([]);
  const [realtime, setRealtime] = useState<RealtimeSnapshot | null>(null);

  useEffect(() => {
    adminApi.get<KpisResponse>('/kpis', params).then(setKpis).catch(() => setKpis(null));
    adminApi.get<TimeseriesPoint[]>('/visitors-timeseries', params).then(setTimeseries).catch(() => setTimeseries([]));
    adminApi.get<TopPage[]>('/top-pages', params).then(setTopPages).catch(() => setTopPages([]));
    adminApi.get<FunnelStep[]>('/funnel', params).then(setFunnel).catch(() => setFunnel([]));
    adminApi.get<DeviceBreakdown>('/devices', params).then(setDevices).catch(() => setDevices(null));
    adminApi.get<TrafficSource[]>('/traffic-sources', params).then(setTraffic).catch(() => setTraffic([]));
  }, [params.range]);

  useEffect(() => {
    adminApi.get<RealtimeSnapshot>('/realtime/snapshot').then(setRealtime).catch(() => setRealtime(null));
    const id = setInterval(() => {
      adminApi.get<RealtimeSnapshot>('/realtime/snapshot').then(setRealtime).catch(() => {});
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  const c = kpis?.current;
  const cmp = kpis?.comparison ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Analitika</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Tashriflar" value={c?.visits ?? '—'} change={cmp.visits} />
        <KpiCard label="Unique visitor" value={c?.uniqueVisitors ?? '—'} change={cmp.uniqueVisitors} />
        <KpiCard label="Sahifa ko'rishlar" value={c?.pageViews ?? '—'} change={cmp.pageViews} />
        <KpiCard label="O'rtacha session" value={c ? formatDuration(c.avgSessionSeconds) : '—'} />
        <KpiCard label="Konversiya" value={c ? `${c.conversionRate}%` : '—'} change={cmp.conversionRate} />
        <KpiCard label="Arizalar" value={c?.leads ?? '—'} change={cmp.leads} />
        <KpiCard label="Buyurtmalar" value={c?.orders ?? '—'} change={cmp.orders} />
        <KpiCard label="Qayta tashrif" value={c?.repeatVisits ?? '—'} change={cmp.repeatVisits} />
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">Visitorlar grafigi</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e1d8" />
              <XAxis dataKey="day" tickFormatter={(d) => new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' })} fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip labelFormatter={(d) => new Date(String(d)).toLocaleDateString('uz-UZ')} />
              <Line type="monotone" dataKey="visits" stroke="#b8945f" strokeWidth={2} dot={false} name="Tashriflar" />
              <Line type="monotone" dataKey="uniqueVisitors" stroke="#2f2a22" strokeWidth={2} dot={false} name="Unique" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-light-gray bg-warm-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-charcoal">Eng faol sahifalar</h2>
          <ul className="space-y-2 text-sm">
            {topPages.slice(0, 8).map((p) => (
              <li key={p.pagePath} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
                <span className="truncate text-charcoal/70">{p.pagePath}</span>
                <span className="font-semibold text-charcoal">{p.views}</span>
              </li>
            ))}
            {topPages.length === 0 && <li className="text-charcoal/40">Hozircha ma'lumot yo'q</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-light-gray bg-warm-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-charcoal">Conversion Funnel</h2>
          <ul className="space-y-2 text-sm">
            {funnel.map((step) => (
              <li key={step.name} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
                <span className="text-charcoal/70">{step.label}</span>
                <span className="font-semibold text-charcoal">
                  {step.sessions} <span className="text-charcoal/40">({step.percentOfStart}%)</span>
                </span>
              </li>
            ))}
            {funnel.length === 0 && <li className="text-charcoal/40">Hozircha ma'lumot yo'q</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-light-gray bg-warm-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-charcoal">Qurilmalar</h2>
          <ul className="space-y-2 text-sm">
            {devices?.byDevice.map((d) => (
              <li key={d.deviceType} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
                <span className="text-charcoal/70 capitalize">{d.deviceType}</span>
                <span className="font-semibold text-charcoal">{d.sessions}</span>
              </li>
            ))}
            {!devices && <li className="text-charcoal/40">Hozircha ma'lumot yo'q</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-light-gray bg-warm-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-charcoal">Traffic Sources</h2>
          <ul className="space-y-2 text-sm">
            {traffic.map((t) => (
              <li key={t.trafficSource} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
                <span className="text-charcoal/70">{t.trafficSource}</span>
                <span className="font-semibold text-charcoal">{t.sessions}</span>
              </li>
            ))}
            {traffic.length === 0 && <li className="text-charcoal/40">Hozircha ma'lumot yo'q</li>}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Hozir saytda: {realtime?.count ?? 0} visitor
        </div>
      </div>
    </div>
  );
}
