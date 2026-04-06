import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      header: {
        title: 'TWA App'
      },
      nav: {
        referral: 'Referral',
        events: 'Events',
        home: 'Home',
        market: 'Market',
        profile: 'Profile'
      },
      referral: {
        title: 'Invite Friends',
        link: 'Your referral link',
        invite: 'Invite Friends',
        copy: 'Copy Link',
        stats: 'Statistics',
        invited: 'Invited Users',
        earned: 'Earned Rewards'
      },
      events: {
        title: 'Events',
        active: 'Active',
        finished: 'Finished',
        reward: 'Reward',
        deadline: 'Deadline'
      },
      home: {
        title: 'Home',
        stars: 'Stars',
        premium: 'Premium',
        username: 'Telegram Username',
        buy: 'Buy',
        success: 'Purchase successful!'
      },
      market: {
        title: 'Market',
        gifts: 'Gifts',
        nftGifts: 'NFT Gifts',
        recipient: 'Recipient Username',
        send: 'Send',
        rarity: 'Rarity'
      },
      profile: {
        title: 'Profile',
        balance: 'Balance',
        topup: 'Top up',
        history: 'Transaction History',
        id: 'Telegram ID'
      },
      settings: {
        title: 'Settings',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        nightMode: 'Night Mode',
        textSize: 'Text Size',
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
      }
    }
  },
  ru: {
    translation: {
      header: {
        title: 'TWA Приложение'
      },
      nav: {
        referral: 'Рефералы',
        events: 'События',
        home: 'Главная',
        market: 'Маркет',
        profile: 'Профиль'
      },
      referral: {
        title: 'Пригласить друзей',
        link: 'Ваша реферальная ссылка',
        invite: 'Пригласить друзей',
        copy: 'Копировать',
        stats: 'Статистика',
        invited: 'Приглашенные',
        earned: 'Награды'
      },
      events: {
        title: 'События',
        active: 'Активно',
        finished: 'Завершено',
        reward: 'Награда',
        deadline: 'Дедлайн'
      },
      home: {
        title: 'Главная',
        stars: 'Звезды',
        premium: 'Премиум',
        username: 'Имя пользователя Telegram',
        buy: 'Купить',
        success: 'Покупка прошла успешно!'
      },
      market: {
        title: 'Маркет',
        gifts: 'Подарки',
        nftGifts: 'NFT Подарки',
        recipient: 'Имя получателя',
        send: 'Отправить',
        rarity: 'Редкость'
      },
      profile: {
        title: 'Профиль',
        balance: 'Баланс',
        topup: 'Пополнить',
        history: 'История транзакций',
        id: 'Telegram ID'
      },
      settings: {
        title: 'Настройки',
        appearance: 'Внешний вид',
        darkMode: 'Темный режим',
        nightMode: 'Ночной режим',
        textSize: 'Размер текста',
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой'
      }
    }
  },
  uz: {
    translation: {
      header: {
        title: 'TWA Ilovasi'
      },
      nav: {
        referral: 'Referal',
        events: 'Tadbirlar',
        home: 'Asosiy',
        market: 'Market',
        profile: 'Profil'
      },
      referral: {
        title: 'Do\'stlarni taklif qilish',
        link: 'Sizning referal havola',
        invite: 'Do\'stlarni taklif qilish',
        copy: 'Nusxa olish',
        stats: 'Statistika',
        invited: 'Taklif qilinganlar',
        earned: 'Mukofotlar'
      },
      events: {
        title: 'Tadbirlar',
        active: 'Faol',
        finished: 'Tugallangan',
        reward: 'Mukofot',
        deadline: 'Muddati'
      },
      home: {
        title: 'Asosiy',
        stars: 'Yulduzlar',
        premium: 'Premium',
        username: 'Telegram foydalanuvchi nomi',
        buy: 'Sotib olish',
        success: 'Xarid muvaffaqiyatli yakunlandi!'
      },
      market: {
        title: 'Market',
        gifts: 'Sovg\'alar',
        nftGifts: 'NFT Sovg\'alar',
        recipient: 'Qabul qiluvchi nomi',
        send: 'Yuborish',
        rarity: 'Noyoblik'
      },
      profile: {
        title: 'Profil',
        balance: 'Balans',
        topup: 'To\'ldirish',
        history: 'Tranzaksiyalar tarixi',
        id: 'Telegram ID'
      },
      settings: {
        title: 'Sozlamalar',
        appearance: 'Ko\'rinish',
        darkMode: 'Tungi rejim',
        nightMode: 'Night Mode',
        textSize: 'Matn hajmi',
        small: 'Kichik',
        medium: 'O\'rta',
        large: 'Katta'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
