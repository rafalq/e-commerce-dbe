import ReviewChart from "@/components/reviews/review-chart";
import ReviewList from "@/components/reviews/review-list";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { reviews } from "@/server/schema";
import { eq } from "drizzle-orm";
import FormReviews from "@/components/reviews/form-reviews";
import ReviewDetails from "@/components/reviews/review-details";

import type { ReviewsWithUser } from "@/lib/infer-types";

export default async function Reviews({ productId }: { productId: number }) {
  const session = await auth();

  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productId, productId),
  });

  const dataOmitLast = (data: ReviewsWithUser[]) => {
    if (!data || data.length === 0 || data.length === 1) {
      return [];
    }
    const filtered = data.filter((_, index) => {
      return data[index] !== data[data.length - 1];
    });

    return filtered;
  };

  const dataWithoutLast = dataOmitLast(data);
  const dataOnlyLast: ReviewsWithUser = data[data.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex flex-col gap-4 md:w-3/5 h-full">
          <h3 className="w-full font-semibold text-3xl">Customers Reviews</h3>
          {data.length > 0 && <ReviewChart reviews={data} />}
        </div>
        <div className="flex flex-col gap-4 md:w-2/5 h-full">
          {session && <FormReviews />}
          {data.length > 0 && (
            <div className="h-[266px]">
              <ReviewDetails review={dataOnlyLast} />
            </div>
          )}
        </div>
      </div>
      {data.length > 0 ? (
        <div className="py-4 w-full">
          <ReviewList reviews={dataWithoutLast} />
        </div>
      ) : (
        <p className="p-10 text-center text-medium text-primary">
          No reviews yet...
        </p>
      )}
    </div>
  );
}
