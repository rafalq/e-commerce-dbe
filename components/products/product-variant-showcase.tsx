"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { VariantsWithImagesTags } from "@/lib/infer-types";

export default function ProductVariantShowcase({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);

  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("variant") || variants[0].title;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.title === selectedColor &&
            variant.variantImages.map((img) => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      priority
                      className="rounded-md"
                      width={1280}
                      height={720}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className="flex gap-2 py-2 overflow-clip">
        {variants.map(
          (variant) =>
            variant.title === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      width={72}
                      height={48}
                      style={{ width: "auto", height: "auto" }}
                      src={img.url}
                      alt={img.name}
                      className={cn(
                        "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-85",
                        index === activeThumbnail[0]
                          ? "opacity-100"
                          : "opacity-65"
                      )}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
}
