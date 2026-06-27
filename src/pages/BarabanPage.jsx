import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Button } from '../components/UI';
import { BarabanWinCelebration } from '../components/BarabanWinCelebration';

const WHEEL_PRIZES = [
  { id: 'gift_box', emoji: '🎁', name: "Sovg'a qutisi" },
  { id: 'rose', emoji: '🌹', name: 'Atirgul' },
  { id: 'teddy_bear', emoji: '🐻', name: 'Ayiqcha' },
  { id: 'diamond', emoji: '💎', name: 'Olmos' },
  { id: 'rocket', emoji: '🚀', name: 'Raketa' },
  { id: 'trophy', emoji: '🏆', name: 'Kubok' },
  { id: 'ring', emoji: '💍', name: 'Uzuk' },
  { id: 'champagne', emoji: '🍾', name: 'Shampan' },
  { id: 'bouquet', emoji: '💐', name: 'Gul dasta' },
  { id: 'cake', emoji: '🎂', name: 'Tort' },
];

const SEGMENT_COUNT = WHEEL_PRIZES.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const SPIN_MS = 4800;

const WHEEL_COLORS = [
  '#ffcc00',
  '#8b5cf6',
  '#fb7185',
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#ec4899',
  '#06b6d4',
  '#a855f7',
  '#f97316',
];

function buildConicGradient() {
  const stops = WHEEL_COLORS.map((color, i) => {
    const start = i * SEGMENT_ANGLE;
    const end = (i + 1) * SEGMENT_ANGLE;
    return `${color} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from -90deg, ${stops.join(', ')})`;
}

export const BarabanPage = () => {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const spinLockRef = useRef(false);
  const pendingPrizeRef = useRef(null);
  const wheelGradient = useMemo(() => buildConicGradient(), []);

  const finishSpin = useCallback(() => {
    if (!pendingPrizeRef.current) return;
    const prize = pendingPrizeRef.current;
    pendingPrizeRef.current = null;
    setSpinning(false);
    setWinner(prize);
    spinLockRef.current = false;
  }, []);

  const spin = useCallback(() => {
    if (spinLockRef.current) return;
    spinLockRef.current = true;
    setSpinning(true);
    setWinner(null);

    const winIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const prizeAngle = winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const current = rotation % 360;
    let delta = extraSpins * 360 + (360 - prizeAngle) - current;
    if (delta < extraSpins * 360) delta += 360;

    pendingPrizeRef.current = WHEEL_PRIZES[winIndex];
    setRotation((prev) => prev + delta);

    window.setTimeout(finishSpin, SPIN_MS + 80);
  }, [rotation, finishSpin]);

  const onWheelTransitionEnd = (e) => {
    if (e.propertyName === 'transform' && spinning && pendingPrizeRef.current) {
      finishSpin();
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative mx-auto flex max-w-[320px] flex-col items-center">
        <div className="absolute -top-1 z-20 flex flex-col items-center">
          <div className="h-0 w-0 border-x-[12px] border-x-transparent border-t-[20px] border-t-rose-500 drop-shadow-md" />
        </div>

        <div className="relative rounded-full p-3 shadow-[0_12px_40px_-12px_rgba(249,115,22,0.55)] ring-4 ring-amber-200/80 dark:ring-amber-500/30">
          <div
            className="relative h-[min(72vw,280px)] w-[min(72vw,280px)] rounded-full"
            onTransitionEnd={onWheelTransitionEnd}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.75, 0.12, 1)`
                : 'none',
              background: wheelGradient,
            }}
          >
            <div className="absolute inset-[10%] rounded-full border-4 border-white/30 bg-white/10 shadow-inner" />

            {WHEEL_PRIZES.map((prize, index) => {
              const angle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90;
              const rad = (angle * Math.PI) / 180;
              const radius = 38;
              const x = 50 + radius * Math.cos(rad);
              const y = 50 + radius * Math.sin(rad);

              return (
                <div
                  key={prize.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                  }}
                >
                  <span className="text-2xl leading-none drop-shadow-sm">{prize.emoji}</span>
                  <span className="v2-badge mt-0.5 max-w-[52px] truncate text-center text-white drop-shadow">
                    {prize.name}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="absolute left-1/2 top-1/2 z-10 flex h-[22%] w-[22%] min-h-[52px] min-w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-100 bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-70 dark:border-amber-200/40"
          >
            {spinning ? '…' : 'GO'}
          </button>
        </div>
      </div>

      <Button onClick={spin} disabled={spinning} className="text-sm font-bold">
        {spinning ? t('baraban.spinning') : t('baraban.spin')}
      </Button>

      <div className="grid grid-cols-5 gap-2">
        {WHEEL_PRIZES.map((prize) => (
          <div key={prize.id} className="v2-glass flex flex-col items-center gap-1 px-1 py-2">
            <span className="text-xl">{prize.emoji}</span>
            <span className="v2-caption w-full truncate text-center text-[9px]">{prize.name}</span>
          </div>
        ))}
      </div>

      {winner ? (
        <BarabanWinCelebration
          prize={winner}
          onClose={() => setWinner(null)}
          onSpinAgain={spin}
        />
      ) : null}
    </div>
  );
};
