import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, Users, Trophy, Check, Gift, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/UI';
import { useTezpremium } from '../context/TezpremiumContext';

export const ReferralPage = () => {
  const { t } = useTranslation();
  const { apiFetch } = useTezpremium();
  const [invitedFriends, setInvitedFriends] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchReferrals = async () => {
      try {
        const data = await apiFetch('referals.php');
        if (!cancelled && data?.ok) {
          setInvitedFriends(Number(data.ref_count || 0));
          // Faqat botga yo'naltiradigan asl referral link ko'rsatiladi.
          // Backend: { link, share_link, ... }
          setShareLink(String(data.link || data.share_link || ''));
          setEarnedAmount(Number(data.reward || data.earned || data.bonus || 0));
          setFriends(Array.isArray(data.friends) ? data.friends : []);
        }
      } catch {
        if (!cancelled) {
          setInvitedFriends(0);
          setShareLink('');
          setEarnedAmount(0);
          setFriends([]);
        }
      }
    };
    fetchReferrals();
    return () => {
      cancelled = true;
    };
  }, [apiFetch]);

  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleInvite = () => {
    if (!shareLink) return;
    window.open(shareLink, '_blank');
  };

  return (
    <div className="space-y-5">
      <motion.div
        className="v2-amount-card !py-7"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-100/90 backdrop-blur-md">
          <Sparkles className="h-3 w-3" />
          Bonus
        </span>

        <div className="relative flex flex-col items-center gap-2 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,204,0,0.35) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            >
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute left-1/2 top-1/2 h-2 w-2"
                  style={{ transform: `rotate(${deg}deg) translate(2.4rem) translate(-50%, -50%)` }}
                >
                  <Sparkles className="h-3 w-3 text-amber-300 drop-shadow-[0_0_6px_rgba(255,204,0,0.8)]" />
                </div>
              ))}
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 ring-1 ring-amber-200/40"
            >
              <Share2 className="h-7 w-7 text-amber-100 drop-shadow-[0_0_16px_rgba(255,204,0,0.7)]" />
            </motion.div>
          </div>

          <h2 className="v2-hero-title v2-text-shimmer">{t('referral.title')}</h2>
          <p className="v2-body max-w-[280px] text-xs text-amber-100/80">
            Sizning havolangizdan yangi do&apos;stingiz tashrif buyursa <b className="text-white">100 so&apos;m bonus</b>{' '}
            olasiz va do&apos;stlaringizning har bir hisob to&apos;ldirishidan <b className="text-white">2%</b> ulush
            olasiz.
          </p>
        </div>
      </motion.div>

      <div className="v2-glass space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="v2-section-label !ml-0">{t('referral.link')}</span>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"
            >
              <Check className="h-3 w-3" /> Nusxalandi
            </motion.span>
          )}
        </div>
        <div className="liquid-input flex items-center justify-between gap-2 !py-2.5">
          <span className="truncate text-xs font-mono text-zinc-600 dark:text-zinc-300">
            {shareLink || '—'}
          </span>
          <button
            type="button"
            onClick={copyToClipboard}
            className="liquid-icon-btn !shrink-0"
            aria-label="Nusxalash"
          >
            <Copy className={`h-4 w-4 ${copied ? 'text-emerald-500' : 'text-zinc-500'}`} />
          </button>
        </div>
        <Button onClick={handleInvite} variant="primary" className="text-sm">
          {t('referral.invite')}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="v2-pkg-card !py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15">
            <Users className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <span className="v2-price text-2xl text-zinc-900 dark:text-white">{invitedFriends}</span>
          <span className="v2-badge text-zinc-400">{t('referral.invited')}</span>
        </div>
        <div className="v2-pkg-card v2-pkg-card--active-stars !py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15">
            <Trophy className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <span className="v2-price text-2xl text-zinc-900 dark:text-white">
            {earnedAmount.toLocaleString('uz-UZ')}
          </span>
          <span className="v2-badge text-zinc-500 dark:text-amber-300/80">{t('referral.earned')} · so&apos;m</span>
        </div>
      </div>

      <div className="space-y-3">
        <SectionHeading>{t('referral.stats')}</SectionHeading>
        <div className="space-y-2">
          {friends.length === 0 ? (
            <div className="v2-glass flex flex-col items-center gap-2 px-3 py-8 text-center">
              <Gift className="h-7 w-7 text-zinc-400/60" />
              <p className="text-xs text-zinc-500">Taklif qilingan do&apos;stlar hozircha yo&apos;q</p>
            </div>
          ) : (
            friends.map((friend, idx) => {
              const uid = String(friend?.user_id ?? '');
              const nameRaw = friend?.name;
              const reward = Number(friend?.reward || 0);
              const displayName =
                typeof nameRaw === 'string' && nameRaw.trim()
                  ? nameRaw.trim()
                  : `User #${uid || idx + 1}`;
              return (
                <div
                  key={`${uid || idx}-${displayName}`}
                  className="liquid-row flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-amber-500/20 text-xs font-bold text-violet-600 dark:text-violet-300 ring-1 ring-white/20">
                      {displayName[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="v2-title truncate text-sm text-zinc-900 dark:text-white">{displayName}</p>
                      <p className="text-[10px] text-zinc-500">ID: {uid || '—'}</p>
                    </div>
                  </div>
                  <span className="v2-price shrink-0 text-xs text-emerald-500">
                    +{reward.toLocaleString('uz-UZ')}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

function SectionHeading({ children }) {
  return <h3 className="v2-section-label !ml-1 !text-zinc-500 dark:!text-zinc-400">{children}</h3>;
}
