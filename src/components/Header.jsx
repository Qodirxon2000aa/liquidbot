import { useTranslation } from 'react-i18next';
import { Globe, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const Header = ({ title, profileAvatarSrc, onSettingsClick, onProfileClick }) => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const langs = ['en', 'ru', 'uz'];
    const currentIdx = langs.indexOf(i18n.language.split('-')[0]);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  return (
    <header
      className="relative z-50 w-full shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 safe-top"
      style={{
        transform: 'translateY(10px)'
      }}
    >
      <div className="relative max-w-md mx-auto px-4 h-14 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onProfileClick}
            className="shrink-0 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
            aria-label={t('nav.profile')}
          >
            <img
              src={profileAvatarSrc}
              alt=""
              className="w-9 h-9 object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        <motion.h1 
          key={title}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-zinc-900 dark:text-white absolute left-1/2 -translate-x-1/2 uppercase tracking-tight"
        >
          {title}
        </motion.h1>

        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={toggleLanguage}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400 flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">
              {i18n.language.split('-')[0]}
            </span>
          </button>

          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};