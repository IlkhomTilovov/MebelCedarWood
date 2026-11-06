import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { eventWithTime } from '@rrweb/types';
import { adminApi } from '@/admin/adminApi';
import 'rrweb-player/dist/style.css';

interface RecordingDetail {
  id: number;
  session_id: string;
  started_at: string;
  entry_page: string | null;
  device_type: string | null;
  traffic_source: string | null;
  region: string | null;
}

export function RecordingReplayPage() {
  const { recordingId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState<RecordingDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!recordingId) return;
    adminApi
      .get<{ recording: RecordingDetail; events: eventWithTime[] }>(`/recordings/${recordingId}`)
      .then(async ({ recording: rec, events }) => {
        setRecording(rec);
        if (events.length < 2) {
          setError("Bu session uchun replay yaratish uchun yetarli event yo'q.");
          return;
        }
        const { default: RrwebPlayer } = await import('rrweb-player');
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          new RrwebPlayer({
            target: containerRef.current,
            props: { events, width: 960, height: 600, autoPlay: false },
          });
        }
      })
      .catch(() => setError('Recording topilmadi yoki yuklab bo‘lmadi.'));
  }, [recordingId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/recordings" className="text-sm text-gold hover:underline">
          ← Orqaga
        </Link>
      </div>

      {recording && (
        <div className="flex flex-wrap gap-4 text-sm text-charcoal/60">
          <span>{new Date(recording.started_at).toLocaleString('uz-UZ')}</span>
          <span>{recording.entry_page}</span>
          <span className="capitalize">{recording.device_type}</span>
          <span>{recording.traffic_source ?? 'Direct'}</span>
          <span>{recording.region ?? "Noma'lum hudud"}</span>
        </div>
      )}

      {error && <p className="text-sm text-charcoal/40">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-light-gray bg-warm-white p-4">
        <div ref={containerRef} />
      </div>
    </div>
  );
}
