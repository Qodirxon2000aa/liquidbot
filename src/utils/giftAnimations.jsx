import { useEffect, useMemo, useRef, useState } from 'react';
import Lottie from 'lottie-react';

import heart from '../assets/heart.json';
import teddy_bear from '../assets/teddy_bear.json';
import gift_box from '../assets/gift_box.json';
import rose from '../assets/rose.json';
import cake from '../assets/cake.json';
import bouquet from '../assets/bouquet.json';
import rocket from '../assets/rocket.json';
import trophy from '../assets/trophy.json';
import ring from '../assets/ring.json';
import diamond from '../assets/diamond.json';
import champagne from '../assets/champagne.json';
import love_teddy from '../assets/love_teddy.json';
import love_heart from '../assets/love_heart.json';
import tree from '../assets/tree.json';
import new_bear from '../assets/new_bear.json';
import bear from '../assets/bear.json';
import bear2 from '../assets/bear2.json';
import bear3 from '../assets/bear3.json';
import bear4 from '../assets/bear4.json';
import egg_bear from '../assets/egg_bear.json';
import money_pot from '../assets/money_pot.json';
import march_bear from '../assets/march_bear.json';

/** info.php `name` → assets/*.json (bear3 = serverdagi april_bear bilan bir xil) */
export const GIFT_ANIMATIONS = {
  heart,
  teddy_bear,
  gift_box,
  rose,
  cake,
  bouquet,
  rocket,
  trophy,
  ring,
  diamond,
  champagne,
  love_teddy,
  love_heart,
  tree,
  new_bear,
  bear,
  bear2,
  bear3,
  bear4,
  egg_bear,
  money_pot,
  march_bear,
  april_bear: bear3,
  builder_bear: bear4,
};

export const GIFT_EMOJIS = {
  heart: '❤️',
  teddy_bear: '🐻',
  gift_box: '🎁',
  rose: '🌹',
  cake: '🎂',
  bouquet: '💐',
  rocket: '🚀',
  trophy: '🏆',
  ring: '💍',
  diamond: '💎',
  champagne: '🍾',
  love_teddy: '🧸',
  love_heart: '💝',
  tree: '🌳',
  new_bear: '🐻',
  march_bear: '🐻',
  april_bear: '🐻',
  bear3: '🐻',
  bear4: '🐻',
  egg_bear: '🐻',
  money_pot: '💰',
  bear: '🐻',
  bear2: '🐻',
  builder_bear: '🐻',
  vice_cream: '🍦',
};

export function normalizeGiftNameKey(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export function prepareLottieAnimationData(data) {
  if (!data || typeof data !== 'object') return data;
  try {
    const o = JSON.parse(JSON.stringify(data));
    delete o.tgs;
    return o;
  } catch {
    return data;
  }
}

export function GiftAnimation({ name, autoplayInView = true, loop = false, play = true }) {
  const nameKey = normalizeGiftNameKey(name);
  const rawAnim = useMemo(
    () => GIFT_ANIMATIONS[nameKey] ?? GIFT_ANIMATIONS[String(name ?? '').trim()] ?? null,
    [name, nameKey]
  );
  const animData = useMemo(
    () => (rawAnim ? prepareLottieAnimationData(rawAnim) : null),
    [rawAnim]
  );

  const wrapRef = useRef(null);
  const lottieRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    setPlayed(false);
  }, [nameKey, animData]);

  useEffect(() => {
    if (!play || !autoplayInView) {
      setVisible(true);
      return undefined;
    }
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoplayInView, play]);

  useEffect(() => {
    if (!lottieRef.current || !animData) return;
    if (!play) {
      // Render the gift statically (first frame only) — used anywhere the
      // animation shouldn't run until a real event (e.g. a win) triggers it.
      lottieRef.current.goToAndStop(0, true);
      return;
    }
    if (visible && !played) {
      lottieRef.current.goToAndPlay(0, true);
      setPlayed(true);
    }
  }, [visible, played, animData, play]);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center">
      {animData ? (
        <Lottie
          key={nameKey}
          lottieRef={lottieRef}
          animationData={animData}
          loop={loop}
          autoplay={false}
          style={{ width: '82%', height: '82%', display: 'block' }}
        />
      ) : (
        <span className="select-none text-5xl leading-none">
          {GIFT_EMOJIS[nameKey] || GIFT_EMOJIS[name] || '🎁'}
        </span>
      )}
    </div>
  );
}
