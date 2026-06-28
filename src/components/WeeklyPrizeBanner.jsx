import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Hourglass, X } from 'lucide-react';

const INITIAL_SECONDS = 13 * 3600 + 13 * 60 + 39;
const PROGRESS_PERCENT = 33;

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${days} kun ${hh}:${mm}:${ss}`;
}

export const WeeklyPrizeBanner = ({ onNavigate, onHeightChange }) => {
  const [dismissed, setDismissed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (dismissed) return undefined;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [dismissed]);

  useEffect(() => {
    if (!wrapRef.current) {
      onHeightChange?.(0);
      return undefined;
    }
    const el = wrapRef.current;
    const report = () => onHeightChange?.(el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dismissed, onHeightChange]);

  if (dismissed) return null;

  return (
    <div ref={wrapRef} className="fixed inset-x-0 z-[60] prize-below-header">
      <div className="liquid-prize-banner relative flex w-full items-center gap-1.5 overflow-hidden px-4 py-1.5">
        <button
          type="button"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="liquid-prize-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-base">
            🎁
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-bold leading-tight text-white">Haftalik sovrin</span>
            <span className="block truncate text-[10px] leading-tight text-white/80">
              G&apos;oliblarga Stars sovg&apos;a
            </span>
          </span>
          <span className="liquid-prize-timer flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white">
            <Hourglass className="h-2.5 w-2.5" />
            {formatCountdown(secondsLeft)}
          </span>
          <ChevronRight className="h-3 w-3 shrink-0 text-white/70" />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="liquid-prize-close flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
          aria-label="Yopish"
        >
          <X className="h-2.5 w-2.5" />
        </button>

        <div className="liquid-prize-progress-track absolute inset-x-0 bottom-0 h-1">
          <div
            className="liquid-prize-progress-fill h-full"
            style={{ width: `${PROGRESS_PERCENT}%` }}
          />
        </div>
      </div>
    </div>
  );
};
