import { Router } from 'express';
import { z } from 'zod';
import { parseUserAgent } from '../services/uaParser.js';
import { getClientIp, resolveApproxLocation } from '../services/geo.js';
import { enqueueIngestItem } from '../services/ingestQueue.js';
import { recordHeartbeat } from '../services/realtimeHub.js';

const eventSchema = z.object({
  type: z.string().min(1).max(64),
  occurredAt: z.string(),
  pagePath: z.string().max(512).nullable().optional(),
  pageUrl: z.string().max(1024).nullable().optional(),
  pageTitle: z.string().max(256).nullable().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

const batchSchema = z.object({
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  isNewSession: z.boolean().optional(),
  isNewVisitor: z.boolean().optional(),
  device: z
    .object({
      type: z.enum(['mobile', 'desktop', 'tablet']).optional(),
      screenWidth: z.number().optional(),
      screenHeight: z.number().optional(),
      language: z.string().max(32).optional(),
    })
    .optional(),
  utm: z
    .object({
      source: z.string().max(128).optional(),
      medium: z.string().max(128).optional(),
      campaign: z.string().max(128).optional(),
      content: z.string().max(128).optional(),
      term: z.string().max(128).optional(),
    })
    .optional(),
  trafficSource: z.string().max(64).optional(),
  referrer: z.string().max(1024).optional(),
  landingPage: z.string().max(512).optional(),
  events: z.array(eventSchema).min(1).max(100),
});

export const eventsRouter = Router();

eventsRouter.post('/events', (req, res) => {
  const parsed = batchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload' });
  }
  const body = parsed.data;

  const ua = parseUserAgent(req.headers['user-agent']);
  const ip = getClientIp(req);
  const geo = resolveApproxLocation(ip); // ip discarded after this call, never persisted

  const device = {
    type: body.device?.type ?? ua.deviceType,
    browser: ua.browser,
    os: ua.os,
    screenWidth: body.device?.screenWidth ?? null,
    screenHeight: body.device?.screenHeight ?? null,
    language: body.device?.language ?? null,
  };

  const lastEvent = body.events[body.events.length - 1];
  recordHeartbeat(body.sessionId, {
    visitorId: body.visitorId,
    deviceType: device.type,
    trafficSource: body.trafficSource ?? null,
    currentPage: lastEvent?.pagePath ?? null,
  });

  enqueueIngestItem({
    visitorId: body.visitorId,
    sessionId: body.sessionId,
    isNewSession: Boolean(body.isNewSession),
    device,
    geo,
    utm: body.utm ?? null,
    trafficSource: body.trafficSource ?? null,
    referrer: body.referrer ?? null,
    landingPage: body.landingPage ?? null,
    events: body.events,
  });

  res.status(202).json({ ok: true });
});
