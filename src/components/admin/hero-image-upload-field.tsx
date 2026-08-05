'use client';

import { useRef } from 'react';
import { AdminField } from './admin-ui';

export function HeroImageUploadField() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = (await response.json()) as { url?: string; error?: string };

    if (data.url) {
      const urlInput = inputRef.current?.closest('form')?.querySelector<HTMLInputElement>('input[name="url"]');
      if (urlInput) {
        urlInput.value = data.url;
      }
    }
  }

  return (
    <AdminField label="Завантажити файл" hint="JPEG, PNG або WebP до 5 MB">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="text-sm text-white/70" />
    </AdminField>
  );
}
