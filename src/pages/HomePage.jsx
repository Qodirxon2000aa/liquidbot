import { useEffect, useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, ChevronDown, Sparkles, Loader2, X, Check } from 'lucide-react';
import { Button, Tabs } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { useTezpremium } from '../context/TezpremiumContext';
import { useTelegram } from '../hooks/useTelegram';

const TelegramStar = ({ className = 'w-6 h-6' }) => {
  const gid = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={`url(#star-gradient-${gid})`}
        stroke="#FFD700"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id={`star-gradient-${gid}`} x1="12" y1="2" x2="12" y2="21.02" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const STAR_PRIMARY = [
  { amount: 50 },
  { amount: 100 },
  { amount: 500 },
];

const STAR_EXTRA = [
  { amount: 1000 },
  { amount: 5000 },
  { amount: 10000 },
];

const PREMIUM_PLANS = [
  { id: 'p3', months: 3, discount: '20%', note: 'HADYA ORQALI', priceKey: 3 },
  { id: 'p6', months: 6, discount: '37%', note: 'HADYA ORQALI', priceKey: 6 },
  {
    id: 'p12-account',
    months: 12,
    discount: '42%',
    label: 'AKKOUNTGA KIRIB 12 OYLIK',
    note: 'AKKOUNTGA KIRIB',
    priceKey: '12account',
    delivery: 'account',
  },
];
const USER_CHECK_API = import.meta.env.VITE_USER_CHECK_API ?? 'https://tezpremium.uz/starsapi/user.php';

function UsernameRecipientField({
  label,
  username,
  onUsernameChange,
  userInfo,
  onClear,
  onConfirm,
  onSelf,
  checkingUser,
}) {
  const cleanLen = String(username || '').trim().replace(/^@/, '').length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <button
          type="button"
          onClick={onSelf}
          disabled={checkingUser}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          O&apos;zimga
        </button>
      </div>

      {userInfo ? (
        <div className="flex w-full items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800">
          {userInfo.photo ? (
            <img
              src={userInfo.photo}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-600 dark:text-blue-400">
              {String(userInfo.name || userInfo.username || '?')[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {userInfo.name || userInfo.username}
            </p>
            <p className="truncate text-xs text-zinc-500">@{userInfo.username}</p>
          </div>
          {userInfo.has_premium && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
              <ShieldCheck className="h-3 w-3" />
              Premium
            </span>
          )}
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-lg p-1 text-zinc-500 hover:bg-zinc-200/80 dark:hover:bg-zinc-700"
            aria-label="Tozalash"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm();
              }}
              placeholder="@username"
              disabled={checkingUser}
              className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-60 dark:bg-zinc-800 dark:text-white"
            />
            {checkingUser && (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={cleanLen < 4 || checkingUser}
            className="inline-flex h-[46px] shrink-0 items-center gap-1 rounded-xl bg-blue-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
          >
            <Check className="h-3.5 w-3.5" />
            Tayyor
          </button>
        </div>
      )}
    </div>
  );
}

export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useTelegram();
  const { apiUser, createOrder, createPremiumOrder, refreshUser } = useTezpremium();
  const tabLabels = [t('home.stars'), t('home.premium')];
  const [tabIdx, setTabIdx] = useState(0);
  const activeTab = tabLabels[tabIdx];

  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [checkingUser, setCheckingUser] = useState(false);
  const [toast, setToast] = useState({ show: false, ok: true, text: '' });
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: 'Muvaffaqiyatli',
    message: '',
    recipient: '',
    item: '',
  });
  const [sending, setSending] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [pricePerStar, setPricePerStar] = useState(0);
  const [premiumPrices, setPremiumPrices] = useState({
    3: 170000,
    6: 225000,
    '12account': 295000,
  });

  const [starsMoreOpen, setStarsMoreOpen] = useState(false);
  const [starsCustomInput, setStarsCustomInput] = useState('');
  const [starsLastPreset, setStarsLastPreset] = useState(STAR_PRIMARY[0]);
  const [starsSelected, setStarsSelected] = useState(() => ({
    type: 'preset',
    amount: STAR_PRIMARY[0].amount,
  }));

  const [premSelected, setPremSelected] = useState(() => PREMIUM_PLANS[0]);

  useEffect(() => {
    let cancelled = false;
    fetch('https://tezpremium.uz/uzbstar/settings.php')
      .then((r) => r.json())
      .then((d) => {
        if (!d?.ok || !d?.settings || cancelled) return;
        if (d.settings.price) setPricePerStar(Number(d.settings.price) || 0);
        const price12 = Number(d.settings['12oylik']) || 295000;
        setPremiumPrices({
          3: Number(d.settings['3oylik']) || 170000,
          6: Number(d.settings['6oylik']) || 225000,
          '12account':
            Number(d.settings['12oylik_akkount'] ?? d.settings['akkount12oylik']) || price12,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingPrices(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectStarPreset = (pkg) => {
    setStarsLastPreset(pkg);
    setStarsSelected({ type: 'preset', amount: pkg.amount });
    setStarsCustomInput('');
  };

  const onStarsCustomChange = (raw) => {
    setStarsCustomInput(raw);
    const n = parseInt(raw, 10);
    if (raw === '' || Number.isNaN(n) || n < 1) {
      setStarsSelected({
        type: 'preset',
        amount: starsLastPreset.amount,
      });
      return;
    }
    setStarsSelected({ type: 'custom', amount: n });
  };

  const isStarPresetActive = (pkg) =>
    starsSelected.type === 'preset' && starsSelected.amount === pkg.amount;

  const selectPremPreset = (pkg) => setPremSelected(pkg);

  const isPremPresetActive = (pkg) => premSelected.id === pkg.id;

  const balance = Number(apiUser?.balanceUzs ?? apiUser?.balance ?? 0);
  const starsAmount = Number(starsSelected.amount || 0);
  const starsOverall = starsAmount * pricePerStar;
  const premPriceKey = premSelected.priceKey ?? premSelected.months;
  const premOverall = Number(premiumPrices[premPriceKey] || 0);
  const getPlanPrice = (pkg) => Number(premiumPrices[pkg.priceKey ?? pkg.months] || 0);

  const showToast = (ok, text) => {
    setToast({ show: true, ok, text });
    setTimeout(() => setToast({ show: false, ok: true, text: '' }), 3000);
  };
  const showSuccessModal = ({ message, recipient, item }) => {
    setSuccessModal({
      open: true,
      title: 'Muvaffaqiyatli',
      message,
      recipient: recipient || '',
      item: item || '',
    });
  };

  const lookupUsername = async (rawUsername) => {
    const cleanUsername = String(rawUsername || '').trim().replace(/^@/, '');
    if (cleanUsername.length < 4) {
      showToast(false, "Username kamida 4 ta belgidan bo'lsin");
      return null;
    }
    setCheckingUser(true);
    try {
      const res = await fetch(
        `${USER_CHECK_API}?username=${encodeURIComponent(`@${cleanUsername}`)}`
      );
      const data = await res.json();
      if (data?.username) {
        setUserInfo(data);
        setUsername(`@${data.username}`);
        return data;
      }
      setUserInfo(null);
      showToast(false, data?.message || data?.error || 'Foydalanuvchi topilmadi');
      return null;
    } catch {
      setUserInfo(null);
      showToast(false, "Tekshirib bo'lmadi");
      return null;
    } finally {
      setCheckingUser(false);
    }
  };

  const handleSelf = async () => {
    if (!user?.username) return;
    const own = String(user.username).replace(/^@/, '');
    setUsername(`@${own}`);
    await lookupUsername(own);
  };

  const handleConfirmUsername = () => {
    lookupUsername(username);
  };

  const clearUsername = () => {
    setUsername('');
    setUserInfo(null);
  };

  const handleBuy = async () => {
    const cleanUsername = String(username || '').trim();
    if (!cleanUsername || !cleanUsername.replace(/^@/, '').trim()) {
      showToast(false, 'Username kiriting');
      return;
    }
    const normalizedRecipient = `@${cleanUsername.replace(/^@/, '')}`;

    if (tabIdx === 0) {
      if (starsAmount < 50 || starsAmount > 10000) {
        showToast(false, "50 - 10 000 oralig'ida bo'lishi kerak");
        return;
      }
      if (!pricePerStar || loadingPrices) {
        showToast(false, "Narxlar hali yuklanmadi");
        return;
      }
      if (balance < starsOverall) {
        showToast(false, 'Balans yetarli emas');
        return;
      }
      setSending(true);
      const res = await createOrder({
        amount: starsAmount,
        sent: normalizedRecipient,
        type: 'Stars',
        overall: starsOverall,
      });
      setSending(false);
      if (res?.ok) {
        await refreshUser();
        const recipient = normalizedRecipient;
        showSuccessModal({
          message: 'Telegram Stars muvaffaqiyatli yuborildi',
          recipient,
          item: `${starsAmount} Stars`,
        });
      } else {
        showToast(false, res?.message || 'Buyurtma bajarilmadi');
      }
      return;
    }

    if (balance < premOverall) {
      showToast(false, 'Balans yetarli emas');
      return;
    }
    setSending(true);
    const result = await createPremiumOrder({
      months: premSelected.months,
      sent: normalizedRecipient,
      overall: premOverall,
      ...(premSelected.delivery === 'account' ? { type: 'akkount' } : {}),
    });
    setSending(false);
    if (result?.ok) {
      await refreshUser();
      const recipient = normalizedRecipient;
      showSuccessModal({
        message: 'Telegram Premium muvaffaqiyatli yuborildi',
        recipient,
        item:
          premSelected.delivery === 'account'
            ? 'AKKOUNTGA KIRIB · 12 oy Premium'
            : `${premSelected.months} oy Premium`,
      });
    } else {
      showToast(false, result?.message || 'Premium yuborilmadi');
    }
  };

  const starsCustomInvalid =
    starsSelected.type === 'custom' &&
    (starsCustomInput.trim() === '' ||
      Number.isNaN(parseInt(starsCustomInput, 10)) ||
      parseInt(starsCustomInput, 10) < 1);

  const starsBuyLabel =
    starsSelected.type === 'preset' || !pricePerStar
      ? `${t('home.buy')} · ${(starsAmount * pricePerStar).toLocaleString('uz-UZ')} UZS`
      : `${t('home.buy')} · ${starsSelected.amount} ★`;

  const premBuyLabel = `${t('home.buy')} · ${premOverall.toLocaleString('uz-UZ')} UZS`;

  const rowStar = (active) =>
    active
      ? 'border-blue-500 bg-blue-50 shadow-sm dark:bg-blue-950/40'
      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-zinc-600';

  const rowPrem = (active) =>
    active
      ? 'border-purple-500 bg-purple-50 shadow-sm dark:bg-purple-950/35'
      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-zinc-600';

  return (
    <div className="space-y-6">
      <Tabs
        tabs={tabLabels}
        activeTab={activeTab}
        onTabChange={(label) => {
          const i = tabLabels.indexOf(label);
          if (i >= 0) setTabIdx(i);
        }}
      />

      <AnimatePresence mode="wait">
        {tabIdx === 0 ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute opacity-20"
                    initial={{
                      x: Math.random() * 400,
                      y: Math.random() * 200,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      y: [null, Math.random() * -20, Math.random() * 20],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <TelegramStar className="h-4 w-4" />
                  </motion.div>
                ))}
              </div>
              <div className="relative space-y-1 text-center">
                <TelegramStar className="mx-auto h-16 w-16 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                <h2 className="text-2xl font-bold text-white">Telegram Stars</h2>
              </div>
            </div>

            <UsernameRecipientField
              label={t('home.username')}
              username={username}
              onUsernameChange={setUsername}
              userInfo={userInfo}
              onClear={clearUsername}
              onConfirm={handleConfirmUsername}
              onSelf={handleSelf}
              checkingUser={checkingUser}
            />

            <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/95 via-white to-orange-50/60 p-4 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/15 dark:border-amber-500/25 dark:from-amber-950/35 dark:via-zinc-900 dark:to-orange-950/25 dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] dark:ring-amber-500/10">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-400/15 blur-2xl dark:bg-amber-500/10" aria-hidden />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-orange-300/10 blur-xl dark:bg-orange-500/5" aria-hidden />

              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/25">
                  <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{t('home.customAmount')}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">{t('home.customHint')}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-white/90 px-3 py-2 shadow-inner shadow-amber-500/5 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/25 dark:border-zinc-600 dark:bg-zinc-950/80 dark:focus-within:border-amber-500/50 dark:focus-within:ring-amber-500/20">
                    <TelegramStar className="h-5 w-5 shrink-0 opacity-90" />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder="750"
                      value={starsCustomInput}
                      onChange={(e) => onStarsCustomChange(e.target.value)}
                      onFocus={() => {
                        const n = parseInt(starsCustomInput, 10);
                        if (!Number.isNaN(n) && n > 0) {
                          setStarsSelected({ type: 'custom', amount: n });
                        }
                      }}
                      className="min-w-0 flex-1 border-0 bg-transparent py-1 text-[15px] font-semibold tabular-nums text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
                    />
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-amber-700/80 dark:text-amber-400/90">
                      Stars
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[4.7px]">
              <p className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t('home.stars')}
              </p>
              {STAR_PRIMARY.map((pkg) => (
                <button
                  key={pkg.amount}
                  type="button"
                  onClick={() => selectStarPreset(pkg)}
                  className={`flex w-full min-h-[44px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${rowStar(isStarPresetActive(pkg))}`}
                >
                  <TelegramStar className="h-6 w-6 shrink-0" />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-white">
                      {pkg.amount} Stars
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {(pkg.amount * pricePerStar).toLocaleString('uz-UZ')} UZS
                    </span>
                  </div>
                </button>
              ))}

              <AnimatePresence initial={false}>
                {starsMoreOpen && (
                  <motion.div
                    key="star-extra"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-[4.7px] overflow-hidden"
                  >
                    {STAR_EXTRA.map((pkg) => (
                      <button
                        key={pkg.amount}
                        type="button"
                        onClick={() => selectStarPreset(pkg)}
                        className={`flex w-full min-h-[44px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${rowStar(isStarPresetActive(pkg))}`}
                      >
                        <TelegramStar className="h-6 w-6 shrink-0" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-white">
                            {pkg.amount} Stars
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {(pkg.amount * pricePerStar).toLocaleString('uz-UZ')} UZS
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setStarsMoreOpen((o) => !o)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-blue-400 dark:hover:bg-zinc-900/50"
              >
                {t('home.more')}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${starsMoreOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <Button
              onClick={handleBuy}
              disabled={starsCustomInvalid || sending || loadingPrices || !userInfo}
              className="text-sm"
            >
              {sending ? 'Yuborilyabdi...' : starsBuyLabel}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="premium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-700">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              </div>
              <div className="relative space-y-1 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-white drop-shadow-lg" />
                <h2 className="text-2xl font-bold text-white">Telegram Premium</h2>
              </div>
            </div>

            <UsernameRecipientField
              label={t('home.username')}
              username={username}
              onUsernameChange={setUsername}
              userInfo={userInfo}
              onClear={clearUsername}
              onConfirm={handleConfirmUsername}
              onSelf={handleSelf}
              checkingUser={checkingUser}
            />

            <div className="space-y-2">
              <p className="ml-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t('home.premium')}
              </p>
              {PREMIUM_PLANS.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => selectPremPreset(pkg)}
                  className={`relative flex w-full min-h-[44px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${rowPrem(isPremPresetActive(pkg))}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                    <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span
                        className={`text-sm font-bold text-zinc-900 dark:text-white ${
                          pkg.label ? 'uppercase tracking-wide' : 'tabular-nums'
                        }`}
                      >
                        {pkg.label ?? `${pkg.months} ${t('home.months')}`}
                      </span>
                      <span className="ml-2 inline-block rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        −{pkg.discount}
                      </span>
                    </div>
                    <div className="shrink-0 flex flex-col items-end justify-end gap-1 pt-1">
                      {pkg.note && (
                        <span
                          className={`inline-block rounded-full px-2 py-[1px] text-[9px] font-bold uppercase tracking-wide text-white shadow-[0_5px_12px_-7px_rgba(0,0,0,0.55)] ring-1 ${
                            pkg.delivery === 'account'
                              ? 'border-violet-300/50 bg-gradient-to-r from-violet-500 to-fuchsia-500 ring-white/20 dark:border-violet-400/40 dark:from-violet-600 dark:to-fuchsia-600'
                              : 'border-emerald-300/50 bg-gradient-to-r from-emerald-500 to-teal-500 ring-white/20 dark:border-emerald-400/40 dark:from-emerald-600 dark:to-teal-600'
                          }`}
                        >
                          {pkg.note}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {getPlanPrice(pkg).toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button onClick={handleBuy} disabled={sending || loadingPrices || !userInfo} className="text-sm">
              {sending ? 'Yuborilyabdi...' : premBuyLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4"
            onClick={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
          >
            <motion.div
              initial={{ y: 20, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{successModal.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{successModal.message}</p>
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-white">Kimga:</span>{' '}
                  {successModal.recipient || '—'}
                </p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold text-zinc-900 dark:text-white">Yuborildi:</span>{' '}
                  {successModal.item || '—'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
                className="mt-4 h-10 w-full rounded-xl bg-blue-500 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Yopish
              </button>
            </motion.div>
          </motion.div>
        )}
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100] flex justify-center"
          >
            <div className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-white shadow-lg ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`}>
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">{toast.text || t('home.success')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
