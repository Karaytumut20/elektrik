import { Card } from "@/components/ui/Card";

export default function BlogLoading() {
  return (
    <section className="section-band bg-electric-mist">
      <div className="site-container grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <div className="h-4 w-24 rounded-md bg-slate-200" />
            <div className="mt-4 h-6 w-3/4 rounded-md bg-slate-200" />
            <div className="mt-3 h-20 rounded-md bg-slate-200" />
          </Card>
        ))}
      </div>
    </section>
  );
}
