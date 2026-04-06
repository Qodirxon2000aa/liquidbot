import { useTranslation } from 'react-i18next';
import { Calendar, Trophy, Clock } from 'lucide-react';
import { Card } from '../components/UI';

export const EventsPage = () => {
  const { t } = useTranslation();

  const events = [
    {
      id: 1,
      title: 'Spring Tournament',
      description: 'Compete with others and win big prizes this spring!',
      reward: '5000 Stars',
      deadline: '2024-05-20',
      status: 'active'
    },
    {
      id: 2,
      title: 'Referral Race',
      description: 'Invite the most friends and get a special NFT gift.',
      reward: 'Rare NFT',
      deadline: '2024-06-01',
      status: 'active'
    },
    {
      id: 3,
      title: 'Winter Challenge',
      description: 'Complete daily tasks during the winter season.',
      reward: '1000 Stars',
      deadline: '2024-02-28',
      status: 'finished'
    }
  ];

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="relative overflow-hidden group">
          <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${
            event.status === 'active' ? 'bg-green-500 text-white' : 'bg-zinc-400 text-white'
          }`}>
            {event.status === 'active' ? t('events.active') : t('events.finished')}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{event.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{event.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t('events.reward')}: {event.reward}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-500">{event.deadline}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
