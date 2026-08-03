import {
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
  serializeJsonLd,
} from '@/modules/seo/json-ld';
import { getAppUrl } from '@/lib/app-url';
import { baseAppConfig } from '@/config/base.config';

interface SiteJsonLdProps {
  companyName: string;
  description?: string;
  telephone?: string | null;
  email?: string | null;
}

export function SiteJsonLd({
  companyName,
  description = baseAppConfig.defaultDescription,
  telephone,
  email,
}: SiteJsonLdProps) {
  const url = getAppUrl();

  const localBusiness = buildLocalBusinessJsonLd({
    companyName,
    description,
    url,
    telephone,
    email,
  });

  const webSite = buildWebSiteJsonLd({
    companyName,
    description,
    url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webSite) }}
      />
    </>
  );
}
