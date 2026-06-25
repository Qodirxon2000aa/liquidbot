export function getTelegramWebApp() {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

/** Haqiqiy Telegram ichida ekanmizmi (Chrome’da yuklangan SDK stub emas) */
export function isInsideTelegram() {
  const tg = getTelegramWebApp();
  if (!tg) return false;

  const initData = String(tg.initData || '').trim();
  if (initData.length > 0) return true;

  const platform = String(tg.platform || '').toLowerCase();
  if (!platform || platform === 'unknown' || platform === 'web') return false;

  return true;
}

export function supportsWebAppVersion(tg, minVersion) {
  if (!tg || typeof tg.isVersionAtLeast !== 'function') return false;
  try {
    return tg.isVersionAtLeast(minVersion);
  } catch {
    return false;
  }
}

export function safeWebAppCall(fn) {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function initBrowserViewport() {
  const setHeight = () => {
    document.documentElement.style.setProperty('--tg-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--tg-safe-top', '0px');
    document.documentElement.style.setProperty('--tg-safe-bottom', '0px');
    document.documentElement.style.setProperty('--tg-header-top-offset', '13px');
  };
  setHeight();
  window.addEventListener('resize', setHeight);
  return () => window.removeEventListener('resize', setHeight);
}

export function initTelegramWebApp() {
  const tg = getTelegramWebApp();
  if (!tg || !isInsideTelegram()) return null;

  safeWebAppCall(() => tg.ready());
  safeWebAppCall(() => tg.expand());
  safeWebAppCall(() => tg.MainButton?.hide?.());

  if (supportsWebAppVersion(tg, '7.7')) {
    safeWebAppCall(() => tg.disableVerticalSwipes?.());
  }

  if (supportsWebAppVersion(tg, '8.0')) {
    safeWebAppCall(() => tg.requestFullscreen?.());
  }

  return tg;
}

export function applyTelegramChrome(webApp) {
  if (!webApp || !isInsideTelegram()) return;

  safeWebAppCall(() => {
    webApp.setHeaderColor(webApp.colorScheme === 'dark' ? '#18181b' : '#ffffff');
  });
  safeWebAppCall(() => webApp.expand());
}

export function getStartParam(webApp) {
  const fromInit = webApp?.initDataUnsafe?.start_param;
  if (fromInit) return String(fromInit);

  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('tgWebAppStartParam');
}
