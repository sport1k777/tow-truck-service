import { auth } from '@/lib/auth';
import type { AdminRole } from '@prisma/client';

export class AdminAuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export async function requireAdmin(allowedRoles?: AdminRole[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AdminAuthError();
  }

  const role = session.user.role as AdminRole | undefined;

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    throw new AdminAuthError('Forbidden');
  }

  return session;
}
