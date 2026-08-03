/**
 * Company contact defaults — single source of truth until Admin Settings are DB-backed.
 * Display format for UI; E.164 / wa.me digits for links.
 */

export const COMPANY_PHONE_DISPLAY = '+380 (96) 127 30 52';

/** E.164 without spaces — used in tel: and WhatsApp wa.me paths */
export const COMPANY_PHONE_E164 = '+380961273052';

export const COMPANY_PHONE_TEL = 'tel:+380961273052';

/** wa.me uses digits only, no + prefix */
export const COMPANY_WHATSAPP_NUMBER = '380961273052';

export const COMPANY_WHATSAPP_URL = 'https://wa.me/380961273052';

export function getTelHref(): string {
  return COMPANY_PHONE_TEL;
}

export function getWhatsAppHref(message?: string): string {
  if (!message?.trim()) {
    return COMPANY_WHATSAPP_URL;
  }

  return `${COMPANY_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export function getDisplayPhone(settingsPhone?: string | null): string {
  return settingsPhone?.trim() || COMPANY_PHONE_DISPLAY;
}

export function getDisplayWhatsApp(
  settingsWhatsApp?: string | null,
  settingsPhone?: string | null,
): string {
  if (settingsWhatsApp?.trim()) {
    return settingsWhatsApp.trim();
  }

  if (settingsPhone?.trim()) {
    return settingsPhone.trim();
  }

  return COMPANY_PHONE_DISPLAY;
}
