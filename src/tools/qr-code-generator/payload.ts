/**
 * QR payload builders (pure, unit-tested). Each content type produces the de-facto standard
 * string that phone cameras understand. Adding a type (SMS, vCard…) = one builder here.
 */
export type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone';
export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface QrFields {
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: WifiSecurity;
  wifiHidden: boolean;
  email: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
}

export type PayloadError = 'empty' | 'invalid_url' | 'unsafe_url' | 'invalid_email' | 'invalid_phone';

export type PayloadResult = { ok: true; value: string } | { ok: false; error: PayloadError };

export const EMPTY_FIELDS: QrFields = {
  url: '',
  text: '',
  wifiSsid: '',
  wifiPassword: '',
  wifiSecurity: 'WPA',
  wifiHidden: false,
  email: '',
  emailSubject: '',
  emailBody: '',
  phone: '',
};

const BLOCKED_SCHEMES = new Set(['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']);

export function normalizeUrl(raw: string): PayloadResult {
  const value = raw.trim();
  if (!value) return { ok: false, error: 'empty' };
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const candidate = hasScheme ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: 'invalid_url' };
  }
  if (BLOCKED_SCHEMES.has(url.protocol)) return { ok: false, error: 'unsafe_url' };
  if ((url.protocol === 'http:' || url.protocol === 'https:') && !/\.[a-z0-9-]{2,}$|^localhost$|^\d{1,3}(\.\d{1,3}){3}$/i.test(url.hostname)) {
    return { ok: false, error: 'invalid_url' };
  }
  // Keep what the user typed (URL() would add a trailing slash and lowercase the host).
  return { ok: true, value: hasScheme ? value : candidate };
}

/** Escape special characters for the WIFI: format (\ ; , : ") */
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function buildWifi(ssid: string, password: string, security: WifiSecurity, hidden: boolean): PayloadResult {
  if (!ssid.trim()) return { ok: false, error: 'empty' };
  const parts = [`T:${security}`, `S:${escapeWifi(ssid)}`];
  if (security !== 'nopass') parts.push(`P:${escapeWifi(password)}`);
  if (hidden) parts.push('H:true');
  return { ok: true, value: `WIFI:${parts.join(';')};;` };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function buildEmail(address: string, subject: string, body: string): PayloadResult {
  const email = address.trim();
  if (!email) return { ok: false, error: 'empty' };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'invalid_email' };
  const params: string[] = [];
  if (subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  return { ok: true, value: `mailto:${email}${params.length ? `?${params.join('&')}` : ''}` };
}

export function buildPhone(raw: string): PayloadResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: 'empty' };
  const normalized = trimmed.replace(/[\s().-]/g, '');
  if (!/^\+?\d{3,20}$/.test(normalized)) return { ok: false, error: 'invalid_phone' };
  return { ok: true, value: `tel:${normalized}` };
}

export function buildQrPayload(type: QrType, fields: QrFields): PayloadResult {
  switch (type) {
    case 'url':
      return normalizeUrl(fields.url);
    case 'text':
      return fields.text.trim() ? { ok: true, value: fields.text } : { ok: false, error: 'empty' };
    case 'wifi':
      return buildWifi(fields.wifiSsid, fields.wifiPassword, fields.wifiSecurity, fields.wifiHidden);
    case 'email':
      return buildEmail(fields.email, fields.emailSubject, fields.emailBody);
    case 'phone':
      return buildPhone(fields.phone);
  }
}
