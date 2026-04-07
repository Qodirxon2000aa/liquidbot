import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header = ({ title, profileAvatarSrc, onSettingsClick, onProfileClick }) => {
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
    <header className="relative z-50 w-full shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 safe-top">
      <div className="relative max-w-md mx-auto px-4 h-14 flex items-center justify-between">

        {/* PROFILE */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onProfileClick}
            className="shrink-0 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700 overflow-hidden"
          >
            <img
              src={profileAvatarSrc}
              alt=""
              className="w-9 h-9 object-cover"
            />
          </button>
        </div>

        {/* TITLE */}
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-zinc-900 dark:text-white absolute left-1/2 -translate-x-1/2 uppercase"
        >
          {title}
        </motion.h1>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center gap-1 sm:gap-2">

          {/* LANGUAGE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">
              {i18n.language.split('-')[0]}
            </span>
          </button>

          {/* DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-12 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                      i18n.language.startsWith(lang.code)
                        ? 'font-bold text-blue-500'
                        : ''
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SETTINGS */}
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};