import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const applyVars = (height, safeTop, safeBottom, bg) => {
      const root = document.documentElement;
      root.style.setProperty('--tg-height',      `${height}px`);
      root.style.setProperty('--tg-safe-top',    `${safeTop}px`);
      root.style.setProperty('--tg-safe-bottom', `${safeBottom}px`);
      root.style.setProperty('--tg-bg', bg);
    };

    // ── LOCAL MODE (Chrome) ──────────────────────
    if (!window.Telegram?.WebApp) {
      const sync = () => applyVars(window.innerHeight, 0, 0, '#ffffff');
      sync();
      window.addEventListener('resize', sync);
      return () => window.removeEventListener('resize', sync);
    }

    // ── TELEGRAM MODE ────────────────────────────
    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes?.();
    tg.MainButton.hide();

    if (typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    const sync = () => {
      const safeTop    = tg.safeAreaInset?.top        ?? 0;
      const safeBottom = tg.safeAreaInset?.bottom     ?? 0;
      const contentTop = tg.contentSafeAreaInset?.top ?? 0;
      const height     = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight;
      const bg         = tg.themeParams?.bg_color ?? '#ffffff';

      applyVars(height, Math.max(safeTop, contentTop), safeBottom, bg);
    };

    sync();
    tg.onEvent('viewportChanged',   sync);
    tg.onEvent('fullscreenChanged', sync);
    tg.onEvent('themeChanged',      sync);

    setWebApp(tg);

    return () => {
      tg.offEvent('viewportChanged',   sync);
      tg.offEvent('fullscreenChanged', sync);
      tg.offEvent('themeChanged',      sync);
    };
  }, []);

  const user = webApp?.initDataUnsafe?.user || {
    id: 12345678,
    first_name: 'John',
    last_name:  'Doe',
    username:   'johndoe',
    photo_url:  'https://picsum.photos/seed/john/200',
  };

  return {
    webApp,
    user,
    isDark:       webApp?.colorScheme === 'dark',
    isFullscreen: webApp?.isFullscreen ?? false,
  };
};