import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card, Button, Input, Tabs } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';

const TelegramStar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill="url(#star-gradient)"
      stroke="#FFD700"
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient id="star-gradient" x1="12" y1="2" x2="12" y2="21.02" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FFA500" />
      </linearGradient>
    </defs>
  </svg>
);

export const HomePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Stars');
  const [username, setUsername] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const starPackages = [
    { amount: 50, price: '$0.99' },
    { amount: 100, price: '$1.89' },
    { amount: 500, price: '$8.99' },
    { amount: 1000, price: '$16.99' },
  ];

  const premiumPackages = [
    { months: 3, price: '$11.99', discount: '15%' },
    { months: 6, price: '$19.99', discount: '25%' },
    { months: 12, price: '$35.99', discount: '40%' },
  ];

  const handleBuy = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Tabs 
        tabs={['Stars', 'Premium']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <AnimatePresence mode="wait">
        {activeTab === 'Stars' ? (
          <motion.div
            key="stars"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="relative h-40 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute opacity-20"
                    initial={{ 
                      x: Math.random() * 400, 
                      y: Math.random() * 200,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      y: [null, Math.random() * -20, Math.random() * 20],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <TelegramStar className="w-4 h-4" />
                  </motion.div>
                ))}
              </div>
              <div className="relative text-center space-y-1">
                <TelegramStar className="w-16 h-16 mx-auto drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                <h2 className="text-2xl font-bold text-white">Telegram Stars</h2>
              </div>
            </div>

            <Input 
              label={t('home.username')}
              placeholder="@username"
              value={username}
              onChange={setUsername}
            />

            <div className="grid grid-cols-2 gap-4">
              {starPackages.map((pkg) => (
                <Card key={pkg.amount} className="flex flex-col items-center gap-3 py-6 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <TelegramStar className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold dark:text-white">{pkg.amount} Stars</p>
                    <p className="text-sm text-zinc-500 font-medium">{pkg.price}</p>
                  </div>
                  <Button onClick={handleBuy} className="py-2 text-sm">{t('home.buy')}</Button>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="premium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="relative h-40 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              </div>
              <div className="relative text-center space-y-1">
                <ShieldCheck className="w-12 h-12 text-white mx-auto drop-shadow-lg" />
                <h2 className="text-2xl font-bold text-white">Telegram Premium</h2>
              </div>
            </div>

            <div className="space-y-4">
              {premiumPackages.map((pkg) => (
                <Card key={pkg.months} className="flex items-center justify-between p-5 hover:border-purple-500 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold dark:text-white">{pkg.months} Months</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500">{pkg.price}</span>
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-full">
                          SAVE {pkg.discount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleBuy} className="w-auto px-6 py-2 text-sm">{t('home.buy')}</Button>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100] flex justify-center"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">{t('home.success')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
