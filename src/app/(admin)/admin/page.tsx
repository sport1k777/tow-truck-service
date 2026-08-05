import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LoginForm } from '@/components/admin/login-form';

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/admin/dashboard');
  }

  return <LoginForm />;
}
