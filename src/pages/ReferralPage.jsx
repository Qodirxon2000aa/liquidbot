import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Copy, Users, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Button } from '../components/UI';
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
    <div className="space-y-6">
      <Card glass className="space-y-4 py-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-amber-500/20"
        >
          <Share2 className="h-8 w-8 text-violet-500" />
        </motion.div>
        <div className="space-y-1">
          <h2 className="v2-display text-xl text-zinc-900 dark:text-white">{t('referral.title')}</h2>
          <p className="v2-body text-sm text-zinc-500 dark:text-zinc-400">
            Sizning havolangizdan yangi do&apos;stingiz tashrif buyursa <b>100 so&apos;m bonus</b> olasiz va
            do&apos;stlaringizni har bir hisob to&apos;ldirishidan <b>2%</b> qismini olasiz.
          </p>
        </div>
        
        <div className="v2-glass flex items-center justify-between gap-2 p-3">
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate">
            {shareLink || '—'}
          </span>
          <button onClick={copyToClipboard} className="liquid-icon-btn">
            <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-zinc-500'}`} />
          </button>
        </div>

        <Button onClick={handleInvite}>{t('referral.invite')}</Button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center gap-2 py-6">
          <Users className="w-6 h-6 text-blue-500" />
          <span className="v2-price text-2xl text-zinc-900 dark:text-white">{invitedFriends}</span>
          <span className="v2-badge text-zinc-400">{t('referral.invited')}</span>
        </Card>
        <Card className="flex flex-col items-center gap-2 py-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="v2-price text-2xl text-zinc-900 dark:text-white">
            {earnedAmount.toLocaleString('uz-UZ')}
            <span className="ml-1 text-xs font-semibold text-zinc-500">so&apos;m</span>
          </span>
          <span className="v2-badge text-zinc-400">{t('referral.earned')}</span>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white ml-1">{t('referral.stats')}</h3>
        <div className="space-y-2">
          {friends.length === 0 ? (
            <div className="v2-glass p-3 text-center text-xs text-zinc-500">
              Taklif qilingan do&apos;stlar hozircha yo&apos;q
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
                  className="liquid-row flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-zinc-500">
                      {displayName[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold dark:text-white">{displayName}</p>
                      <p className="text-[10px] text-zinc-500">ID: {uid || '—'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500">
                    + {reward.toLocaleString('uz-UZ')} so&apos;m
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
