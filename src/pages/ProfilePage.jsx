import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, History, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { MoneyModal } from '../components/MoneyModal';
import { useTelegram } from '../hooks/useTelegram';
import { useTezpremium } from '../context/TezpremiumContext';

const TelegramStar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill="url(#star-gradient-profile)"
      stroke="#FFD700"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient id="star-gradient-profile" x1="12" y1="2" x2="12" y2="21.02" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FFA500" />
      </linearGradient>
    </defs>
  </svg>
);

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useTelegram();
  const { apiUser, loading: apiLoading } = useTezpremium();
  const [moneyOpen, setMoneyOpen] = useState(false);

  const balanceDisplay =
    apiLoading && !apiUser ? '…' : String(apiUser?.balance ?? '0');

  const transactions = [
    { id: 1, type: 'Stars Purchase', amount: '+100 Stars', date: 'Today, 14:20', icon: TelegramStar, color: 'text-yellow-500' },
    { id: 2, type: 'Premium Subscription', amount: '-$11.99', date: 'Yesterday, 09:15', icon: ShieldCheck, color: 'text-purple-500' },
    { id: 3, type: 'Gift Sent', amount: '-50 Stars', date: '2 days ago', icon: CreditCard, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 p-1">
          <img 
            src={user.photo_url || `https://picsum.photos/seed/${user.id}/200`} 
            alt="Avatar" 
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.first_name} {user.last_name}</h2>
          <p className="text-sm text-zinc-500">@{user.username}</p>
          <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{t('profile.id')}: {user.id}</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">{t('profile.balance')}</p>
            <p className="text-3xl font-bold">{balanceDisplay} Stars</p>
          </div>
          <Wallet className="w-8 h-8 text-blue-200 opacity-50" />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setMoneyOpen(true)}
          className="bg-white/20 hover:bg-white/30 border-none text-white backdrop-blur-sm"
        >
          {t('profile.topup')}
        </Button>
      </Card>

      <MoneyModal open={moneyOpen} onClose={() => setMoneyOpen(false)} />

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{t('profile.history')}</h3>
          <History className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="space-y-2">
          {transactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center ${tx.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">{tx.type}</p>
                    <p className="text-[10px] text-zinc-500">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-500' : 'dark:text-white'}`}>
                    {tx.amount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
