'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useId, useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'arrival-time',
    question: 'How quickly can the tow truck arrive?',
    answer:
      'In most cities, the average arrival time is 30–40 minutes after your order is confirmed. Response time depends on your location, traffic, and current demand. You will receive an estimated arrival window when you place your order.',
  },
  {
    id: 'price-calculation',
    question: 'How is the price calculated?',
    answer:
      'The price is based on pickup and drop-off distance, vehicle type, time of day, and any additional services required (such as winch recovery or accident handling). Use the price calculator on this page for an instant estimate before booking — no hidden fees.',
  },
  {
    id: 'night-order',
    question: 'Can I order a tow truck at night?',
    answer:
      'Yes. We operate 24 hours a day, 7 days a week, including nights, weekends, and public holidays. Night orders are handled the same way as daytime requests — call or book online at any time.',
  },
  {
    id: 'ukraine-coverage',
    question: 'Do you work throughout Ukraine?',
    answer:
      'Yes. We provide towing and vehicle transport across Ukraine — from emergency city pickups to long-distance intercity deliveries. Enter your locations in the calculator to check availability for your route.',
  },
  {
    id: 'motorcycles',
    question: 'Can motorcycles be transported?',
    answer:
      'Absolutely. We have specialized equipment and trained operators for safe motorcycle and scooter transport. Secure strapping and careful loading ensure your bike arrives without damage.',
  },
  {
    id: 'card-payment',
    question: 'Can I pay by card?',
    answer:
      'Yes. We accept card payments, cash, and bank transfer depending on the service. Payment options are confirmed when you place your order or when the driver arrives on site.',
  },
  {
    id: 'advance-booking',
    question: 'Can I schedule a tow truck in advance?',
    answer:
      'Yes. You can pre-book a tow truck for a specific date and time — ideal for planned transport to a service station, car show, or intercity move. Select your preferred time slot during the online booking process.',
  },
  {
    id: 'contact-dispatcher',
    question: 'How can I contact the dispatcher?',
    answer:
      'You can reach our dispatcher by phone, through the online order form on this website, or via the contact page. After placing an order, you will receive confirmation and can track status updates directly.',
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  const handleToggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const buttons = event.currentTarget
        .closest('[data-faq-list]')
        ?.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]');

      if (!buttons?.length) return;

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = (index + 1) % buttons.length;
          break;
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = (index - 1 + buttons.length) % buttons.length;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      buttons[nextIndex]?.focus();
    },
    [],
  );

  return (
    <section id="faq" className="landing-section" aria-labelledby="faq-heading">
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(59,130,246,0.06),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container landing-container-narrow">
        <div className="landing-header">
          <p className="landing-eyebrow">FAQ</p>
          <h2 id="faq-heading" className="landing-title">
            Frequently Asked Questions
          </h2>
          <p className="landing-subtitle">
            Everything you need to know before ordering a tow truck.
          </p>
        </div>

        <dl className="space-y-3" data-faq-list>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const headingId = `${baseId}-faq-heading-${index}`;
            const panelId = `${baseId}-faq-panel-${index}`;

            return (
              <div
                key={item.id}
                className="faq-item faq-item-animate"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <dt className="m-0">
                  <button
                    type="button"
                    id={headingId}
                    data-faq-trigger
                    className="faq-trigger group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 text-left backdrop-blur-md sm:px-6 sm:py-5"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(item.id)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span className="text-sm font-semibold leading-snug text-white sm:text-base">
                      {item.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sky-400/70 transition-all duration-300 group-hover:border-sky-500/25 group-hover:bg-sky-500/10 group-hover:text-sky-300 ${isOpen ? 'rotate-180 border-sky-500/30 bg-sky-500/10 text-sky-300' : ''}`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </dt>
                <dd className="m-0">
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    aria-hidden={!isOpen}
                    className="faq-panel"
                    data-open={isOpen}
                  >
                    <div className="faq-panel-inner">
                      <p className="landing-body px-5 pb-4 pt-1 sm:px-6 sm:pb-5">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
