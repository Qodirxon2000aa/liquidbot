import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { BodyPortal } from './BodyPortal';

const SPLASH_MS = 3200;

export function AppSplash({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <BodyPortal>
      <button
        type="button"
        className="splash-entry fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onDone}
        aria-label="Davom etish"
      >
        <div className="splash-entry__bg absolute inset-0" />
        <div className="splash-entry__glow pointer-events-none absolute h-64 w-64 rounded-full blur-3xl" />

        <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
          <p className="splash-entry__bot v2-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            @UZBSTARTSBUYBOT
          </p>

          <p className="splash-entry__tag mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200/70">
            Premium
          </p>

          <div className="splash-entry__arrow mt-10 flex flex-col items-center gap-1 text-amber-400">
            <ChevronDown className="h-8 w-8 stroke-[2.5]" />
            <ChevronDown className="-mt-5 h-8 w-8 stroke-[2.5] opacity-50" />
          </div>

          <p className="splash-entry__cta mt-8 text-lg font-extrabold leading-snug sm:text-xl">
            🛒 Arzon Oling ! Tez Oling !
          </p>

          <p className="splash-entry__hint mt-10 text-[11px] font-medium text-zinc-500">
            Davom etish uchun bosing
          </p>
        </div>
      </button>
    </BodyPortal>
  );
}
