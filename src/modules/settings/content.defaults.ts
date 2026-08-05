import type { WebsiteContentSettings } from './settings.types';

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentSettings = {
  heroBadge: '24/7 по всій Україні',
  heroTitle: 'Евакуатор',
  heroTitleHighlight: 'за 30 секунд',
  heroSubtitle:
    'Професійна евакуація автомобілів по всій Україні. Миттєвий розрахунок вартості, маршрут на карті та онлайн-замовлення — без зайвих дзвінків і очікування.',
  heroCtaPrimary: 'Замовити евакуатор',
  heroCtaSecondary: 'Розрахувати вартість',
  heroTrustItems: [
    { label: 'Швидкий виїзд', icon: 'Zap' },
    { label: 'Вся Україна', icon: 'MapPin' },
    { label: 'Надійний сервіс', icon: 'Shield' },
    { label: '24/7', icon: 'Clock' },
  ],
  aboutTitle: 'Про нас',
  aboutBody:
    'Ми надаємо послуги евакуації легкових та вантажних автомобілів по всій Україні. Прозорий калькулятор вартості, онлайн-замовлення та швидке підтвердження через WhatsApp.',
  footerTagline:
    'Професійна служба евакуації по всій Україні. Цілодобово, прозорі ціни та швидкий виїзд.',
};
