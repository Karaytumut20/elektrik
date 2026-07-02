import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  const breadcrumbItems = [{ label: "Ana Sayfa", href: "/" }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className={`text-sm text-slate-500 ${className ?? ""}`}>
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
    </>
  );
}
