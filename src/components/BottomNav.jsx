import { useTranslation } from 'react-i18next';
import { Home, Users, Calendar, ShoppingBag, CircleDot } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav = ({ activeTab, onTabChange, user, onProfileClick }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', icon: Home, label: t('nav.home'), accent: true },
    { id: 'market', icon: ShoppingBag, label: t('nav.market') },
    { id: 'baraban', icon: CircleDot, label: t('nav.baraban') },
    { id: 'referral', icon: Users, label: t('nav.referral') },
    { id: 'events', icon: Calendar, label: t('nav.events') },
  ];

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-2">
        <div className="liquid-nav flex min-w-0 flex-1 items-stretch justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHome = tab.accent;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="liquid-nav-item"
              >
                {isActive && (
                  <motion.div
                    layoutId="v2-nav-active"
                    className={`liquid-nav-active-pill ${
                      isHome ? 'liquid-nav-active-pill--gold' : 'liquid-nav-active-pill--default'
                    }`}
                    transition={{ type: 'spring', bounce: 0.22, duration: 0.45 }}
                  />
                )}
                <div
                  className={`liquid-nav-icon transition-colors ${
                    isActive
                      ? isHome
                        ? 'text-amber-500'
                        : 'text-violet-500 dark:text-violet-400'
                      : 'text-zinc-400'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 2} />
                </div>
                <span
                  className={`liquid-nav-label ${
                    isActive
                      ? isHome
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-violet-600 dark:text-violet-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onProfileClick}
          className="liquid-nav-avatar-btn shrink-0"
          aria-label={t('nav.profile')}
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt=""
              className="h-full w-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="liquid-nav-avatar-fallback">
              {(user?.first_name?.[0] || '?').toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
