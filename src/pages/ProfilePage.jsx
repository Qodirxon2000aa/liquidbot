import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, History, ChevronRight, CreditCard, ShieldCheck, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Button } from '../components/UI';
import { MoneyModal } from '../components/MoneyModal';
import { ProfileHistoryModal } from '../components/ProfileHistoryModal';
import { ProfileStarsModal } from '../components/ProfileStarsModal';
import { ProfilePremiumModal } from '../components/ProfilePremiumModal';
import { ProfileGiftModal } from '../components/ProfileGiftModal';
import { useTelegram } from '../hooks/useTelegram';
import { useTezpremium } from '../context/TezpremiumContext';
import { isStarsOrder, isPremiumOrder, isGiftOrder } from '../utils/orderType';
import { formatBalanceUzs } from '../utils/balanceUzs';

const TelegramStar = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="url(#star-gradient-profile)"
      stroke="#FFD700"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient
        id="star-gradient-profile"
        x1="12"
        y1="2"
        x2="12"
        y2="21.02"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FFA500" />
      </linearGradient>
    </defs>
  </svg>
);

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useTelegram();
  const { apiUser, orders, loading: apiLoading } = useTezpremium();
  const [moneyOpen, setMoneyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [starsModalOpen, setStarsModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  const starOrders = useMemo(
    () => (orders || []).filter(isStarsOrder),
    [orders]
  );
  const premiumOrders = useMemo(
    () => (orders || []).filter(isPremiumOrder),
    [orders]
  );
  const giftOrders = useMemo(
    () => (orders || []).filter(isGiftOrder),
    [orders]
  );

  const balanceDisplay =
    apiLoading && !apiUser
      ? '…'
      : formatBalanceUzs(apiUser?.balanceUzs ?? apiUser?.balance ?? 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-2"
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 via-violet-500 to-rose-400 opacity-70 blur-sm" />
          <div className="relative h-24 w-24 rounded-full border-2 border-white/20 p-0.5 dark:border-white/10">
            <img
              src={user.photo_url || `https://picsum.photos/seed/${user.id}/200`}
              alt="Avatar"
              className="h-full w-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="text-center">
          <h2 className="v2-display text-xl text-zinc-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h2>
          <p className="v2-body text-sm text-zinc-500">@{user.username}</p>
          <p className="v2-badge mt-1 text-zinc-400">
            {t('profile.id')}: {user.id}
          </p>
        </div>
      </motion.div>

      <Card
        glass
        className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-[var(--v2-glow-emerald)]"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="v2-badge text-white/80">{t('profile.balance')}</p>
            <p className="v2-price-lg text-white">
              {balanceDisplay} <span className="text-base font-semibold opacity-80">{t('profile.balanceCurrency')}</span>
            </p>
          </div>
          <Wallet className="w-8 h-8 text-blue-200 opacity-50" />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setMoneyOpen(true)}
          className="liquid-btn liquid-btn-secondary !w-auto bg-white/25 text-white hover:bg-white/35 border-white/30"
        >
          {t('profile.topup')}
        </Button>
      </Card>

      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />
      <ProfileHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <ProfileStarsModal
        open={starsModalOpen}
        onClose={() => setStarsModalOpen(false)}
      />
      <ProfilePremiumModal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
      <ProfileGiftModal
        open={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="v2-title text-sm text-zinc-900 dark:text-white">
            {t('profile.history')}
          </h3>
          <History className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="v2-glass flex w-full items-center justify-between p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-violet-500 dark:text-violet-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="v2-title text-sm text-zinc-900 dark:text-white">
                  {t('history.openTitle')}
                </p>
                <p className="v2-caption text-[10px]">
                  {t('history.openSubtitle')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setStarsModalOpen(true)}
            className="v2-glass flex w-full items-center justify-between p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-yellow-500">
                <TelegramStar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="v2-title text-sm text-zinc-900 dark:text-white">
                  {t('profile.starsOrdersHeader')}
                </p>
                <p className="v2-caption text-[10px]">
                  {starOrders.length > 0
                    ? t('profile.starsRowSubtitle', { count: starOrders.length })
                    : t('profile.noStarOrders')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setPremiumModalOpen(true)}
            className="v2-glass flex w-full items-center justify-between p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-purple-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="v2-title text-sm text-zinc-900 dark:text-white">
                  {t('profile.premiumOrdersHeader')}
                </p>
                <p className="v2-caption text-[10px]">
                  {premiumOrders.length > 0
                    ? t('profile.premiumRowSubtitle', { count: premiumOrders.length })
                    : t('profile.noPremiumOrders')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setGiftModalOpen(true)}
            className="v2-glass flex w-full items-center justify-between p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-rose-500">
                <Gift className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="v2-title text-sm text-zinc-900 dark:text-white">
                  {t('profile.giftOrdersHeader')}
                </p>
                <p className="v2-caption text-[10px]">
                  {giftOrders.length > 0
                    ? t('profile.giftRowSubtitle', { count: giftOrders.length })
                    : t('profile.noGiftOrders')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
