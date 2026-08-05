'use client';

import { useState } from 'react';
import { AdminButton } from './admin-ui';

export function AdminDeleteButton({
  label = 'Видалити',
  confirmMessage = 'Видалити цей запис? Дію неможливо скасувати.',
  formAction,
}: {
  label?: string;
  confirmMessage?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  const [confirmed, setConfirmed] = useState(false);

  if (!confirmed) {
    return (
      <AdminButton
        type="button"
        variant="danger"
        onClick={() => setConfirmed(true)}
      >
        {label}
      </AdminButton>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-red-300">{confirmMessage}</span>
      <AdminButton type="submit" variant="danger" formAction={formAction}>
        Підтвердити
      </AdminButton>
      <AdminButton type="button" variant="secondary" onClick={() => setConfirmed(false)}>
        Скасувати
      </AdminButton>
    </div>
  );
}
