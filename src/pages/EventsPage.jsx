import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Gift, Loader2, Target, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../components/UI';
import { useTelegram } from '../hooks/useTelegram';

const DEV_USER_ID = '7521806735';

const RANK_RING = {
  1: 'from-amber-300 to-yellow-500 text-amber-900',
  2: 'from-zinc-300 to-zinc-400 text-zinc-800',
  3: 'from-orange-300 to-amber-600 text-orange-950',
};

export const EventsPage = () => {
  const { user } = useTelegram();
  const [eventData, setEventData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState({
    today: [],
    week: [],
    month: [],
  });
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    const uid = user?.id ? String(user.id) : DEV_USER_ID;
    const username = user?.username ? String(user.username).replace(/^@/, '') : '';

    let cancelled = false;
    (async () => {
      try {
        setLoadingEvents(true);
        const res = await fetch(
          `https://tezpremium.uz/uzbstar/events.php?user_id=${encodeURIComponent(uid)}&sent=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        if (!cancelled && data?.ok && data?.data) {
          setEventData(data.data);
        }
      } catch {
        if (!cancelled) setEventData(null);
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.username]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingLeaderboard(true);
        const res = await fetch('https://tezpremium.uz/uzbstar/week.php');
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data?.top10)) {
          const formattedData = data.top10.map((item) => ({
            rank: item.rank,
            username: item.name,
            amount: Number(item.summa || 0),
            trophy:
              item.rank === 1
                ? '🥇'
                : item.rank === 2
                  ? '🥈'
                  : item.rank === 3
                    ? '🥉'
                    : null,
          }));
          setLeaderboardData({
            today: formattedData,
            week: formattedData,
            month: formattedData,
          });
        }
      } catch {
        if (!cancelled) {
          setLeaderboardData({ today: [], week: [], month: [] });
        }
      } finally {
        if (!cancelled) setLoadingLeaderboard(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = loadingEvents || loadingLeaderboard;
  const target = useMemo(() => Number(eventData?.event || 0), [eventData]);
  const paid = useMemo(() => Number(eventData?.payments || 0), [eventData]);
  const left = useMemo(() => Number(eventData?.left || 0), [eventData]);
  const percent = target > 0 ? Math.min((paid / target) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-2">
      <PageHeroEvents />

      <motion.div
        className="v2-amount-card !cursor-pointer !px-5 !py-5"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => eventData && setShowModal(true)}
      >
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/30 to-violet-500/20 ring-1 ring-white/20">
            <Gift className="h-5.5 w-5.5 text-amber-200" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="v2-title text-sm text-white">Umumiy savdo maqsadi</p>
            <p className="v2-caption !text-amber-100/70">
              {eventData ? `NFT olish uchun ${target.toLocaleString('uz-UZ')} so'm` : 'Ma\'lumot topilmadi'}
            </p>
          </div>
          <span className="v2-amount-display !text-2xl shrink-0">{Math.round(percent)}%</span>
        </div>

        {eventData && (
          <div className="relative mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/25">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 shadow-[0_0_12px_rgba(255,180,0,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-100/80">
              <span>{paid.toLocaleString('uz-UZ')} so&apos;m</span>
              <span>{target.toLocaleString('uz-UZ')} so&apos;m</span>
            </div>
          </div>
        )}
      </motion.div>

      <Card className="p-0">
        <CardContent className="space-y-3 px-4 pb-4 pt-4">
          <div>
            <h2 className="v2-title text-base text-zinc-900 dark:text-white">
              Savdo statistikasi
            </h2>
            <p className="text-xs text-zinc-500">Kunlik, haftalik va oylik reyting</p>
          </div>

          <div className="liquid-tab-track grid grid-cols-3 gap-1.5 !p-1">
            {[
              { key: 'today', label: 'Bugun' },
              { key: 'week', label: 'Bu hafta' },
              { key: 'month', label: 'Bu oy' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-3xl px-2 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.key
                    ? 'liquid-tab-pill text-zinc-900 dark:text-white'
                    : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {leaderboardData[activeTab].length === 0 ? (
              <p className="py-5 text-center text-sm text-zinc-500">Ma&apos;lumot yo&apos;q</p>
            ) : (
              leaderboardData[activeTab].map((item) => {
                const ring = RANK_RING[item.rank];
                return (
                  <div
                    key={`${activeTab}-${item.rank}-${item.username}`}
                    className="liquid-row flex items-center gap-3 px-3 py-2.5"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        ring ? `bg-gradient-to-br ${ring}` : 'bg-zinc-200/60 text-zinc-500 dark:bg-zinc-700/60 dark:text-zinc-300'
                      }`}
                    >
                      {item.trophy || item.rank}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-white">
                      {item.username}
                    </span>
                    <span className="v2-price text-xs text-zinc-500">
                      {item.amount.toLocaleString('uz-UZ')} so&apos;m
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
      {showModal && eventData && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/20 backdrop-blur-md dark:bg-black/35 sm:items-center"
          onClick={() => setShowModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="liquid-modal w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Savdo maqsadi haqida
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="liquid-icon-btn !p-1.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                <b>Maqsad:</b> {target.toLocaleString('uz-UZ')} so&apos;m umumiy savdo
              </p>
              <p>
                <b>Sovg&apos;a:</b> Eksklyuziv NFT (avtomatik yuboriladi)
              </p>
              <p>
                <b>Hozirgi holat:</b> {paid.toLocaleString('uz-UZ')} so&apos;m
              </p>
              <p>
                <b>Qolgan:</b> {left.toLocaleString('uz-UZ')} so&apos;m
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="liquid-btn liquid-btn-violet mt-4 h-10 w-full !py-2 text-sm"
            >
              Tushundim
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {!eventData && (
        <div className="flex items-center gap-2 rounded-3xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Event ma&apos;lumoti topilmadi yoki server javob bermadi.
          </p>
        </div>
      )}
    </div>
  );
};

function PageHeroEvents() {
  return (
    <div className="v2-hero-premium relative flex h-32 items-center justify-center overflow-hidden rounded-[2.25rem] border border-white/20">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-25 text-violet-200"
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 128,
              scale: Math.random() * 0.5 + 0.4,
            }}
            animate={{
              y: [null, Math.random() * -16, Math.random() * 16],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Target className="h-3 w-3" />
          </motion.div>
        ))}
      </div>
      <div className="relative flex flex-col items-center gap-1 text-center">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-500/20 ring-1 ring-violet-200/40"
        >
          <Target className="h-6 w-6 text-violet-100 drop-shadow-[0_0_16px_rgba(167,139,250,0.7)]" />
        </motion.div>
        <h2 className="v2-hero-title v2-text-shimmer-violet !text-xl">Tadbirlar</h2>
        <p className="v2-hero-sub text-violet-200/90">Maqsadlar va haftalik reyting</p>
      </div>
    </div>
  );
}
