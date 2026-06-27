import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, History, ChevronRight, CreditCard, ShieldCheck, Gift, Settings as SettingsIcon, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/UI';
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

function MenuRow({ icon, iconClass, title, subtitle, onClick, isLast }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/10 ${
        isLast ? '' : 'border-b border-white/10 dark:border-white/5'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ${iconClass}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="v2-title text-sm text-zinc-900 dark:text-white">{title}</p>
          <p className="v2-caption text-[10px]">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4.5 w-4.5 shrink-0 text-zinc-300 dark:text-zinc-600" />
    </button>
  );
}

export const ProfilePage = ({ onOpenSettings }) => {
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
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 py-2"
      >
        <div className="relative flex h-28 w-28 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-violet-300/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-amber-400 via-violet-500 to-rose-400 p-[2.5px] shadow-[0_8px_28px_-6px_rgba(139,92,246,0.5)]">
            <img
              src={user.photo_url || `https://picsum.photos/seed/${user.id}/200`}
              alt="Avatar"
              className="h-full w-full rounded-full object-cover ring-2 ring-black/5 dark:ring-white/10"
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

      <motion.div
        className="v2-amount-card !py-5 !px-5"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            'linear-gradient(150deg, rgba(16,185,129,0.28), rgba(20,184,166,0.18) 55%, rgba(8,15,20,0.4))',
          borderColor: 'rgba(16,185,129,0.35)',
        }}
      >
        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="v2-badge text-emerald-100/80">{t('profile.balance')}</p>
            <p className="v2-amount-display !text-[1.9rem] text-white" style={{ textShadow: '0 2px 24px rgba(16,185,129,0.45)' }}>
              {balanceDisplay}
              <span className="ml-1 text-sm font-semibold text-emerald-100/70">
                {t('profile.balanceCurrency')}
              </span>
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Wallet className="h-6 w-6 text-emerald-100" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMoneyOpen(true)}
          className="liquid-btn liquid-btn-secondary relative mt-4 flex !w-auto items-center gap-1.5 !py-2 px-4 text-sm"
          style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
        >
          <Plus className="h-4 w-4" />
          {t('profile.topup')}
        </button>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => setStarsModalOpen(true)} className="v2-pkg-card !py-3.5">
          <TelegramStar className="h-5 w-5" />
          <span className="v2-price text-base text-zinc-900 dark:text-white">{starOrders.length}</span>
          <span className="v2-badge !text-[8px] text-zinc-400">{t('profile.starsOrdersHeader')}</span>
        </button>
        <button type="button" onClick={() => setPremiumModalOpen(true)} className="v2-pkg-card !py-3.5">
          <ShieldCheck className="h-5 w-5 text-purple-500" />
          <span className="v2-price text-base text-zinc-900 dark:text-white">{premiumOrders.length}</span>
          <span className="v2-badge !text-[8px] text-zinc-400">{t('profile.premiumOrdersHeader')}</span>
        </button>
        <button type="button" onClick={() => setGiftModalOpen(true)} className="v2-pkg-card !py-3.5">
          <Gift className="h-5 w-5 text-rose-500" />
          <span className="v2-price text-base text-zinc-900 dark:text-white">{giftOrders.length}</span>
          <span className="v2-badge !text-[8px] text-zinc-400">{t('profile.giftOrdersHeader')}</span>
        </button>
      </div>

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
          <h3 className="v2-section-label !ml-0">{t('profile.history')}</h3>
          <History className="h-3.5 w-3.5 text-zinc-400" />
        </div>

        <div className="v2-glass overflow-hidden !p-0">
          <MenuRow
            icon={<CreditCard className="h-5 w-5 text-violet-500 dark:text-violet-400" />}
            title={t('history.openTitle')}
            subtitle={t('history.openSubtitle')}
            onClick={() => setHistoryOpen(true)}
          />
          <MenuRow
            icon={<TelegramStar className="h-5 w-5" />}
            title={t('profile.starsOrdersHeader')}
            subtitle={
              starOrders.length > 0
                ? t('profile.starsRowSubtitle', { count: starOrders.length })
                : t('profile.noStarOrders')
            }
            onClick={() => setStarsModalOpen(true)}
          />
          <MenuRow
            icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
            title={t('profile.premiumOrdersHeader')}
            subtitle={
              premiumOrders.length > 0
                ? t('profile.premiumRowSubtitle', { count: premiumOrders.length })
                : t('profile.noPremiumOrders')
            }
            onClick={() => setPremiumModalOpen(true)}
          />
          <MenuRow
            icon={<Gift className="h-5 w-5 text-rose-500" />}
            title={t('profile.giftOrdersHeader')}
            subtitle={
              giftOrders.length > 0
                ? t('profile.giftRowSubtitle', { count: giftOrders.length })
                : t('profile.noGiftOrders')
            }
            onClick={() => setGiftModalOpen(true)}
          />
          <MenuRow
            icon={<SettingsIcon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />}
            title={t('settings.title')}
            subtitle={t('settings.appearance')}
            onClick={onOpenSettings}
            isLast
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-1 text-[10px] text-zinc-400">
        <Sparkles className="h-3 w-3" />
        <span>TezPremium</span>
      </div>
    </div>
  );
};
