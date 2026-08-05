'use client';

import { AdminField } from './admin-ui';

export function ImageUploadField({ label, hint }: { label: string; hint?: string }) {
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = (await response.json()) as { url?: string; error?: string };

    if (data.url) {
      const form = event.target.closest('form');
      const urlInput = form?.querySelector<HTMLInputElement>(
        'input[name="url"], input[name="logoUrl"], input[name="faviconUrl"], input[name="ogImage"]',
      );
      if (urlInput) {
        urlInput.value = data.url;
      }
    }
  }

  return (
    <AdminField label={label} hint={hint ?? 'JPEG, PNG або WebP до 5 MB'}>
      <input type="file" accept="image/*" onChange={handleUpload} className="text-sm text-white/70" />
    </AdminField>
  );
}
