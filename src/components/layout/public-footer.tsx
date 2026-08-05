import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Share2,
} from 'lucide-react';
import type { BusinessSettings } from '@/modules/settings/settings.types';
import {
  getDisplayPhone,
  getTelHref,
  getWhatsAppHref,
} from '@/lib/contact';
import { getPublicEmail, resolveSocialLinks } from '@/lib/contact-display';
import { PUBLIC_FOOTER_NAV_ITEMS } from '@/config/navigation';

const SOCIAL_LINK_DEFINITIONS = [
  { id: 'instagram', href: '', label: 'Instagram', icon: Instagram },
  { id: 'telegram', href: '', label: 'Telegram', icon: Send },
  { id: 'facebook', href: '', label: 'Facebook', icon: Share2 },
] as const;

export function PublicFooter({
  variant = 'dark',
  settings,
  footerTagline,
}: {
  variant?: 'dark' | 'light';
  settings: BusinessSettings;
  footerTagline?: string;
}) {
  const companyName = settings.companyName || 'Евакуатор';
  const isDark = variant === 'dark';

  const displayPhone = getDisplayPhone(settings.phone);
  const displayWhatsApp = getDisplayPhone(settings.whatsappNumber || settings.phone);
  const displayEmail = getPublicEmail(settings.email);
  const displayHours = settings.workingHours || '24/7';
  const tagline =
    footerTagline ??
    'Професійна служба евакуації по всій Україні. Цілодобово, прозорі ціни та швидкий виїзд.';

  const socialLinks = resolveSocialLinks(SOCIAL_LINK_DEFINITIONS, settings.socialLinks);

  if (!isDark) {
    return (
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {companyName}. Всі права захищені.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#030712]">
      <div className="landing-section-divider" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(59,130,246,0.05),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Logo & tagline */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
              aria-label={`${companyName} — головна`}
            >
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt={companyName}
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/25 bg-gradient-to-br from-sky-500/20 to-blue-600/15 text-sm font-bold text-sky-400">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              )}
              {!settings.logoUrl && (
                <span className="text-lg font-semibold tracking-tight text-white">
                  {companyName}
                </span>
              )}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">{tagline}</p>
          </div>

          {/* Navigation */}
          <nav className="lg:col-span-3" aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Навігація
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PUBLIC_FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-white transition-colors duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Контакти
            </h2>
            <ul className="mt-4 space-y-3">
              <FooterContactItem
                icon={Phone}
                label="Телефон"
                value={displayPhone}
                href={getTelHref()}
              />
              <FooterContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value={displayWhatsApp}
                href={getWhatsAppHref()}
                external
              />
              {displayEmail && (
                <FooterContactItem
                  icon={Mail}
                  label="Email"
                  value={displayEmail}
                  href={`mailto:${displayEmail}`}
                />
              )}
              <FooterContactItem icon={Clock} label="Години роботи" value={displayHours} />
              <FooterContactItem icon={Globe} label="Зона обслуговування" value="Вся Україна" />
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/[0.06] pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/40">
            © {companyName} {new Date().getFullYear()}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-sm text-white/90 transition-colors hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center text-sm text-white/90 transition-colors hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
            >
              Умови використання
            </Link>
          </div>

          {socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {socialLinks.map(({ id, href, label, icon: Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/80 backdrop-blur-sm transition-all duration-300"
                aria-label={label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterContactItem({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <span className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sky-400/80">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[11px] font-medium uppercase tracking-wider text-white/60">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-white/90 transition-colors group-hover:text-white">
          {value}
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="group inline-flex min-h-11 items-center py-1 transition-opacity hover:opacity-90"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      </li>
    );
  }

  return <li className="group">{content}</li>;
}
