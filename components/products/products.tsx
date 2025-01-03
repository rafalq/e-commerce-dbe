"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-price";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { VariantsWithProduct } from "@/lib/infer-types";

type ProductsProps = {
  pVariants: VariantsWithProduct[];
};

function Products({ pVariants }: ProductsProps) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filtered = useMemo(() => {
    if (paramTag && pVariants) {
      return pVariants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }
    return pVariants;
  }, [pVariants, paramTag]);

  return (
    <div className="gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-w-[575px]">
      {filtered.map((pVariant, index) => (
        <Link
          className="py-2"
          key={pVariant.id}
          href={`/products/${pVariant.id}?id=${pVariant.id}&productId=${pVariant.productId}&price=${pVariant.product.price}&title=${pVariant.product.title}&variant=${pVariant.title}&image=${pVariant.variantImages[0].url}`}
        >
          <div className="bg-gray-100">
            {index !== 0 ? (
              <Image
                src={pVariant.variantImages[0].url}
                width={720}
                height={460}
                alt={pVariant.product.title}
                loading="lazy"
                placeholder="blur"
                blurDataURL={pVariant.variantImages[0].url}
                className="w-auto md:max-h-[210px] lg:max-h-[130px]"
              />
            ) : (
              <Image
                src={pVariant.variantImages[0].url}
                width={720}
                height={460}
                alt={pVariant.product.title}
                priority
                placeholder="blur"
                blurDataURL={pVariant.variantImages[0].url}
                className="w-auto md:max-h-[210px] lg:max-h-[130px]"
              />
            )}
          </div>
          <div className="flex justify-between gap-2 pt-2">
            <div>
              <h2 className="font-semibold">{pVariant.product.title}</h2>
              <p className="text-muted-foreground text-xs">{pVariant.title}</p>
            </div>
            <div>
              <Badge className="text-xs">
                {formatPrice(pVariant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Products;
