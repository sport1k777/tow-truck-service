interface PageShellProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 sm:px-10 lg:px-14">
      <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
      {description && <p className="mt-3 text-white/55">{description}</p>}
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
