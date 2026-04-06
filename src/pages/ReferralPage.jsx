import { useTranslation } from 'react-i18next';
import { Share2, Copy, Users, Trophy } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { motion } from 'motion/react';

export const ReferralPage = () => {
  const { t } = useTranslation();
  const referralLink = 'https://t.me/app?start=12345';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    // In real TWA we would use tg.showToast or similar
  };

  const shareLink = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on this awesome app!')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
          <Share2 className="w-8 h-8 text-blue-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t('referral.title')}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Share your link and earn rewards</p>
        </div>
        
        <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl flex items-center justify-between gap-2 border border-zinc-100 dark:border-zinc-700">
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate">{referralLink}</span>
          <button onClick={copyToClipboard} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
            <Copy className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <Button onClick={shareLink}>{t('referral.invite')}</Button>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center gap-2 py-6">
          <Users className="w-6 h-6 text-blue-500" />
          <span className="text-2xl font-bold dark:text-white">12</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{t('referral.invited')}</span>
        </Card>
        <Card className="flex flex-col items-center gap-2 py-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl font-bold dark:text-white">450</span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{t('referral.earned')}</span>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white ml-1">{t('referral.stats')}</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">User #{i}452</p>
                  <p className="text-[10px] text-zinc-500">Joined 2 days ago</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">+50</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
