import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Settings as SettingsIcon, Wallet, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = ({ title, balanceDisplay = '0', onTopupClick, onSettingsClick }) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'uz', label: 'O‘zbek' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ];

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <header className="v2-header-shell safe-top">
      <div className="mx-auto max-w-md px-4 pb-2">
        <div className="v2-header-bar">
          <button
            type="button"
            onClick={onTopupClick}
            className="liquid-chip liquid-chip-emerald group gap-2 px-2.5 py-1.5 active:scale-95"
          >
            <Wallet className="h-4 w-4 text-emerald-500" />
            <span className="max-w-[88px] truncate v2-price text-[11px] text-zinc-800 dark:text-emerald-100">
              {balanceDisplay}
            </span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 transition-transform group-hover:scale-105">
              <Plus className="h-3 w-3" />
            </span>
          </button>

          <motion.h1
            key={title}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="v2-nav-title absolute left-1/2 max-w-[38%] -translate-x-1/2 truncate bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600 bg-clip-text text-center text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400"
          >
            {title}
          </motion.h1>

          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="liquid-icon-btn gap-1 !px-2.5"
            >
              <Globe className="h-4 w-4" />
              <span className="v2-nav-label text-zinc-500">{i18n.language.split('-')[0]}</span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="liquid-modal absolute right-0 top-12 z-50 w-36 overflow-hidden rounded-3xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => changeLang(lang.code)}
                      className={`v2-body w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/20 dark:hover:bg-white/10 ${
                        i18n.language.startsWith(lang.code)
                          ? 'font-bold text-amber-600 dark:text-amber-400'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={onSettingsClick}
              className="liquid-icon-btn"
              aria-label={t('settings.title')}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
