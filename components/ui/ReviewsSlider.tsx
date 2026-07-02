import { Star } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  return (
    <div className="relative mt-8">
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <article key={`${review.name}-${i}`} className="min-w-[82%] snap-start md:min-w-0">
            <div className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div>
                <div className="mb-4 flex items-center gap-1 text-electric-yellow" aria-label={`${review.rating} yıldız`}>
                  {[...Array(review.rating)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-slate-700">&ldquo;{review.text}&rdquo;</p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs">
                <span className="font-bold text-slate-900">{review.name}</span>
                <span className="text-slate-500">{review.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
