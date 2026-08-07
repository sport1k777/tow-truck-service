import { auth } from '@/lib/auth';
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminSubmitBar,
  AdminAlert,
} from '@/components/admin/admin-ui';
import { saveAdminSecurityAction } from '@/actions/admin.actions';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_password: 'Current password is incorrect.',
  email_taken: 'That email is already in use.',
  password_short: 'New password must be at least 8 characters.',
  password_mismatch: 'New passwords do not match.',
  admin_not_found: 'Admin account not found.',
};

export async function AdminSecuritySection({
  error,
}: {
  error?: string;
}) {
  const session = await auth();

  return (
    <AdminCard title="Account security">
      {error ? <AdminAlert type="error">{ERROR_MESSAGES[error] ?? 'Unable to update account.'}</AdminAlert> : null}
      <form action={saveAdminSecurityAction} className="space-y-4">
        <AdminField label="Current email">
          <AdminInput value={session?.user?.email ?? ''} readOnly disabled />
        </AdminField>
        <AdminField label="New email">
          <AdminInput name="newEmail" type="email" placeholder={session?.user?.email ?? 'admin@example.com'} />
        </AdminField>
        <AdminField label="Current password" hint="Required to save any change">
          <AdminInput name="currentPassword" type="password" required autoComplete="current-password" />
        </AdminField>
        <AdminField label="New password">
          <AdminInput name="newPassword" type="password" autoComplete="new-password" />
        </AdminField>
        <AdminField label="Confirm new password">
          <AdminInput name="confirmPassword" type="password" autoComplete="new-password" />
        </AdminField>
        <AdminSubmitBar>
          <AdminButton type="submit">Update account</AdminButton>
        </AdminSubmitBar>
      </form>
    </AdminCard>
  );
}
