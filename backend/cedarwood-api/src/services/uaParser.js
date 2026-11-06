import { UAParser } from 'ua-parser-js';

export function parseUserAgent(userAgentString) {
  if (!userAgentString) {
    return { deviceType: null, browser: null, os: null };
  }

  const result = UAParser(userAgentString);
  const rawDeviceType = result.device?.type;
  const deviceType = rawDeviceType === 'mobile' ? 'mobile' : rawDeviceType === 'tablet' ? 'tablet' : 'desktop';

  return {
    deviceType,
    browser: result.browser?.name ?? null,
    os: result.os?.name ?? null,
  };
}
