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
import { SettingsService } from '@/modules/settings/settings.service';

const PLACEHOLDER_PHONE = '+38 (000) 000-00-00';
const PLACEHOLDER_EMAIL = 'info@example.com';

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/#services', label: 'Послуги' },
  { href: '/#how-it-works', label: 'Як це працює' },
  { href: '/#pricing', label: 'Ціни' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#contact', label: 'Контакти' },
] as const;

const SOCIAL_PLACEHOLDERS = [
  { id: 'instagram', href: '#', label: 'Instagram', icon: Instagram },
  { id: 'telegram', href: '#', label: 'Telegram', icon: Send },
  { id: 'facebook', href: '#', label: 'Facebook', icon: Share2 },
] as const;

function toTelHref(value: string): string {
  const normalized = value.replace(/[^\d+]/g, '');
  return normalized ? `tel:${normalized}` : '#';
}

function toWhatsAppHref(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '#';
}

export async function PublicFooter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || 'Евакуатор';
  const isDark = variant === 'dark';

  const displayPhone = settings.phone || PLACEHOLDER_PHONE;
  const displayWhatsApp = settings.whatsappNumber || settings.phone || PLACEHOLDER_PHONE;
  const displayEmail = settings.email || PLACEHOLDER_EMAIL;
  const displayHours = settings.workingHours || '24/7';

  const socialLinks = SOCIAL_PLACEHOLDERS.map((item) => ({
    ...item,
    href: settings.socialLinks[item.id] || item.href,
  }));

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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Professional tow truck service across Ukraine. Available 24/7 with transparent pricing
              and fast dispatch.
            </p>
          </div>

          {/* Navigation */}
          <nav className="lg:col-span-3" aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/35">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/55 transition-colors duration-200 hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/35">
              Contact
            </h2>
            <ul className="mt-4 space-y-3">
              <FooterContactItem
                icon={Phone}
                label="Phone"
                value={displayPhone}
                href={toTelHref(displayPhone)}
              />
              <FooterContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value={displayWhatsApp}
                href={toWhatsAppHref(displayWhatsApp)}
                external
              />
              <FooterContactItem
                icon={Mail}
                label="Email"
                value={displayEmail}
                href={`mailto:${displayEmail}`}
              />
              <FooterContactItem icon={Clock} label="Working hours" value={displayHours} />
              <FooterContactItem icon={Globe} label="Service area" value="All Ukraine" />
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
              className="text-sm text-white/45 transition-colors hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-white/45 transition-colors hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:underline"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ id, href, label, icon: Icon }) => (
              <a
                key={id}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="footer-social-icon flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/45 backdrop-blur-sm transition-all duration-300"
                aria-label={label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
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
        <span className="block text-[11px] font-medium uppercase tracking-wider text-white/35">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-white/70 transition-colors group-hover:text-white">
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
          className="group block transition-opacity hover:opacity-90"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      </li>
    );
  }

  return <li className="group">{content}</li>;
}
