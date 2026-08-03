import { SETTINGS_DEFAULTS } from '@/modules/settings/settings.defaults';
import { PublicHeaderClient } from './public-header-client';

interface PublicHeaderProps {
  variant?: 'dark' | 'light';
}

export function PublicHeader({ variant = 'dark' }: PublicHeaderProps) {
  const settings = SETTINGS_DEFAULTS;
  const companyName = settings.companyName || 'Евакуатор';

  return <PublicHeaderClient companyName={companyName} isDark={variant === 'dark'} />;
}
