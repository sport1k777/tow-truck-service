import { PublicFooter } from '@/components/layout/public-footer';
import { SettingsService } from '@/modules/settings/settings.service';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, content] = await Promise.all([
    SettingsService.getBusinessSettings(),
    SettingsService.getContentSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#030712]">
      <main className="flex-1">{children}</main>
      <PublicFooter variant="dark" settings={settings} footerTagline={content.footerTagline} />
    </div>
  );
}
