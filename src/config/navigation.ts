/** Shared public site navigation — used by homepage and inner-page headers. */
export const PUBLIC_NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/#how-it-works', label: 'Як це працює' },
  { href: '/#pricing', label: 'Ціни' },
  { href: '/contact', label: 'Контакти' },
] as const;

export const PUBLIC_FOOTER_NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/#services', label: 'Послуги' },
  { href: '/#how-it-works', label: 'Як це працює' },
  { href: '/#pricing', label: 'Ціни' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#contact', label: 'Контакти' },
] as const;
