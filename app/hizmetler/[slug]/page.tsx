import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqSchema, serviceSchema } from "@/data/schemas";
import { getServiceBySlug, services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { phoneHref, whatsappUrl } from "@/lib/whatsapp";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/hizmetler/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const Icon = service.icon;

  return (
    <>
      <JsonLd data={[serviceSchema(service), faqSchema(service.faqs)]} />
      <section className="bg-white py-10">
        <div className="site-container">
          <Breadcrumbs
            items={[
              { label: "Hizmetler", href: "/hizmetler" },
              { label: service.title, href: `/hizmetler/${service.slug}` },
            ]}
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <Badge>Elektrik hizmeti</Badge>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-950 md:text-5xl">{service.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{service.detailDescription}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/iletisim">Teklif al</ButtonLink>
                <ButtonLink href={phoneHref()} variant="secondary">
                  Hemen ara
                </ButtonLink>
                <ButtonLink href={whatsappUrl(`${service.title} icin bilgi almak istiyorum.`)} variant="ghost">
                  WhatsApp
                </ButtonLink>
              </div>
            </div>
            <Card className="bg-slate-950 text-white">
              <Icon className="h-10 w-10 text-amber-300" />
              <h2 className="mt-4 text-xl font-bold">Bu hizmette odak</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{service.shortDescription}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container grid gap-8 lg:grid-cols-3">
          <Card>
            <h2 className="text-xl font-bold text-slate-950">Yapilan islemler</h2>
            <List items={service.operations} />
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-slate-950">Avantajlar</h2>
            <List items={service.benefits} />
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-slate-950">Calisma sureci</h2>
            <List items={service.process} />
          </Card>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="SSS" title={`${service.title} hakkinda sorular`} description="Isleme baslamadan once en cok merak edilen noktalar." />
          <div className="grid gap-3">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-bold text-slate-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-electric-mist">
        <div className="site-container">
          <SectionHeading eyebrow="Benzer hizmetler" title="Ilgili elektrik hizmetleri" />
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Card key={item.slug}>
                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.shortDescription}</p>
                <Link href={`/hizmetler/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-electric-blue">
                  Incele
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric-blue" />
          {item}
        </li>
      ))}
    </ul>
  );
}
