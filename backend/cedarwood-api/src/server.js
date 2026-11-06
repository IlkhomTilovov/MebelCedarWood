import { app } from './app.js';

const PORT = process.env.PORT || 4100;

if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
  console.error('BOT_TOKEN and CHAT_ID must be set in .env');
  process.exit(1);
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`cedarwood-api listening on 127.0.0.1:${PORT}`);
});
