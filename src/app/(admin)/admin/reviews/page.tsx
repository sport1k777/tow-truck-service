import { prisma } from '@/lib/prisma';
import {
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
  AdminTextarea,
} from '@/components/admin/admin-ui';
import { deleteTestimonialAction, saveTestimonialAction } from '@/actions/admin.actions';

export default async function AdminReviewsPage() {
  const reviews = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHeader title="Відгуки" description="CRUD для блоку відгуків на головній сторінці." />
      <div className="space-y-6">
        {reviews.map((review) => (
          <AdminCard key={review.id} title={review.name}>
            <form action={saveTestimonialAction} className="space-y-4">
              <input type="hidden" name="id" value={review.id} />
              <AdminGrid>
                <AdminField label="Імʼя"><AdminInput name="name" defaultValue={review.name} /></AdminField>
                <AdminField label="Місто"><AdminInput name="city" defaultValue={review.city} /></AdminField>
                <AdminField label="Ініціали"><AdminInput name="initials" defaultValue={review.initials} /></AdminField>
                <AdminField label="Тип послуги"><AdminInput name="serviceType" defaultValue={review.serviceType} /></AdminField>
                <AdminField label="Градієнт аватара"><AdminInput name="avatarGradient" defaultValue={review.avatarGradient} /></AdminField>
                <AdminField label="Порядок"><AdminInput name="sortOrder" type="number" defaultValue={review.sortOrder} /></AdminField>
                <AdminField label="Активний"><input type="checkbox" name="isActive" defaultChecked={review.isActive} className="h-4 w-4" /></AdminField>
              </AdminGrid>
              <AdminField label="Відгук"><AdminTextarea name="review" defaultValue={review.review} /></AdminField>
              <AdminSubmitBar>
                <AdminButton type="submit">Зберегти</AdminButton>
                <AdminButton formAction={deleteTestimonialAction} variant="danger" type="submit">Видалити</AdminButton>
              </AdminSubmitBar>
            </form>
          </AdminCard>
        ))}
        <AdminCard title="Додати відгук">
          <form action={saveTestimonialAction} className="space-y-4">
            <AdminGrid>
              <AdminField label="Імʼя"><AdminInput name="name" required /></AdminField>
              <AdminField label="Місто"><AdminInput name="city" required /></AdminField>
              <AdminField label="Ініціали"><AdminInput name="initials" required /></AdminField>
              <AdminField label="Тип послуги"><AdminInput name="serviceType" defaultValue="Екстрена евакуація" /></AdminField>
            </AdminGrid>
            <AdminField label="Відгук"><AdminTextarea name="review" required /></AdminField>
            <AdminSubmitBar><AdminButton type="submit">Додати</AdminButton></AdminSubmitBar>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
