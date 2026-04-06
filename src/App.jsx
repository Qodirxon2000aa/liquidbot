import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/config';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

import { ReferralPage } from './pages/ReferralPage';
import { EventsPage } from './pages/EventsPage';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

import { useTelegram } from './hooks/useTelegram';

import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { t } = useTranslation();
  const { webApp, user } = useTelegram();

  const [activeTab, setActiveTab] = useState('home');

  // ✅ user safe (Chrome + Telegram)
  const profileAvatarSrc =
    user?.photo_url || `https://picsum.photos/seed/${user?.id || 1}/200`;

  useEffect(() => {
    if (!webApp) return;

    webApp.setHeaderColor(
      webApp.colorScheme === 'dark' ? '#18181b' : '#ffffff'
    );

    webApp.expand();
  }, [webApp]);

  const renderPage = () => {
    switch (activeTab) {
      case 'referral':
        return <ReferralPage />;
      case 'events':
        return <EventsPage />;
      case 'market':
        return <MarketPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  const getPageTitle = () => {
    if (activeTab === 'settings') return t('settings.title');
    return t(`nav.${activeTab}`);
  };

  return (
    <div className="app">
      <Header
        title={getPageTitle()}
        profileAvatarSrc={profileAvatarSrc}
        onSettingsClick={() => setActiveTab('settings')}
        onProfileClick={() => setActiveTab('profile')}
      />

      <main className="content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mx-auto px-4 pt-20 pb-24"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav
        activeTab={activeTab === 'settings' ? 'profile' : activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}