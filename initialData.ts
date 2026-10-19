import { Channel, Order, BloggerSubmission, PostFormat } from '../types';

export const POST_FORMATS: PostFormat[] = [
  { id: 'photo', label: 'Пост', tag: 'Базовый', priceMod: 1.0, desc: 'Нативный пост с фото и текстом в ленте', icon: '📝' },
  { id: 'repost', label: 'Репост', tag: '-25%', priceMod: 0.75, desc: 'Прямой репост из вашего канала', icon: '🔄' },
  { id: 'story', label: 'История', tag: '-40% 🔥', priceMod: 0.60, desc: 'Вертикальная Stories на 24 часа с кликабельной ссылкой', icon: '📱' },
  { id: 'link', label: 'Ссылка', tag: '-15%', priceMod: 0.85, desc: 'Короткая нативная интеграция со ссылкой', icon: '🔗' },
];

export const CATEGORIES = [
  { id: 'all', label: 'Все каналы' },
  { id: 'deals', label: '🔥 Горящие слоты' },
  { id: 'mini', label: '🌱 От 840 ₽' },
  { id: 'tech', label: '💻 Технологии & IT' },
  { id: 'beauty', label: '💄 Красота & Стиль' },
  { id: 'news', label: '📰 Новости' },
  { id: 'business', label: '💼 Бизнес & Стартапы' },
  { id: 'lifestyle', label: '☕ Лайфстайл' },
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'ch-tech-pulse',
    name: 'ТехноПульс & AI',
    handle: '@techno_pulse',
    channelUrl: 'https://t.me/techno_pulse',
    platform: 'Telegram + MAX',
    category: 'tech',
    categoryLabel: 'Технологии & IT',
    subscribers: 145000,
    dailyViews: 52400,
    err: '36.1%',
    badge: '🔥 Скидка на вечерний слот',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@techno_pulse_admin',
    inn: '772491028301',
    description: 'Авторский канал о нейросетях, гаджетах и стартапах. Платежеспособная IT-аудитория с высоким откликом на сервисы и продукты.',
    basePrice: 7200,
    slots: [
      { id: 'tp-s1', date: 'Сегодня, 19 окт', time: '14:00', price: 6800, status: 'free' },
      { id: 'tp-s2', date: 'Сегодня, 19 окт', time: '18:00', price: 7200, status: 'free' },
      { id: 'tp-s3', date: 'Завтра, 20 окт', time: '12:30', price: 6500, status: 'free' },
      { id: 'tp-s4', date: 'Завтра, 20 окт', time: '19:00', price: 7500, status: 'booked', bookedBy: '@alex_startup' }
    ],
    demographics: {
      gender: { male: 68, female: 32 },
      age: [
        { label: '18-24', pct: 42 },
        { label: '25-34', pct: 40 },
        { label: '35+', pct: 18 }
      ],
      geo: [
        { country: 'Россия', pct: 76 },
        { country: 'Беларусь', pct: 11 },
        { country: 'Казахстан', pct: 8 },
        { country: 'Другие', pct: 5 }
      ]
    },
    status: 'approved'
  },
  {
    id: 'ch-sofa-cozy',
    name: 'Софа | Уют & Лайфстайл',
    handle: '@sofa_cozy_life',
    channelUrl: 'https://t.me/sofa_cozy_life',
    platform: 'Telegram',
    category: 'lifestyle',
    categoryLabel: 'Лайфстайл',
    subscribers: 6400,
    dailyViews: 4200,
    err: '65.6%',
    badge: '🌱 Высокий отклик (ERR 65%)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@sofa_cozy',
    inn: '772910485902',
    description: 'Начинающий микроблогер с искренней и преданной аудиторией. Идеально для книг, декора, косметики и локальных брендов.',
    basePrice: 1400,
    slots: [
      { id: 'sc-s1', date: 'Сегодня, 19 окт', time: '15:00', price: 1400, status: 'free' },
      { id: 'sc-s2', date: 'Завтра, 20 окт', time: '11:00', price: 1400, status: 'free' },
      { id: 'sc-s3', date: 'Завтра, 20 окт', time: '18:30', price: 1600, status: 'free' }
    ],
    demographics: {
      gender: { male: 18, female: 82 },
      age: [
        { label: '18-24', pct: 58 },
        { label: '25-34', pct: 28 },
        { label: '35+', pct: 14 }
      ],
      geo: [
        { country: 'Россия', pct: 88 },
        { country: 'Беларусь', pct: 7 },
        { country: 'Другие', pct: 5 }
      ]
    },
    status: 'approved'
  },
  {
    id: 'ch-beauty-eva',
    name: 'Ева про Бьюти & Уход',
    handle: '@eva_beauty_glow',
    channelUrl: 'https://t.me/eva_beauty_glow',
    platform: 'Telegram',
    category: 'beauty',
    categoryLabel: 'Красота & Стиль',
    subscribers: 98000,
    dailyViews: 41800,
    err: '42.6%',
    badge: '✨ Топ для маркетплейсов',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@eva_beauty',
    inn: '502409182344',
    description: 'Честные обзоры косметики, уходовых средств и одежды с Wildberries и Ozon. Высочайшая конверсия в заказы.',
    basePrice: 5800,
    slots: [
      { id: 'eb-s1', date: 'Сегодня, 19 окт', time: '16:00', price: 5800, status: 'free' },
      { id: 'eb-s2', date: 'Завтра, 20 окт', time: '14:00', price: 5800, status: 'free' },
      { id: 'eb-s3', date: '21 октября', time: '19:00', price: 6200, status: 'free' }
    ],
    demographics: {
      gender: { male: 12, female: 88 },
      age: [
        { label: '18-24', pct: 52 },
        { label: '25-34', pct: 36 },
        { label: '35+', pct: 12 }
      ],
      geo: [
        { country: 'Россия', pct: 82 },
        { country: 'Казахстан', pct: 10 },
        { country: 'Беларусь', pct: 5 },
        { country: 'Другие', pct: 3 }
      ]
    },
    status: 'approved'
  },
  {
    id: 'ch-trends-news',
    name: 'Новости Трендов | Главное',
    handle: '@trends_today_tg',
    channelUrl: 'https://t.me/trends_today_tg',
    platform: 'MAX',
    category: 'news',
    categoryLabel: 'Новости',
    subscribers: 280000,
    dailyViews: 110000,
    err: '39.2%',
    badge: '⚡ Мгновенный охват',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@trends_adm',
    inn: '770198273615',
    description: 'Горячие мировые и российские инфоповоды, вирусные тренды и аналитика. Быстрый охват на сотни тысяч просмотров.',
    basePrice: 12900,
    slots: [
      { id: 'tn-s1', date: 'Сегодня, 19 окт', time: '17:00', price: 12900, status: 'free' },
      { id: 'tn-s2', date: 'Сегодня, 19 окт', time: '21:00', price: 13500, status: 'free' },
      { id: 'tn-s3', date: 'Завтра, 20 окт', time: '13:00', price: 12500, status: 'free' }
    ],
    demographics: {
      gender: { male: 54, female: 46 },
      age: [
        { label: '18-24', pct: 40 },
        { label: '25-34', pct: 41 },
        { label: '35+', pct: 19 }
      ],
      geo: [
        { country: 'Россия', pct: 85 },
        { country: 'Казахстан', pct: 8 },
        { country: 'Беларусь', pct: 4 },
        { country: 'Другие', pct: 3 }
      ]
    },
    status: 'approved'
  },
  {
    id: 'ch-startup-cases',
    name: 'Бизнес & Кейсы Запусков',
    handle: '@startup_cases',
    channelUrl: 'https://t.me/startup_cases',
    platform: 'Telegram + MAX',
    category: 'business',
    categoryLabel: 'Бизнес & Стартапы',
    subscribers: 112000,
    dailyViews: 43000,
    err: '38.4%',
    badge: '💼 B2B аудитория с чеком',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@startup_cases_boss',
    inn: '781039485721',
    description: 'Разборы реальных воронок, факапы предпринимателей, маркетинг и инвестиции. Руководители и серийные фаундеры.',
    basePrice: 7900,
    slots: [
      { id: 'scb-s1', date: 'Сегодня, 19 окт', time: '13:00', price: 7900, status: 'free' },
      { id: 'scb-s2', date: 'Завтра, 20 окт', time: '11:00', price: 7900, status: 'free' },
      { id: 'scb-s3', date: 'Завтра, 20 окт', time: '17:30', price: 8200, status: 'free' }
    ],
    demographics: {
      gender: { male: 72, female: 28 },
      age: [
        { label: '18-24', pct: 32 },
        { label: '25-34', pct: 49 },
        { label: '35+', pct: 19 }
      ],
      geo: [
        { country: 'Россия', pct: 79 },
        { country: 'Казахстан', pct: 11 },
        { country: 'Другие', pct: 10 }
      ]
    },
    status: 'approved'
  },
  {
    id: 'ch-mark-diary',
    name: 'Дневник Марка | МСК',
    handle: '@mark_lifestyle',
    channelUrl: 'https://t.me/mark_lifestyle',
    platform: 'Telegram',
    category: 'lifestyle',
    categoryLabel: 'Лайфстайл',
    subscribers: 76000,
    dailyViews: 34500,
    err: '45.3%',
    badge: '🎙 Нативные интеграции',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    eridAuto: true,
    ownerUsername: '@mark_life',
    inn: '771589302194',
    description: 'Городская жизнь, интересные места, кофейни, мероприятия и путешествия. Молодая активная аудитория 20-35 лет.',
    basePrice: 4900,
    slots: [
      { id: 'md-s1', date: 'Сегодня, 19 окт', time: '16:00', price: 4900, status: 'free' },
      { id: 'md-s2', date: 'Завтра, 20 окт', time: '15:00', price: 4900, status: 'free' }
    ],
    demographics: {
      gender: { male: 48, female: 52 },
      age: [
        { label: '18-24', pct: 58 },
        { label: '25-34', pct: 30 },
        { label: '35+', pct: 12 }
      ],
      geo: [
        { country: 'Россия', pct: 88 },
        { country: 'Беларусь', pct: 6 },
        { country: 'Другие', pct: 6 }
      ]
    },
    status: 'approved'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TS-849102',
    createdAt: '19.10.2026, 14:20',
    advertiserHandle: '@founder_pro',
    channelId: 'ch-tech-pulse',
    channelName: 'ТехноПульс & AI',
    channelHandle: '@techno_pulse',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    channelUrl: 'https://t.me/techno_pulse',
    slotId: 'tp-s4',
    slotDate: 'Завтра, 20 окт',
    slotTime: '19:00',
    format: 'photo',
    formatLabel: 'Пост',
    price: 7500,
    status: 'Оплачено',
    erid: '2Vtzqw98KLA',
    postLink: 'https://t.me/founder_pro/42',
    comments: 'Опубликовать ровно в 19:00 с нативной подводкой фаундера',
    paymentMethod: 'СБП (Escrow)'
  },
  {
    id: 'TS-849089',
    createdAt: '18.10.2026, 19:45',
    advertiserHandle: '@mari_beauty_brand',
    channelId: 'ch-beauty-eva',
    channelName: 'Ева про Бьюти & Уход',
    channelHandle: '@eva_beauty_glow',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    channelUrl: 'https://t.me/eva_beauty_glow',
    slotId: 'eb-s2',
    slotDate: 'Завтра, 20 окт',
    slotTime: '14:00',
    format: 'story',
    formatLabel: 'История',
    price: 3480,
    status: 'В эфире',
    erid: '2Vtzqw31MPO',
    postLink: 'https://t.me/mari_beauty_brand/108',
    comments: 'Stories со стикером-ссылкой на Wildberries',
    paymentMethod: 'Карта МИР'
  },
  {
    id: 'TS-848834',
    createdAt: '17.10.2026, 12:10',
    advertiserHandle: '@coffee_club_msk',
    channelId: 'ch-mark-diary',
    channelName: 'Дневник Марка | МСК',
    channelHandle: '@mark_lifestyle',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    channelUrl: 'https://t.me/mark_lifestyle',
    slotId: 'md-s1',
    slotDate: '17 октября',
    slotTime: '16:00',
    format: 'repost',
    formatLabel: 'Репост',
    price: 3675,
    status: 'Завершен',
    erid: '2Vtzqw12QAZ',
    postLink: 'https://t.me/coffee_club_msk/305',
    comments: 'Репост анонса открытия кофейни',
    paymentMethod: 'СБП (Escrow)'
  }
];

export const INITIAL_SUBMISSIONS: BloggerSubmission[] = [
  {
    id: 'sub-101',
    submittedAt: 'Сегодня, 13:15',
    bloggerUsername: '@artem_crypto_dev',
    channelName: 'Web3 & AI Инструменты',
    channelHandle: '@web3_ai_tools',
    channelUrl: 'https://t.me/web3_ai_tools',
    platform: 'Telegram',
    category: 'tech',
    categoryLabel: 'Технологии & IT',
    subscribers: 18500,
    dailyViews: 7400,
    err: '40.0%',
    inn: '772819283740',
    desiredBasePrice: 2800,
    description: 'Канал для разработчиков и криптоэнтузиастов. Ежедневные обзоры библиотек, AI-сервисов и фреймворков.',
    initialSlots: [
      { date: '21 октября', time: '13:00', price: 2800 },
      { date: '21 октября', time: '18:00', price: 3100 },
      { date: '22 октября', time: '15:00', price: 2800 }
    ],
    status: 'pending'
  },
  {
    id: 'sub-102',
    submittedAt: 'Вчера, 18:40',
    bloggerUsername: '@katya_fit_coach',
    channelName: 'Катя про Фитнес & ПП',
    channelHandle: '@katya_health_fit',
    channelUrl: 'https://t.me/katya_health_fit',
    platform: 'Telegram + MAX',
    category: 'lifestyle',
    categoryLabel: 'Лайфстайл',
    subscribers: 24000,
    dailyViews: 9800,
    err: '41.5%',
    inn: '501829384712',
    desiredBasePrice: 3200,
    description: 'Фитнес-тренер, тренировки дома, здоровые рецепты и мотивация для девушек.',
    initialSlots: [
      { date: '21 октября', time: '11:00', price: 3200 },
      { date: '22 октября', time: '19:00', price: 3600 }
    ],
    status: 'pending'
  }
];
