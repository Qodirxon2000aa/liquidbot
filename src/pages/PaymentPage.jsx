import { useTranslation } from 'react-i18next';
import { Wallet, Sparkles } from 'lucide-react';
import { Card, Button } from '../components/UI';
import { useTezpremium } from '../context/TezpremiumContext';
import { formatBalanceUzs } from '../utils/balanceUzs';

export const PaymentPage = ({ onOpenStars }) => {
  const { t } = useTranslation();
  const { apiUser, loading: apiLoading } = useTezpremium();
  const balanceDisplay =
    apiLoading && !apiUser
      ? '…'
      : formatBalanceUzs(apiUser?.balanceUzs ?? apiUser?.balance ?? 0);

  return (
    <div className="space-y-6">
      <p className="v2-body text-center px-2 text-zinc-500 dark:text-zinc-400">
        {t('payment.subtitle')}
      </p>

      <Card
        glass
        className="overflow-hidden border-none bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-[var(--v2-glow-emerald)]"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <p className="v2-badge text-white/80">
              {t('profile.balance')}
            </p>
            <p className="v2-price-lg text-white">
              {balanceDisplay} <span className="text-base font-semibold opacity-80">{t('profile.balanceCurrency')}</span>
            </p>
          </div>
          <Wallet className="w-8 h-8 text-blue-200 opacity-50" />
        </div>
        <Button
          variant="secondary"
          className="liquid-btn liquid-btn-secondary !w-auto bg-white/25 text-white hover:bg-white/35 border-white/30"
        >
          {t('profile.topup')}
        </Button>
      </Card>

      <Button
        type="button"
        onClick={onOpenStars}
        variant="violet"
        className="w-full flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {t('payment.openStars')}
      </Button>
    </div>
  );
};
