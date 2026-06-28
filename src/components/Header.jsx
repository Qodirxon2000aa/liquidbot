import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, User, Wallet, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = ({ title, balanceDisplay = '0', onTopupClick, onProfileClick, profileActive = false }) => {
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
    <header className="v2-header-shell prize-safe-top">
      <div className="mx-auto max-w-md px-4 pb-1">
        <div className="v2-header-bar">
          <button
            type="button"
            onClick={onTopupClick}
            className="liquid-chip liquid-chip-emerald group gap-1.5 px-2 py-1 active:scale-95"
          >
            <Wallet className="h-3.5 w-3.5 text-emerald-500" />
            <span className="max-w-[88px] truncate v2-price text-[11px] text-zinc-800 dark:text-emerald-100">
              {balanceDisplay}
            </span>
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 transition-transform group-hover:scale-105">
              <Plus className="h-2.5 w-2.5" />
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
              className="liquid-icon-btn gap-1 !px-2"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="v2-nav-label text-zinc-500">{i18n.language.split('-')[0]}</span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 top-9 z-[70] w-36"
                >
                  <div className="liquid-modal overflow-hidden rounded-3xl">
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={onProfileClick}
              className={`liquid-icon-btn ${profileActive ? 'text-violet-500 dark:text-violet-400' : ''}`}
              aria-label={t('nav.profile')}
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
