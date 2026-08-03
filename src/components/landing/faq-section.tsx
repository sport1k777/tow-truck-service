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
    question: 'Як швидко приїде евакуатор?',
    answer:
      'У більшості міст середній час прибуття — 30–40 хвилин після підтвердження замовлення. Термін залежить від локації, трафіку та завантаженості. Під час оформлення заявки ви отримаєте орієнтовне вікно прибуття.',
  },
  {
    id: 'price-calculation',
    question: 'Як розраховується ціна?',
    answer:
      'Вартість залежить від відстані забору та доставки, типу авто, часу доби та додаткових послуг (лебідка, евакуація після ДТП тощо). Скористайтесь калькулятором на цій сторінці для миттєвої оцінки — без прихованих доплат.',
  },
  {
    id: 'night-order',
    question: 'Чи можна замовити евакуатор вночі?',
    answer:
      'Так. Ми працюємо цілодобово, 7 днів на тиждень, включно з нічним часом, вихідними та святами. Нічні замовлення обробляються так само, як і денні — телефоном або онлайн.',
  },
  {
    id: 'ukraine-coverage',
    question: 'Чи працюєте ви по всій Україні?',
    answer:
      'Так. Ми надаємо послуги евакуації та перевезення авто по всій Україні — від екстреного забору в місті до міжміських перевезень. Введіть адреси в калькулятор, щоб перевірити маршрут.',
  },
  {
    id: 'motorcycles',
    question: 'Чи можна перевезти мотоцикл?',
    answer:
      'Так. У нас є спеціальне обладнання та досвідчені оператори для безпечного перевезення мотоциклів і скутерів. Надійне кріплення та акуратне навантаження гарантують цілісність транспорту.',
  },
  {
    id: 'card-payment',
    question: 'Чи можна оплатити карткою?',
    answer:
      'Так. Приймаємо оплату карткою, готівкою та банківським переказом — залежно від послуги. Способи оплати уточнюються під час замовлення або прибуття водія.',
  },
  {
    id: 'advance-booking',
    question: 'Чи можна замовити евакуатор заздалегідь?',
    answer:
      'Так. Можна попередньо забронювати евакуатор на конкретну дату та час — зручно для планового перевезення на СТО, виставку або між містами. Оберіть зручний час під час онлайн-замовлення.',
  },
  {
    id: 'contact-dispatcher',
    question: 'Як звʼязатися з диспетчером?',
    answer:
      'Звʼяжіться з диспетчером телефоном, через форму замовлення на сайті або на сторінці контактів. Після оформлення заявки ви отримаєте підтвердження та зможете відстежувати статус.',
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
            Часті запитання
          </h2>
          <p className="landing-subtitle">
            Відповіді на найпоширеніші питання перед замовленням евакуатора.
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
