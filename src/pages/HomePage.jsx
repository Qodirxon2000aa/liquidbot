import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { Button, Input, Tabs } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';

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
  { amount: 50, price: '$0.99' },
  { amount: 100, price: '$1.89' },
  { amount: 500, price: '$8.99' },
];

const STAR_EXTRA = [
  { amount: 1000, price: '$16.99' },
  { amount: 2500, price: '$39.99' },
  { amount: 5000, price: '$74.99' },
];

const PREMIUM_PLANS = [
  { months: 3, price: '$11.99', discount: '15%' },
  { months: 6, price: '$19.99', discount: '25%' },
  { months: 12, price: '$35.99', discount: '40%' },
];

export const HomePage = () => {
  const { t } = useTranslation();
  const tabLabels = [t('home.stars'), t('home.premium')];
  const [tabIdx, setTabIdx] = useState(0);
  const activeTab = tabLabels[tabIdx];

  const [username, setUsername] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [starsMoreOpen, setStarsMoreOpen] = useState(false);
  const [starsCustomInput, setStarsCustomInput] = useState('');
  const [starsLastPreset, setStarsLastPreset] = useState(STAR_PRIMARY[0]);
  const [starsSelected, setStarsSelected] = useState(() => ({
    type: 'preset',
    amount: STAR_PRIMARY[0].amount,
    price: STAR_PRIMARY[0].price,
  }));

  const [premSelected, setPremSelected] = useState(() => PREMIUM_PLANS[0]);

  const selectStarPreset = (pkg) => {
    setStarsLastPreset(pkg);
    setStarsSelected({ type: 'preset', amount: pkg.amount, price: pkg.price });
    setStarsCustomInput('');
  };

  const onStarsCustomChange = (raw) => {
    setStarsCustomInput(raw);
    const n = parseInt(raw, 10);
    if (raw === '' || Number.isNaN(n) || n < 1) {
      setStarsSelected({
        type: 'preset',
        amount: starsLastPreset.amount,
        price: starsLastPreset.price,
      });
      return;
    }
    setStarsSelected({ type: 'custom', amount: n });
  };

  const isStarPresetActive = (pkg) =>
    starsSelected.type === 'preset' && starsSelected.amount === pkg.amount;

  const selectPremPreset = (pkg) => setPremSelected(pkg);

  const isPremPresetActive = (pkg) => premSelected.months === pkg.months;

  const handleBuy = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const starsCustomInvalid =
    starsSelected.type === 'custom' &&
    (starsCustomInput.trim() === '' ||
      Number.isNaN(parseInt(starsCustomInput, 10)) ||
      parseInt(starsCustomInput, 10) < 1);

  const starsBuyLabel =
    starsSelected.type === 'preset'
      ? `${t('home.buy')} · ${starsSelected.price}`
      : `${t('home.buy')} · ${starsSelected.amount} ★`;

  const premBuyLabel = `${t('home.buy')} · ${premSelected.price}`;

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

            <Input label={t('home.username')} placeholder="@username" value={username} onChange={setUsername} />

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
                    <span className="shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{pkg.price}</span>
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
                            {pkg.price}
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

            <Button onClick={handleBuy} disabled={starsCustomInvalid} className="text-sm">
              {starsBuyLabel}
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

            <Input label={t('home.username')} placeholder="@username" value={username} onChange={setUsername} />

            <div className="space-y-2">
              <p className="ml-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t('home.premium')}
              </p>
              {PREMIUM_PLANS.map((pkg) => (
                <button
                  key={pkg.months}
                  type="button"
                  onClick={() => selectPremPreset(pkg)}
                  className={`flex w-full min-h-[44px] items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all active:scale-[0.99] ${rowPrem(isPremPresetActive(pkg))}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40">
                    <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-sm font-bold tabular-nums text-zinc-900 dark:text-white">
                        {pkg.months} {t('home.months')}
                      </span>
                      <span className="ml-2 inline-block rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        −{pkg.discount}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{pkg.price}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button onClick={handleBuy} className="text-sm">
              {premBuyLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100] flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-white shadow-lg">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">{t('home.success')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
