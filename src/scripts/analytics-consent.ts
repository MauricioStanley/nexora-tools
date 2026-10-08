import { STORAGE_KEYS } from '@/config/site';
import { readStorage, writeStorage } from '@/lib/storage';

const banner = document.querySelector<HTMLElement>('[data-consent]');
const measurementId = banner?.dataset.gaId ?? '';

function loadGoogleAnalytics(id: string): void {
  if (!/^G-[A-Z0-9]+$/.test(id) || typeof window.gtag === 'function') return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js requires the `arguments` object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  window.gtag('js', new Date());
  window.gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

if (banner && measurementId) {
  const state = readStorage(STORAGE_KEYS.analyticsConsent);
  if (state === 'granted') {
    loadGoogleAnalytics(measurementId);
  } else if (state !== 'denied') {
    banner.hidden = false;
  }
  banner.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
    writeStorage(STORAGE_KEYS.analyticsConsent, 'granted');
    banner.hidden = true;
    loadGoogleAnalytics(measurementId);
  });
  banner.querySelector('[data-consent-decline]')?.addEventListener('click', () => {
    writeStorage(STORAGE_KEYS.analyticsConsent, 'denied');
    banner.hidden = true;
  });
}
