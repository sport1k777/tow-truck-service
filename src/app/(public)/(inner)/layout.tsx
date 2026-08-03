import { PublicHeader } from '@/components/layout/public-header';

export default function InnerPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader variant="dark" />
      <div className="pt-16">{children}</div>
    </>
  );
}
