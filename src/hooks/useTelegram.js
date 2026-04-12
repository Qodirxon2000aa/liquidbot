import { useEffect, useMemo, useState } from 'react';

function readStartParam() {
  if (typeof window === 'undefined') return null;
  try {
    const tg = window.Telegram?.WebApp;
    const fromInit = tg?.initDataUnsafe?.start_param;
    if (fromInit != null && String(fromInit).trim()) {
      return String(fromInit).trim();
    }
    const u = new URL(window.location.href);
    const fromQuery =
      u.searchParams.get('startapp') || u.searchParams.get('tgWebAppStartParam');
    if (fromQuery) return fromQuery.trim();
    const m = (u.hash || '').match(/[#&]tgWebAppStartParam=([^&]+)/);
    if (m) return decodeURIComponent(m[1]).trim();
  } catch {
    return null;
  }
  return null;
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    if (!window.Telegram?.WebApp) return;

    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Full-height Mini App: avoid the webview shrinking when the keyboard or chrome changes.
    const ensureExpanded = () => {
      tg.expand();
    };
    tg.onEvent('viewportChanged', ensureExpanded);

    if (typeof tg.disableVerticalSwipes === 'function') {
      tg.disableVerticalSwipes();
    }

    setWebApp(tg);

    return () => {
      tg.offEvent('viewportChanged', ensureExpanded);
    };
  }, []);

  const user = webApp?.initDataUnsafe?.user || {
    id: 12345678,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    photo_url: 'https://picsum.photos/seed/john/200'
  };

  const startParam = useMemo(() => readStartParam(), [webApp]);

  return {
    webApp,
    user,
    startParam,
    isDark: webApp?.colorScheme === 'dark'
  };
};
