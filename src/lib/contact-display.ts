/** Returns a public email only when configured — never a demo placeholder. */
export function getPublicEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim();
  return normalized || null;
}

export function isValidExternalUrl(href: string | null | undefined): href is string {
  if (!href?.trim()) {
    return false;
  }

  return href.trim() !== '#' && !href.trim().startsWith('#');
}

export interface SocialLink {
  id: string;
  href: string;
  label: string;
}

export function resolveSocialLinks<T extends SocialLink>(
  items: readonly T[],
  configured: Record<string, string | undefined>,
): T[] {
  return items
    .map((item) => ({
      ...item,
      href: configured[item.id]?.trim() || item.href,
    }))
    .filter((item) => isValidExternalUrl(item.href));
}
