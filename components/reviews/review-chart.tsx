"use client";

import { getReviewAverage } from "@/lib/get-review-average";
import { useMemo } from "react";

import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

import type { TypeReviewsWithUser } from "@/types/type-review-with-user";

export default function ReviewChart({
  reviews,
}: {
  reviews: TypeReviewsWithUser[];
}) {
  const getRatingByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach((review) => {
      const starIndex = review.rating - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });

    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);

  const totalRating = getReviewAverage(reviews.map((r) => r.rating));

  return (
    <Card className="flex flex-col gap-4 p-8 rounded-md">
      <div className="flex flex-col gap-2">
        <CardTitle className="flex justify-between w-full">
          <span className="text-primary/80">Product Rating</span>{" "}
          <span className="flex items-center gap-1 text-primary/80">
            {totalRating.toFixed(1)} <Stars size={20} rating={totalRating} />
          </span>
        </CardTitle>
        <div className="flex flex-col gap-3 mt-6">
          {getRatingByStars.toReversed().map((rating, index) => (
            <span
              key={index}
              className="flex justify-between items-center gap-2"
            >
              <span className="flex items-center gap-1 font-medium text-sm">
                {getRatingByStars.length - index}
                <Stars size={14} rating={getRatingByStars.length - index} />
              </span>
              <Progress value={rating} />
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Stars({ size, rating }: { size: number; rating: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "text-primary bg-transparent transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-transparent"
          )}
        />
      ))}
    </span>
  );
}
