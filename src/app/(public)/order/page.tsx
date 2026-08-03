import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Замовити евакуатор',
    description: 'Онлайн-замовлення евакуатора. Вкажіть адресу, перегляньте маршрут та вартість.',
    path: '/order',
  });
}

export default function OrderPage() {
  return (
    <PageShell
      title="Замовити евакуатор"
      description="Форма замовлення буде реалізована в Phase 7 (Frontend Development)."
    />
  );
}
