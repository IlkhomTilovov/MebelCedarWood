import { Router } from 'express';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { addSseClient, removeSseClient, getSnapshot } from '../../services/realtimeHub.js';

export const adminRealtimeRouter = Router();
adminRealtimeRouter.use(requireAdmin);

adminRealtimeRouter.get('/realtime/snapshot', (req, res) => {
  res.json(getSnapshot());
});

adminRealtimeRouter.get('/realtime/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('\n');
  res.write(`data: ${JSON.stringify(getSnapshot())}\n\n`);

  addSseClient(res);
  req.on('close', () => removeSseClient(res));
});
