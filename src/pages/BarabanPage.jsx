import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, animate } from 'motion/react';
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

const CARD_WIDTH = 96; // matches w-24 card class
const ITEM_GAP = 12; // matches gap-3
const ITEM_WIDTH = CARD_WIDTH + ITEM_GAP; // distance between successive item starts
const REEL_LENGTH = 48;
const WINNER_SLOT = 40; // index in reel where the winning card always lands
const SPIN_MS = 4200;

function randomPrize() {
  return WHEEL_PRIZES[Math.floor(Math.random() * WHEEL_PRIZES.length)];
}

function buildReel(winningPrize) {
  return Array.from({ length: REEL_LENGTH }, (_, i) =>
    i === WINNER_SLOT ? winningPrize : randomPrize()
  ).map((prize, i) => ({ ...prize, key: `${i}-${prize.id}-${Math.random()}` }));
}

export const BarabanPage = () => {
  const { t } = useTranslation();
  const [reel, setReel] = useState(() => buildReel(randomPrize()));
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const spinLockRef = useRef(false);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const x = useMotionValue(0);

  const spin = useCallback(() => {
    if (spinLockRef.current) return;
    spinLockRef.current = true;
    setSpinning(true);
    setWinner(null);

    const prize = randomPrize();
    const nextReel = buildReel(prize);
    setReel(nextReel);

    const viewportWidth = viewportRef.current?.clientWidth || 320;
    const winnerCenterLocal = WINNER_SLOT * ITEM_WIDTH + CARD_WIDTH / 2;
    const targetX = Math.round(viewportWidth / 2 - winnerCenterLocal);

    x.set(-ITEM_WIDTH * (2 + Math.random() * 2));

    animate(x, targetX, {
      duration: SPIN_MS / 1000,
      ease: [0.13, 0.7, 0.1, 1],
      onComplete: () => {
        setSpinning(false);
        setWinner(prize);
        spinLockRef.current = false;
      },
    });
  }, [x]);

  return (
    <div className="space-y-5">
      <div className="v2-glass relative overflow-hidden p-4">
        <div className="mb-3 space-y-0.5">
          <h2 className="v2-title text-base text-zinc-900 dark:text-white">{t('baraban.title')}</h2>
          <p className="v2-caption text-amber-500/90 dark:text-amber-400/90">{t('baraban.subtitle')}</p>
        </div>

        <div
          ref={viewportRef}
          className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-b from-black/40 via-black/20 to-black/40"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-black/70 to-transparent" />

          <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2">
            <div className="h-0 w-0 border-x-[7px] border-x-transparent border-t-[11px] border-t-amber-400 drop-shadow" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-24 -translate-x-1/2 rounded-2xl ring-2 ring-amber-400/70 shadow-[0_0_20px_rgba(255,180,0,0.35)]" />

          <motion.div
            ref={trackRef}
            className="flex h-full items-center gap-3 py-2 will-change-transform"
            style={{ x }}
          >
            {reel.map((prize) => (
              <div
                key={prize.key}
                className="flex h-[88%] w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-amber-300/25 bg-gradient-to-b from-amber-500/10 to-zinc-900/40 shadow-inner"
              >
                <span className="text-3xl leading-none drop-shadow-sm">{prize.emoji}</span>
                <span className="v2-badge max-w-[80px] truncate text-center text-[9px] text-amber-100/80">
                  {prize.name}
                </span>
              </div>
            ))}
          </motion.div>
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
