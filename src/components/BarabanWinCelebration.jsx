import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import { Sparkles } from 'lucide-react';
import { Button } from './UI';
import { BodyPortal } from './BodyPortal';

const GIFT_ANIM_LOADERS = {
  gift_box: () => import('../assets/gift_box.json'),
  rose: () => import('../assets/rose.json'),
  teddy_bear: () => import('../assets/teddy_bear.json'),
  diamond: () => import('../assets/diamond.json'),
  rocket: () => import('../assets/rocket.json'),
  trophy: () => import('../assets/trophy.json'),
  ring: () => import('../assets/ring.json'),
  champagne: () => import('../assets/champagne.json'),
  bouquet: () => import('../assets/bouquet.json'),
  cake: () => import('../assets/cake.json'),
};

const GLOW = {
  gift_box: '#ffcc00',
  rose: '#fb7185',
  teddy_bear: '#f97316',
  diamond: '#22d3ee',
  rocket: '#a78bfa',
  trophy: '#facc15',
  ring: '#f0abfc',
  champagne: '#fcd34d',
  bouquet: '#4ade80',
  cake: '#fda4af',
};

function prepareLottie(mod) {
  const raw = mod?.default ?? mod;
  if (!raw || typeof raw !== 'object') return null;
  try {
    const o = JSON.parse(JSON.stringify(raw));
    delete o.tgs;
    return o;
  } catch {
    return raw;
  }
}

export function BarabanWinCelebration({ prize, onClose, onSpinAgain }) {
  const { t } = useTranslation();
  const [animData, setAnimData] = useState(null);
  const glow = GLOW[prize.id] || GLOW.gift_box;

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 5) % 100}%`,
        delay: (i % 8) * 0.08,
        color: ['#ffcc00', '#8b5cf6', '#fb7185', '#34d399', '#60a5fa'][i % 5],
      })),
    []
  );

  useEffect(() => {
    let cancelled = false;
    setAnimData(null);
    const load = GIFT_ANIM_LOADERS[prize.id] || GIFT_ANIM_LOADERS.gift_box;
    load()
      .then((mod) => {
        if (!cancelled) setAnimData(prepareLottie(mod));
      })
      .catch(() => {
        if (!cancelled) setAnimData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [prize.id]);

  return (
    <BodyPortal>
      <div
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        {confetti.map((c) => (
          <span
            key={c.id}
            className="baraban-confetti pointer-events-none absolute top-0 h-2 w-3 rounded-sm"
            style={{
              left: c.left,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}

        <div
          className="baraban-win-pop relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-zinc-900 p-6 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 20%, ${glow}44, transparent 65%)`,
            }}
          />

          <div
            className="relative mx-auto mb-4 flex h-44 w-44 items-center justify-center rounded-full"
            style={{ boxShadow: `0 0 48px ${glow}66` }}
          >
            <div className="baraban-ring-pulse absolute inset-0 rounded-full border-2" style={{ borderColor: glow }} />
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/5">
              {animData ? (
                <Lottie animationData={animData} loop={false} autoplay className="h-full w-full" />
              ) : (
                <span className="baraban-emoji-pop text-7xl leading-none">{prize.emoji}</span>
              )}
            </div>
          </div>

          <div className="relative space-y-2">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span className="v2-badge text-amber-200">{t('baraban.winTitle')}</span>
            </div>
            <h3 className="v2-display text-2xl text-white">{prize.name}</h3>
            <p className="v2-body text-sm text-zinc-400">{t('baraban.winMessage')}</p>
            <p className="text-5xl">{prize.emoji}</p>
          </div>

          <div className="relative mt-6 flex flex-col gap-2">
            <Button
              onClick={() => {
                onClose();
                window.setTimeout(onSpinAgain, 120);
              }}
            >
              {t('baraban.spinAgain')}
            </Button>
            <button type="button" onClick={onClose} className="v2-caption py-2 text-zinc-500">
              {t('baraban.close')}
            </button>
          </div>
        </div>
      </div>
    </BodyPortal>
  );
}
