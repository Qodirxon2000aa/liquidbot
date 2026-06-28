import { useEffect, useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, ChevronDown, Sparkles, Loader2, X, Check, Crown } from 'lucide-react';
import { Button, Tabs, PageHero, SectionLabel } from '../components/UI';
import { BodyPortal } from '../components/BodyPortal';
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
const STAR_PRICE_UZS = 220;

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
        <SectionLabel>{label}</SectionLabel>
        <button
          type="button"
          onClick={onSelf}
          disabled={checkingUser}
          className="liquid-chip liquid-chip-gold px-3 py-1.5 disabled:opacity-50"
        >
          O&apos;zimga
        </button>
      </div>

      {userInfo ? (
        <div className="v2-glass flex w-full items-center gap-2.5 px-3 py-2.5">
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
            <p className="v2-title truncate text-sm text-zinc-900 dark:text-white">
              {userInfo.name || userInfo.username}
            </p>
            <p className="truncate text-xs text-zinc-500">@{userInfo.username}</p>
          </div>
          {userInfo.has_premium && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-3xl bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
              <ShieldCheck className="h-3 w-3" />
              Premium
            </span>
          )}
          <button
            type="button"
            onClick={onClear}
            className="liquid-icon-btn !p-1"
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
              className="liquid-input text-sm disabled:opacity-60"
            />
            {checkingUser && (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={cleanLen < 4 || checkingUser}
            className="liquid-btn liquid-btn-gold inline-flex h-[46px] w-auto shrink-0 items-center gap-1 px-3 disabled:cursor-not-allowed disabled:opacity-40"
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
  const starsOverall = starsAmount * STAR_PRICE_UZS;
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
      if (loadingPrices) {
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


  const rowPrem = (active) => (active ? 'v2-row-active-premium' : 'v2-row-idle');

  return (
    <div className="space-y-6">
      <Tabs
        tabs={tabLabels}
        activeTab={activeTab}
        variant="product"
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
            <PageHero variant="stars" className="!h-48">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute opacity-30"
                    initial={{
                      x: Math.random() * 400,
                      y: Math.random() * 224,
                      scale: Math.random() * 0.5 + 0.4,
                    }}
                    animate={{
                      y: [null, Math.random() * -24, Math.random() * 24],
                      opacity: [0.12, 0.4, 0.12],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <TelegramStar className="h-3.5 w-3.5" />
                  </motion.div>
                ))}
              </div>

              <span className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-100/90 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Tezkor
              </span>

              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(255,204,0,0.35) 0%, transparent 70%)',
                    }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  >
                    {[0, 120, 240].map((deg) => (
                      <div
                        key={deg}
                        className="absolute left-1/2 top-1/2 h-2 w-2"
                        style={{
                          transform: `rotate(${deg}deg) translate(2.9rem) translate(-50%, -50%)`,
                        }}
                      >
                        <TelegramStar className="h-2.5 w-2.5 drop-shadow-[0_0_6px_rgba(255,204,0,0.8)]" />
                      </div>
                    ))}
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10"
                  >
                    <TelegramStar className="h-14 w-14 drop-shadow-[0_0_24px_rgba(255,204,0,0.7)]" />
                  </motion.div>
                </div>
                <h2 className="v2-hero-title v2-text-shimmer">Telegram Stars</h2>
                <p className="v2-hero-sub text-amber-200/90">{t('home.starsSubtitle')}</p>
              </div>
            </PageHero>

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

            <div className="v2-glass relative overflow-hidden p-4">

              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/25">
                  <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="v2-title text-sm text-zinc-900 dark:text-white">{t('home.customAmount')}</p>
                    <p className="v2-caption mt-0.5">{t('home.customHint')}</p>
                  </div>
                  <div className="liquid-input flex items-center gap-2 !py-2 focus-within:border-amber-400/50 focus-within:shadow-[var(--liquid-inset),0_0_0_3px_rgba(255,204,0,0.15)]">
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
                      className="v2-price min-w-0 flex-1 border-0 bg-transparent py-1 text-[15px] outline-none placeholder:font-normal placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
                    />
                    <span className="v2-badge shrink-0 text-amber-700/90 dark:text-amber-400/90">
                      Stars
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[4.7px]">
              <SectionLabel className="mb-2">{t('home.stars')}</SectionLabel>
              {STAR_PRIMARY.map((pkg) => (
                <button
                  key={pkg.amount}
                  type="button"
                  onClick={() => selectStarPreset(pkg)}
                  className={`flex w-full min-h-[44px] items-center gap-3 rounded-3xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${
                    isStarPresetActive(pkg) ? 'v2-row-active-stars' : 'v2-row-idle'
                  }`}
                >
                  <TelegramStar className="h-6 w-6 shrink-0" />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="v2-title text-sm tabular-nums text-zinc-900 dark:text-white">
                      {pkg.amount} Stars
                    </span>
                    <span className="v2-price shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                      {(pkg.amount * STAR_PRICE_UZS).toLocaleString('uz-UZ')} UZS
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
                        className={`flex w-full min-h-[44px] items-center gap-3 rounded-3xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${
                          isStarPresetActive(pkg) ? 'v2-row-active-stars' : 'v2-row-idle'
                        }`}
                      >
                        <TelegramStar className="h-6 w-6 shrink-0" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <span className="v2-title text-sm tabular-nums text-zinc-900 dark:text-white">
                            {pkg.amount} Stars
                          </span>
                          <span className="v2-price shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                            {(pkg.amount * STAR_PRICE_UZS).toLocaleString('uz-UZ')} UZS
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
                className="liquid-btn liquid-btn-outline flex w-full items-center justify-center gap-2 !py-2.5 text-sm"
              >
                {t('home.more')}
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${starsMoreOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="liquid-dock">
              <div className="min-w-0 flex-1">
                <p className="v2-caption !text-[10px]">{t('home.stars')}</p>
                <p className="v2-price text-sm text-zinc-900 dark:text-white">
                  {starsOverall.toLocaleString('uz-UZ')} UZS
                </p>
              </div>
              <Button
                onClick={handleBuy}
                disabled={
                  starsCustomInvalid ||
                  sending ||
                  (starsSelected.type === 'preset' && loadingPrices) ||
                  !userInfo
                }
                className="!w-auto px-5 text-sm"
              >
                {sending ? 'Yuborilyabdi...' : t('home.buy')}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="premium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <PageHero variant="premium" className="!h-48">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(14)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute opacity-25 text-violet-200"
                    initial={{
                      x: Math.random() * 400,
                      y: Math.random() * 224,
                      scale: Math.random() * 0.5 + 0.4,
                    }}
                    animate={{
                      y: [null, Math.random() * -20, Math.random() * 20],
                      opacity: [0.1, 0.35, 0.1],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.div>
                ))}
              </div>

              <span className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-100/90 backdrop-blur-md">
                <Crown className="h-3 w-3" />
                VIP
              </span>

              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
                    }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-dashed border-violet-300/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  >
                    {[0, 90, 180, 270].map((deg) => (
                      <div
                        key={deg}
                        className="absolute left-1/2 top-1/2 h-2 w-2"
                        style={{
                          transform: `rotate(${deg}deg) translate(2.9rem) translate(-50%, -50%)`,
                        }}
                      >
                        <Sparkles className="h-3 w-3 text-violet-200 drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
                      </div>
                    ))}
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-500/20 ring-1 ring-violet-200/40"
                  >
                    <ShieldCheck className="h-9 w-9 text-violet-100 drop-shadow-[0_0_20px_rgba(167,139,250,0.7)]" />
                  </motion.div>
                </div>
                <h2 className="v2-hero-title v2-text-shimmer-violet">Telegram Premium</h2>
                <p className="v2-hero-sub text-violet-200/90">{t('home.premiumSubtitle')}</p>
              </div>
            </PageHero>

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

            <div className="space-y-2.5">
              <SectionLabel>{t('home.premium')}</SectionLabel>
              {PREMIUM_PLANS.map((pkg) => {
                const active = isPremPresetActive(pkg);
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => selectPremPreset(pkg)}
                    className={`relative flex w-full min-h-[64px] items-center gap-3 rounded-3xl border px-4 py-3 text-left transition-all active:scale-[0.99] ${rowPrem(active)}`}
                  >
                    {pkg.note && (
                      <span
                        className={`v2-pkg-ribbon ${
                          pkg.delivery === 'account'
                            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                      >
                        {pkg.note}
                      </span>
                    )}
                    {active && (
                      <span className="v2-pkg-check bg-violet-500">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-purple-100 dark:bg-purple-900/40">
                      <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className={`v2-title block text-sm text-zinc-900 dark:text-white ${
                            pkg.label ? 'uppercase tracking-wide' : 'tabular-nums'
                          }`}
                        >
                          {pkg.label ?? `${pkg.months} ${t('home.months')}`}
                        </span>
                        <span className="v2-badge mt-1 inline-block rounded-3xl bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          −{pkg.discount}
                        </span>
                      </div>
                      <span className="v2-price shrink-0 text-sm text-zinc-700 dark:text-zinc-300">
                        {getPlanPrice(pkg).toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="liquid-dock">
              <div className="min-w-0 flex-1">
                <p className="v2-caption !text-[10px]">{t('home.premium')}</p>
                <p className="v2-price text-sm text-zinc-900 dark:text-white">
                  {premOverall.toLocaleString('uz-UZ')} UZS
                </p>
              </div>
              <Button
                onClick={handleBuy}
                disabled={sending || loadingPrices || !userInfo}
                variant="violet"
                className="!w-auto px-5 text-sm"
              >
                {sending ? 'Yuborilyabdi...' : t('home.buy')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BodyPortal>
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
              className="liquid-modal w-full max-w-sm rounded-3xl p-5 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="v2-display text-lg text-zinc-900 dark:text-white">{successModal.title}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{successModal.message}</p>
              <div className="liquid-glass mt-3 rounded-3xl px-3 py-2 text-left text-sm">
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
                className="liquid-btn liquid-btn-violet mt-4 h-10 w-full !py-2 text-sm"
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
            <div className={`flex items-center gap-2 rounded-3xl px-6 py-3 text-white shadow-lg ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`}>
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">{toast.text || t('home.success')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </BodyPortal>
    </div>
  );
};
