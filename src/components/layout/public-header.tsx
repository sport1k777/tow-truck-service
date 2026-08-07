import { SettingsService } from '@/modules/settings/settings.service';
import { PublicHeaderClient } from './public-header-client';
import { baseAppConfig } from '@/config/base.config';

interface PublicHeaderProps {
  variant?: 'dark' | 'light';
}

export async function PublicHeader({ variant = 'dark' }: PublicHeaderProps) {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || baseAppConfig.defaultSiteName;

  return <PublicHeaderClient companyName={companyName} isDark={variant === 'dark'} />;
}
