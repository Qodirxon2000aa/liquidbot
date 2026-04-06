useEffect(() => {
  if (!window.Telegram?.WebApp) return;

  const tg = window.Telegram.WebApp;

  tg.ready();

  // 🔥 doim expand
  const applyFullscreen = () => {
    tg.expand();

    // requestFullscreen bo‘lsa ishlatamiz
    if (typeof tg.requestFullscreen === 'function') {
      tg.requestFullscreen();
    }

    // viewport height fix
    const vh = tg.viewportHeight || window.innerHeight;
    document.documentElement.style.setProperty('--tg-height', `${vh}px`);
  };

  applyFullscreen();

  tg.onEvent('viewportChanged', applyFullscreen);

  if (typeof tg.disableVerticalSwipes === 'function') {
    tg.disableVerticalSwipes();
  }

  tg.MainButton.hide();

  const userData = userId
    ? { id: userId }
    : tg?.initDataUnsafe?.user;

  setParams({
    chatId: userData?.id,
    mode: mode || mode1,
  });

  return () => {
    tg.offEvent('viewportChanged', applyFullscreen);
  };
}, [mode, mode1]);