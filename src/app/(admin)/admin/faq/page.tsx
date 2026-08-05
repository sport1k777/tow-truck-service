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
import { deleteFaqAction, saveFaqAction } from '@/actions/admin.actions';

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHeader title="FAQ" description="Питання та відповіді для головної сторінки." />
      <div className="space-y-6">
        {items.map((item) => (
          <AdminCard key={item.id} title={item.question}>
            <form action={saveFaqAction} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <AdminField label="Питання"><AdminInput name="question" defaultValue={item.question} /></AdminField>
              <AdminField label="Відповідь"><AdminTextarea name="answer" defaultValue={item.answer} /></AdminField>
              <AdminGrid>
                <AdminField label="Порядок"><AdminInput name="sortOrder" type="number" defaultValue={item.sortOrder} /></AdminField>
                <AdminField label="Активний"><input type="checkbox" name="isActive" defaultChecked={item.isActive} className="h-4 w-4" /></AdminField>
              </AdminGrid>
              <AdminSubmitBar>
                <AdminButton type="submit">Зберегти</AdminButton>
                <AdminButton formAction={deleteFaqAction} variant="danger" type="submit">Видалити</AdminButton>
              </AdminSubmitBar>
            </form>
          </AdminCard>
        ))}
        <AdminCard title="Додати FAQ">
          <form action={saveFaqAction} className="space-y-4">
            <AdminField label="Питання"><AdminInput name="question" required /></AdminField>
            <AdminField label="Відповідь"><AdminTextarea name="answer" required /></AdminField>
            <AdminSubmitBar><AdminButton type="submit">Додати</AdminButton></AdminSubmitBar>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
