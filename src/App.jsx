/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  const { webApp } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (webApp) {
      // Set header color to match our design
      webApp.setHeaderColor(webApp.colorScheme === 'dark' ? '#18181b' : '#ffffff');
      // Ensure it's expanded for full size feel
      webApp.expand();
    }
  }, [webApp]);

  const renderPage = () => {
    switch (activeTab) {
      case 'referral': return <ReferralPage />;
      case 'events': return <EventsPage />;
      case 'home': return <HomePage />;
      case 'market': return <MarketPage />;
      case 'profile': return <ProfilePage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  const getPageTitle = () => {
    if (activeTab === 'settings') return t('settings.title');
    return t(`nav.${activeTab}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-300 flex flex-col">
      <Header 
        title={getPageTitle()} 
        onSettingsClick={() => setActiveTab('settings')}
      />
      
      <main className="flex-1 max-w-md mx-auto w-full pt-20 pb-24 px-4 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab === 'settings' ? 'profile' : activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
