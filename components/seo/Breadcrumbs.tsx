import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-slate-900">
            Ana Sayfa
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
