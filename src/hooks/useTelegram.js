import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      // Local Chrome test uchun (fallback)
      const setHeight = () => {
        document.documentElement.style.setProperty('--tg-height', `${window.innerHeight}px`);
      };
      setHeight();
      window.addEventListener('resize', setHeight);
      return () => window.removeEventListener('resize', setHeight);
    }

    // ==================== TELEGRAM MODE ====================
    tg.ready();
    tg.expand();                    // oddiy expand
    tg.disableVerticalSwipes?.();   // vertikal surishni o‘chirish

    // Yangi Fullscreen rejimi (Mini Apps 2.0+)
    if (typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    // Main Button ni yashirish (ko‘pincha chat input ni ham yashiradi)
    tg.MainButton.hide();

    // Viewport height ni to‘g‘ri boshqarish
    const setHeight = () => {
      const height = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight;
      document.documentElement.style.setProperty('--tg-height', `${height}px`);
    };

    setHeight();

    const ensureExpanded = () => {
      tg.expand();
      if (typeof tg.requestFullscreen === 'function') {
        tg.requestFullscreen();
      }
      setHeight();
    };

    tg.onEvent('viewportChanged', ensureExpanded);
    tg.onEvent('fullscreenChanged', setHeight);   // yangi event

    setWebApp(tg);

    return () => {
      tg.offEvent('viewportChanged', ensureExpanded);
      tg.offEvent('fullscreenChanged', setHeight);
    };
  }, []);

  const user = webApp?.initDataUnsafe?.user || {
    id: 12345678,
    first_name: 'Test',
    username: 'testuser',
  };

  return {
    webApp,
    user,
    isDark: webApp?.colorScheme === 'dark',
  };
};