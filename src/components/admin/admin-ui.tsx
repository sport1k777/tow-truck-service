import type { ReactNode } from 'react';

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-white/60">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${className}`}
    >
      {title ? <h2 className="mb-4 text-lg font-medium text-white">{title}</h2> : null}
      {children}
    </section>
  );
}

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/80">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-white/45">{hint}</span> : null}
    </label>
  );
}

export function adminInputClassName() {
  return 'w-full rounded-xl border border-white/10 bg-[#030712] px-4 py-2.5 text-sm text-white outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20';
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${adminInputClassName()} ${props.className ?? ''}`} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${adminInputClassName()} min-h-[120px] resize-y ${props.className ?? ''}`}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${adminInputClassName()} ${props.className ?? ''}`} />;
}

export function AdminButton({
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const variants = {
    primary:
      'bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50',
    secondary:
      'border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50',
    danger:
      'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 disabled:opacity-50',
  };

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${variants[variant]} ${className}`}
    />
  );
}

export function AdminAlert({
  type = 'success',
  children,
}: {
  type?: 'success' | 'error';
  children: ReactNode;
}) {
  const styles =
    type === 'success'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
      : 'border-red-500/20 bg-red-500/10 text-red-200';

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

export function AdminGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function AdminSubmitBar({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">{children}</div>;
}
