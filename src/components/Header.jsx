import { useTranslation } from 'react-i18next';
import { Globe, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const Header = ({ title, onSettingsClick }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const langs = ['en', 'ru', 'uz'];
    const currentIdx = langs.indexOf(i18n.language.split('-')[0]);
    const nextLang = langs[(currentIdx + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 safe-top">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">TWA</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-white hidden sm:block">App</span>
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
            <span className="text-[10px] font-bold uppercase">{i18n.language.split('-')[0]}</span>
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
