import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, animate } from 'motion/react';
import { Button } from '../components/UI';
import { BarabanWinCelebration } from '../components/BarabanWinCelebration';
import { GiftAnimation } from '../utils/giftAnimations';

const CHANCE_API_URL = 'https://tezpremium.uz/uzbstar/lucky_chance.php';

const GIFT_META = {
  heart: { emoji: '❤️', name: 'Heart' },
  teddy_bear: { emoji: '🐻', name: 'Teddy Bear' },
  gift_box: { emoji: '🎁', name: 'Gift Box' },
  rose: { emoji: '🌹', name: 'Rose' },
  cake: { emoji: '🎂', name: 'Cake' },
  bouquet: { emoji: '💐', name: 'Bouquet' },
  rocket: { emoji: '🚀', name: 'Rocket' },
  trophy: { emoji: '🏆', name: 'Trophy' },
  ring: { emoji: '💍', name: 'Ring' },
  diamond: { emoji: '💎', name: 'Diamond' },
  champagne: { emoji: '🍾', name: 'Champagne' },
  love_teddy: { emoji: '🧸', name: 'Love Teddy' },
  love_heart: { emoji: '💝', name: 'Love Heart' },
  tree: { emoji: '🌳', name: 'Tree' },
  new_bear: { emoji: '🐻', name: 'New Bear' },
  march_bear: { emoji: '🐻', name: 'March Bear' },
  april_bear: { emoji: '🐻', name: 'April Bear' },
  money_pot: { emoji: '💰', name: 'Money Pot' },
  egg_bear: { emoji: '🐻', name: 'Egg Bear' },
  builder_bear: { emoji: '🐻', name: 'Builder Bear' },
  vice_cream: { emoji: '🍦', name: 'Vice Cream' },
};

// Fallback table — mirrors the live odds from lucky_chance.php so the wheel
// already feels right before the fetch resolves (and if it ever fails).
const DEFAULT_CHANCES = [
  { id: 'heart', chance: 29.14 },
  { id: 'teddy_bear', chance: 29.14 },
  { id: 'gift_box', chance: 8.74 },
  { id: 'rose', chance: 8.74 },
  { id: 'cake', chance: 2.91 },
  { id: 'bouquet', chance: 3.5 },
  { id: 'rocket', chance: 1.17 },
  { id: 'trophy', chance: 0.58 },
  { id: 'ring', chance: 0.58 },
  { id: 'diamond', chance: 0.58 },
  { id: 'champagne', chance: 2.33 },
  { id: 'love_teddy', chance: 1.75 },
  { id: 'love_heart', chance: 1.98 },
  { id: 'tree', chance: 1.28 },
  { id: 'new_bear', chance: 1.4 },
  { id: 'march_bear', chance: 1.52 },
  { id: 'april_bear', chance: 1.17 },
  { id: 'money_pot', chance: 1.05 },
  { id: 'egg_bear', chance: 1.17 },
  { id: 'builder_bear', chance: 1.17 },
  { id: 'vice_cream', chance: 0.12 },
];

function toPrizeList(chances) {
  return chances.map((c) => {
    const meta = GIFT_META[c.id] || { emoji: '🎁', name: c.id };
    return { id: c.id, emoji: meta.emoji, name: meta.name, chance: c.chance };
  });
}

const CARD_WIDTH = 96; // matches w-24 card class
const ITEM_GAP = 12; // matches gap-3
const ITEM_WIDTH = CARD_WIDTH + ITEM_GAP; // distance between successive item starts
const REEL_LENGTH = 48;
const WINNER_SLOT = 6; // index in reel where the winning card always lands (near the start so the reel travels left-to-right)
const SPIN_MS = 4200;

function pickWeighted(prizes) {
  const total = prizes.reduce((sum, p) => sum + (p.chance > 0 ? p.chance : 0), 0);
  if (!total) return prizes[Math.floor(Math.random() * prizes.length)];
  let r = Math.random() * total;
  for (const p of prizes) {
    r -= p.chance > 0 ? p.chance : 0;
    if (r <= 0) return p;
  }
  return prizes[prizes.length - 1];
}

function buildReel(prizes, winningPrize) {
  return Array.from({ length: REEL_LENGTH }, (_, i) =>
    i === WINNER_SLOT ? winningPrize : pickWeighted(prizes)
  ).map((prize, i) => ({ ...prize, key: `${i}-${prize.id}-${Math.random()}` }));
}

const IDLE_SPEED_PX_PER_SEC = 16;

export const BarabanPage = () => {
  const { t } = useTranslation();
  const [prizes, setPrizes] = useState(() => toPrizeList(DEFAULT_CHANCES));
  const [reel, setReel] = useState(() => buildReel(toPrizeList(DEFAULT_CHANCES), pickWeighted(toPrizeList(DEFAULT_CHANCES))));
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const spinLockRef = useRef(false);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    let cancelled = false;
    fetch(CHANCE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.gifts)) return;
        const next = data.gifts
          .filter((g) => g && g.name && Number.isFinite(Number(g.chance)))
          .map((g) => ({ id: g.name, chance: Number(g.chance) }));
        if (next.length > 0) setPrizes(toPrizeList(next));
      })
      .catch(() => {
        /* keep the default fallback table */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const idleItems = useRef([]);
  const idleLoopDistance = useRef(0);
  if (idleItems.current.length === 0 || idleItems.current.__forPrizes !== prizes) {
    const list = Array.from({ length: 4 }, () => prizes)
      .flat()
      .map((prize, i) => ({ ...prize, key: `idle-${i}-${prize.id}` }));
    list.__forPrizes = prizes;
    idleItems.current = list;
    idleLoopDistance.current = prizes.length * ITEM_WIDTH;
  }

  useEffect(() => {
    if (spinning) return;
    x.set(0);
    const controls = animate(x, [0, -idleLoopDistance.current], {
      duration: idleLoopDistance.current / IDLE_SPEED_PX_PER_SEC,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [spinning, x, prizes]);

  const spin = useCallback(() => {
    if (spinLockRef.current) return;
    spinLockRef.current = true;
    setSpinning(true);
    setWinner(null);

    const prize = pickWeighted(prizes);
    const nextReel = buildReel(prizes, prize);
    setReel(nextReel);

    const viewportWidth = viewportRef.current?.clientWidth || 320;
    const winnerCenterLocal = WINNER_SLOT * ITEM_WIDTH + CARD_WIDTH / 2;
    const targetX = Math.round(viewportWidth / 2 - winnerCenterLocal);

    // Start the track far along the reel (showing the tail end) and animate
    // toward the winner near the start — this makes cards visually flow
    // left-to-right as the track slides rightward into place.
    const startIndex = REEL_LENGTH - (3 + Math.floor(Math.random() * 2));
    const startCenterLocal = startIndex * ITEM_WIDTH + CARD_WIDTH / 2;
    x.set(Math.round(viewportWidth / 2 - startCenterLocal));

    animate(x, targetX, {
      duration: SPIN_MS / 1000,
      ease: [0.13, 0.7, 0.1, 1],
      onComplete: () => {
        setSpinning(false);
        setWinner(prize);
        spinLockRef.current = false;
      },
    });
  }, [x, prizes]);

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
            <div className="h-0 w-0 border-x-[8px] border-x-transparent border-t-[13px] border-t-amber-400 drop-shadow-[0_2px_6px_rgba(255,180,0,0.6)]" />
          </div>

          <motion.div
            ref={trackRef}
            className="flex h-full items-center gap-3 py-2 will-change-transform"
            style={{ x }}
          >
            {(spinning ? reel : idleItems.current).map((prize) => (
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

      <div className="grid grid-cols-3 gap-2">
        {prizes.map((prize) => (
          <div key={prize.id} className="v2-glass relative flex flex-col items-center gap-1 px-1 py-2.5">
            <span className="v2-badge absolute right-1.5 top-1.5 rounded-full bg-black/30 px-1.5 py-0.5 text-[8px] text-amber-300">
              {prize.chance.toFixed(2)}%
            </span>
            <div className="h-10 w-10 shrink-0">
              <GiftAnimation name={prize.id} play={false} />
            </div>
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
