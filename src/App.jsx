import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/config';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WeeklyPrizeBanner } from './components/WeeklyPrizeBanner';

import { ReferralPage } from './pages/ReferralPage';
import { EventsPage } from './pages/EventsPage';
import { BarabanPage } from './pages/BarabanPage';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PaymentPage } from './pages/PaymentPage';
import { MoneyModal } from './components/MoneyModal';
import { AppSplash } from './components/AppSplash';
import { useTezpremium } from './context/TezpremiumContext';

import { useTelegram } from './hooks/useTelegram';
import { formatBalanceUzs } from './utils/balanceUzs';
import { applyTelegramChrome } from './utils/telegramWebApp';

const START_PARAM_TO_TAB = {
  payment: 'payment',
  market: 'market',
  home: 'home',
  profile: 'profile',
  referral: 'referral',
  events: 'events',
  baraban: 'baraban',
  gifts: 'market',
  settings: 'settings',
};

import { AnimatePresence, motion } from 'motion/react';

function formatHeaderCompactBalance(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) < 100000) return formatBalanceUzs(n);
  const compact = n / 1000;
  const oneDecimal = compact >= 1000 ? Math.round(compact) : Math.round(compact * 10) / 10;
  const label = Number.isInteger(oneDecimal)
    ? oneDecimal.toLocaleString('uz-UZ')
    : oneDecimal.toLocaleString('uz-UZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${label}K`;
}

export default function App() {
  const { t } = useTranslation();
  const { webApp, user, startParam } = useTelegram();
  const { apiUser } = useTezpremium();

  const [activeTab, setActiveTab] = useState('home');
  const [moneyOpen, setMoneyOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const startParamAppliedRef = useRef(false);

  const headerBalance = formatHeaderCompactBalance(apiUser?.balanceUzs ?? apiUser?.balance ?? 0);
  const [prizeBannerHeight, setPrizeBannerHeight] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty('--prize-banner-height', `${prizeBannerHeight}px`);
  }, [prizeBannerHeight]);

  useEffect(() => {
    applyTelegramChrome(webApp);
  }, [webApp]);

  useEffect(() => {
    if (!webApp) return;
    try {
      if (localStorage.getItem('app-dark') !== null) return;
    } catch {
      return;
    }
    if (webApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [webApp]);

  useEffect(() => {
    if (!startParam || startParamAppliedRef.current) return;
    const tab = START_PARAM_TO_TAB[startParam.toLowerCase()];
    if (tab) {
      setActiveTab(tab);
      startParamAppliedRef.current = true;
    }
  }, [startParam]);

  const renderPage = () => {
    switch (activeTab) {
      case 'referral':
        return <ReferralPage />;
      case 'events':
        return <EventsPage />;
      case 'baraban':
        return <BarabanPage />;
      case 'market':
        return <MarketPage onNavigateHome={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfilePage onOpenSettings={() => setActiveTab('settings')} />;
      case 'settings':
        return <SettingsPage />;
      case 'payment':
        return <PaymentPage onOpenStars={() => setActiveTab('home')} />;
      default:
        return <HomePage />;
    }
  };

  const getPageTitle = () => {
    if (activeTab === 'settings') return t('settings.title');
    if (activeTab === 'payment') return t('nav.payment');
    return t(`nav.${activeTab}`);
  };

  return (
    <div className="app">
      {showSplash ? <AppSplash onDone={() => setShowSplash(false)} /> : null}

      <div className="v2-mesh" aria-hidden>
        <div className="v2-mesh__grid" />
        <div className="v2-mesh__blob v2-mesh__blob--gold" />
        <div className="v2-mesh__blob v2-mesh__blob--violet" />
        <div className="v2-mesh__blob v2-mesh__blob--rose" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Header
          title={getPageTitle()}
          balanceDisplay={`${headerBalance} UZS`}
          onTopupClick={() => setMoneyOpen(true)}
          onProfileClick={() => setActiveTab('profile')}
          profileActive={activeTab === 'profile' || activeTab === 'settings'}
        />
        <WeeklyPrizeBanner
          onHeightChange={setPrizeBannerHeight}
          onNavigate={() => setActiveTab('events')}
        />

        <main className="content v2-main-with-header">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-md px-4 pb-28 pt-2"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />

        <BottomNav
          activeTab={activeTab === 'payment' ? 'home' : activeTab}
          onTabChange={setActiveTab}
          user={user}
          onProfileClick={() => setActiveTab('profile')}
        />
      </div>
    </div>
  );
}