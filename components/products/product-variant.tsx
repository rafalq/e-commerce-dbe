"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import type { VariantsWithImagesTags } from "@/lib/infer-types";

export default function ProductVariant({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const searchParams = useSearchParams();
  const selectedVariant = searchParams.get("variant") || variants[0].title;

  return variants.map((variant) => {
    if (variant.title === selectedVariant) {
      return (
        <motion.div
          key={variant.id}
          animate={{ y: 0, opacity: 1 }}
          initial={{ opacity: 0, y: 6 }}
          className="mt-1 font-medium text-lg text-secondary-foreground"
        >
          {selectedVariant}
        </motion.div>
      );
    }
  });
}
