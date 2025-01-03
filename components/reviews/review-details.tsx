"use client";

import Image from "next/image";

import { formatDistance, subDays } from "date-fns";

import Stars from "@/components/reviews/stars";

import { Card } from "@/components/ui/card";

import type { ReviewsWithUser } from "@/lib/infer-types";

export default function ReviewDetails({ review }: { review: ReviewsWithUser }) {
  return (
    <Card key={review.id} className="shadow p-8 w-auto h-full">
      <div className="flex items-center gap-2">
        {review.user.image ? (
          <Image
            src={review.user.image}
            alt={review.user.name || "user avatar"}
            height={32}
            width={32}
            className="rounded-full"
          />
        ) : (
          <p className="flex justify-center items-center bg-primary rounded-full w-8 h-8 font-bold text-primary-foreground">
            {review.user.name?.charAt(0).toUpperCase()}
          </p>
        )}

        <div>
          <p className="font-bold">{review.user.name}</p>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />
            <p className="text-bold text-muted-foreground text-xs">
              {formatDistance(subDays(review.created!, 0), new Date())}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-2 py-2 font-medium italic">{review.comment}</p>
    </Card>
  );
}
