"use client";

import { motion } from "framer-motion";

import type { TypeReviewsWithUser } from "@/types/type-review-with-user";
import ReviewDetails from "./review-details";

export default function ReviewList({
  reviews,
}: {
  reviews: TypeReviewsWithUser[];
}) {
  return (
    <motion.div className="gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-2">
      {reviews.map((review) => (
        <ReviewDetails key={review.id} review={review} />
      ))}
    </motion.div>
  );
}
