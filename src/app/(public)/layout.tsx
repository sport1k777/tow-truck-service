import { PublicFooter } from '@/components/layout/public-footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#030712]">
      <main className="flex-1">{children}</main>
      <PublicFooter variant="dark" />
    </div>
  );
}
