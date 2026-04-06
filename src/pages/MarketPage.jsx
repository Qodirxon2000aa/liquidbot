import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Card, Button, Input, Tabs } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';

export const MarketPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Gifts');
  const [recipient, setRecipient] = useState('');

  const gifts = [
    { id: 1, name: 'Red Rose', price: '50 Stars', img: '🌹' },
    { id: 2, name: 'Diamond', price: '500 Stars', img: '💎' },
    { id: 3, name: 'Rocket', price: '1000 Stars', img: '🚀' },
    { id: 4, name: 'Cake', price: '100 Stars', img: '🎂' },
    { id: 5, name: 'Champagne', price: '250 Stars', img: '🍾' },
    { id: 6, name: 'Crown', price: '2000 Stars', img: '👑' },
  ];

  const nftGifts = [
    { id: 1, name: 'Cyber Cat', price: '0.5 TON', rarity: 'Epic', img: '🐱‍💻' },
    { id: 2, name: 'Neon Ape', price: '0.2 TON', rarity: 'Rare', img: '🦍' },
    { id: 3, name: 'Pixel Bot', price: '0.05 TON', rarity: 'Common', img: '🤖' },
    { id: 4, name: 'Golden Egg', price: '1.2 TON', rarity: 'Legendary', img: '🥚' },
  ];

  return (
    <div className="space-y-6">
      <Tabs 
        tabs={['Gifts', 'NFT Gifts']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <AnimatePresence mode="wait">
        {activeTab === 'Gifts' ? (
          <motion.div
            key="gifts"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="space-y-4">
              <Input 
                label={t('market.recipient')}
                placeholder="@username"
                value={recipient}
                onChange={setRecipient}
              />
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {gifts.map((gift) => (
                <Card key={gift.id} className="flex flex-col items-center gap-3 p-4 hover:border-blue-500 transition-colors">
                  <div className="text-4xl">{gift.img}</div>
                  <div className="text-center">
                    <p className="font-bold dark:text-white">{gift.name}</p>
                    <p className="text-xs text-blue-500 font-bold">{gift.price}</p>
                  </div>
                  <Button className="py-2 text-xs flex items-center justify-center gap-2">
                    <Send className="w-3 h-3" />
                    {t('market.send')}
                  </Button>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="nfts"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 gap-4"
          >
            {nftGifts.map((nft) => (
              <Card key={nft.id} className="flex flex-col items-center gap-3 p-4 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  nft.rarity === 'Legendary' ? 'bg-yellow-500' :
                  nft.rarity === 'Epic' ? 'bg-purple-500' :
                  nft.rarity === 'Rare' ? 'bg-blue-500' : 'bg-zinc-400'
                }`} />
                <div className="text-5xl my-2">{nft.img}</div>
                <div className="text-center">
                  <p className="font-bold dark:text-white">{nft.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{nft.rarity}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{nft.price}</p>
                </div>
                <Button className="py-2 text-xs">{t('home.buy')}</Button>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
