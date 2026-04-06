import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    // ✅ LOCAL MODE (Chrome)
    if (!window.Telegram?.WebApp) {
      const setHeight = () => {
        const height = window.innerHeight;
        document.documentElement.style.setProperty('--tg-height', `${height}px`);
      };

      setHeight();
      window.addEventListener('resize', setHeight);

      return () => {
        window.removeEventListener('resize', setHeight);
      };
    }

    // ✅ TELEGRAM MODE
    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();

    if (typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    tg.disableVerticalSwipes?.();
    tg.MainButton.hide();

    const setHeight = () => {
      const height = tg.viewportHeight || window.innerHeight;
      document.documentElement.style.setProperty('--tg-height', `${height}px`);
    };

    setHeight();

    const ensureExpanded = () => {
      tg.expand();
      setHeight();
    };

    tg.onEvent('viewportChanged', ensureExpanded);

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

  return {
    webApp,
    user,
    isDark: webApp?.colorScheme === 'dark'
  };
};