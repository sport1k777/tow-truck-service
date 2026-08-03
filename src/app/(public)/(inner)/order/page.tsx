import { BookingPageContent } from '@/components/booking/booking-page-content';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Замовити евакуатор',
    description:
      'Онлайн-замовлення евакуатора по Україні. Вкажіть адресу, контакти та марку авто — диспетчер підтвердить заявку.',
    path: '/order',
  });
}

export default function OrderPage() {
  return <BookingPageContent />;
}
