import { useEffect, useState } from 'react';
import {
  getStartParam,
  initBrowserViewport,
  initTelegramWebApp,
  isInsideTelegram,
  safeWebAppCall,
  supportsWebAppVersion,
} from '../utils/telegramWebApp';

const BROWSER_MOCK_USER = {
  id: 1234567811,
  first_name: 'John',
  last_name: 'Doe',
  username: 'johndoe',
  photo_url: 'https://picsum.photos/seed/john/200',
};

export const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);
  const insideTelegram = isInsideTelegram();

  useEffect(() => {
    if (!insideTelegram) {
      return initBrowserViewport();
    }

    const tg = initTelegramWebApp();
    if (!tg) return undefined;

    const isAndroid = String(tg.platform || '').toLowerCase().includes('android');

    const updateSizes = () => {
      const safeTop = tg.safeAreaInset?.top ?? 0;
      const safeBottom = tg.safeAreaInset?.bottom ?? 0;
      const contentTop = tg.contentSafeAreaInset?.top ?? 0;
      // In fullscreen mode (requestFullscreen) Telegram's own floating controls
      // (contentSafeAreaInset) sit *below* the OS status bar (safeAreaInset), so
      // the two insets stack instead of overlapping — add them when fullscreen.
      const isFullscreenNow = tg.isFullscreen ?? false;
      const topInset = isFullscreenNow ? safeTop + contentTop : Math.max(safeTop, contentTop);

      document.documentElement.style.setProperty(
        '--tg-height',
        `${tg.viewportStableHeight || tg.viewportHeight || window.innerHeight}px`
      );
      document.documentElement.style.setProperty('--tg-safe-top', `${topInset}px`);
      document.documentElement.style.setProperty('--tg-safe-bottom', `${safeBottom}px`);
      document.documentElement.style.setProperty(
        '--tg-header-top-offset',
        isAndroid ? '9px' : '13px'
      );
    };

    updateSizes();
    safeWebAppCall(() => tg.onEvent('viewportChanged', updateSizes));
    if (supportsWebAppVersion(tg, '8.0')) {
      safeWebAppCall(() => tg.onEvent('fullscreenChanged', updateSizes));
    }

    setWebApp(tg);

    return () => {
      safeWebAppCall(() => tg.offEvent('viewportChanged', updateSizes));
      safeWebAppCall(() => tg.offEvent('fullscreenChanged', updateSizes));
    };
  }, [insideTelegram]);

  const user = webApp?.initDataUnsafe?.user || BROWSER_MOCK_USER;

  return {
    webApp: insideTelegram ? webApp : null,
    user,
    startParam: getStartParam(webApp),
    isInsideTelegram: insideTelegram,
    isDark: webApp?.colorScheme === 'dark',
    isFullscreen: webApp?.isFullscreen ?? false,
  };
};
