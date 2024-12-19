"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type ProductVariantPickProps = {
  id: number;
  variantTitle: string;
  type: string;
  value: string;
  image: string;
  productId: number;
  productTitle: string;
  price: number;
};

export default function ProductPick({
  id,
  variantTitle,
  type,
  value,
  image,
  productId,
  productTitle,
  price,
}: ProductVariantPickProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVariant = searchParams.get("variant") || variantTitle;

  return (
    <div
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productId=${productId}&price=${price}&title=${productTitle}&variant=${variantTitle}&image=${image}`,
          { scroll: false }
        )
      }
      className={cn(
        "w-6 h-6 rounded-full cursor-pointer opacity-50 hover:opacity-75  scale-100 transition-all duration-300 ease-in-out ",
        selectedVariant === variantTitle &&
          "opacity-100 scale-110 shadow-md shadow-primary ",
        ""
      )}
      {...(type === "color" && { style: { background: value } })}
    ></div>
  );
}
