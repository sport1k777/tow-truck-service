import type { ExtraServiceType, HeroImageVariant } from '@prisma/client';

export const SEED_FAQ = [
  {
    question: 'Як швидко приїде евакуатор?',
    answer:
      'У більшості міст середній час прибуття — 30–40 хвилин після підтвердження замовлення. Термін залежить від локації, трафіку та завантаженості.',
    sortOrder: 0,
  },
  {
    question: 'Як розраховується ціна?',
    answer:
      'Вартість залежить від відстані забору та доставки, типу авто, часу доби та додаткових послуг. Скористайтесь калькулятором на цій сторінці для миттєвої оцінки.',
    sortOrder: 1,
  },
  {
    question: 'Чи можна замовити евакуатор вночі?',
    answer: 'Так. Ми працюємо цілодобово, 7 днів на тиждень, включно з нічним часом, вихідними та святами.',
    sortOrder: 2,
  },
  {
    question: 'Чи працюєте ви по всій Україні?',
    answer: 'Так. Ми надаємо послуги евакуації та перевезення авто по всій Україні.',
    sortOrder: 3,
  },
  {
    question: 'Чи можна перевезти мотоцикл?',
    answer: 'Так. У нас є спеціальне обладнання для безпечного перевезення мотоциклів і скутерів.',
    sortOrder: 4,
  },
  {
    question: 'Чи можна оплатити карткою?',
    answer: 'Так. Приймаємо оплату карткою, готівкою та банківським переказом.',
    sortOrder: 5,
  },
  {
    question: 'Чи можна замовити евакуатор заздалегідь?',
    answer: 'Так. Можна попередньо забронювати евакуатор на конкретну дату та час.',
    sortOrder: 6,
  },
  {
    question: 'Як звʼязатися з диспетчером?',
    answer: 'Звʼяжіться з диспетчером телефоном, через форму замовлення на сайті або на сторінці контактів.',
    sortOrder: 7,
  },
] as const;

export const SEED_TESTIMONIALS = [
  {
    initials: 'АК',
    avatarGradient: 'from-sky-500/40 to-blue-600/30',
    name: 'Андрій',
    city: 'Київ',
    review: 'Зламалась машина о півночі на Оболоні. Евакуатор приїхав за 35 хвилин, водій професійний.',
    serviceType: 'Екстрена евакуація',
    sortOrder: 0,
  },
  {
    initials: 'ОЛ',
    avatarGradient: 'from-violet-500/35 to-blue-600/25',
    name: 'Олена',
    city: 'Львів',
    review: 'Потрібно було перевезти авто до Харкова. Усе чітко по часу, жодних прихованих доплат.',
    serviceType: 'Міжміське перевезення',
    sortOrder: 1,
  },
  {
    initials: 'ВМ',
    avatarGradient: 'from-cyan-500/35 to-sky-600/25',
    name: 'Віктор',
    city: 'Одеса',
    review: 'Після ДТП на трасі швидко організували евакуацію. Авто доставили на СТО без пошкоджень.',
    serviceType: 'Евакуація після ДТП',
    sortOrder: 2,
  },
  {
    initials: 'МС',
    avatarGradient: 'from-blue-500/35 to-indigo-600/25',
    name: 'Марія',
    city: 'Харків',
    review: 'Замовила через сайт за хвилину — дуже зручно. Евакуатор був на місці швидше, ніж очікувала.',
    serviceType: 'Екстрена евакуація',
    sortOrder: 3,
  },
  {
    initials: 'ДК',
    avatarGradient: 'from-teal-500/30 to-blue-600/25',
    name: 'Дмитро',
    city: 'Дніпро',
    review: 'Везли позашляховик у інше місто — 400 км без проблем.',
    serviceType: 'Міжміське перевезення',
    sortOrder: 4,
  },
  {
    initials: 'НП',
    avatarGradient: 'from-sky-400/35 to-blue-500/30',
    name: 'Наталія',
    city: 'Вінниця',
    review: 'Приїхали оперативно, акуратно завантажили авто. Сервіс на високому рівні.',
    serviceType: 'Евакуація після ДТП',
    sortOrder: 5,
  },
] as const;

export const SEED_VEHICLE_CATEGORIES = [
  { slug: 'PASSENGER_CAR', label: 'Легковий автомобіль', perKmRate: 25, flatSurcharge: 0, sortOrder: 0 },
  { slug: 'SUV', label: 'Кросовер / SUV', perKmRate: 30, flatSurcharge: 0, sortOrder: 1 },
  { slug: 'VAN', label: 'Мінівен / фургон', perKmRate: 35, flatSurcharge: 0, sortOrder: 2 },
  { slug: 'LARGE_SUV', label: 'Великий SUV', perKmRate: 35, flatSurcharge: 0, sortOrder: 3 },
] as const;

export const SEED_EXTRA_SERVICES: Array<{
  slug: string;
  label: string;
  type: ExtraServiceType;
  amount: number;
  enabled: boolean;
  config: Record<string, unknown>;
  sortOrder: number;
}> = [
  {
    slug: 'night_surcharge',
    label: 'Нічна доплата (22:00–06:00)',
    type: 'PERCENT',
    amount: 20,
    enabled: true,
    config: { startHour: 22, endHour: 6 },
    sortOrder: 0,
  },
  {
    slug: 'emergency_dispatch',
    label: 'Термінова подача',
    type: 'FLAT',
    amount: 300,
    enabled: true,
    config: {},
    sortOrder: 1,
  },
  {
    slug: 'difficult_loading',
    label: 'Складне навантаження',
    type: 'FLAT',
    amount: 500,
    enabled: true,
    config: {},
    sortOrder: 2,
  },
  {
    slug: 'weekend_surcharge',
    label: 'Доплата за вихідні',
    type: 'PERCENT',
    amount: 15,
    enabled: false,
    config: {},
    sortOrder: 3,
  },
  {
    slug: 'holiday_surcharge',
    label: 'Святкова доплата',
    type: 'PERCENT',
    amount: 30,
    enabled: true,
    config: {},
    sortOrder: 4,
  },
];

export const SEED_HERO_IMAGES: Array<{
  url: string;
  alt: string;
  variant: HeroImageVariant;
  sortOrder: number;
}> = [
  {
    url: '/images/hero-background.webp',
    alt: 'Професійний евакуатор',
    variant: 'BOTH',
    sortOrder: 0,
  },
];
