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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Замовити евакуатор</h1>
      <p className="mt-2 text-muted-foreground">
        Форма замовлення буде реалізована в Phase 7 (Frontend Development).
      </p>
    </div>
  );
}
