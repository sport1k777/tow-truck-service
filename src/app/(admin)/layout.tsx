import { auth } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Адмін-панель',
    description: 'Керування замовленнями та налаштуваннями служби евакуації.',
    path: '/admin',
    noIndex: true,
  });
}

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <AdminShell userName={session?.user?.name}>{children}</AdminShell>;
}
