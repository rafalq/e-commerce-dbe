"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ProductTags({
  variantTags,
}: {
  variantTags: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 my-4">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-primary-foreground text-primary border border-primary hover:bg-secondary transition-all duration-300 ease-in-out",
          !tag && "bg-primary/95 text-primary-foreground hover:bg-primary/100"
        )}
      >
        All
      </Badge>
      {variantTags.map((vTag) => (
        <Badge
          key={vTag}
          onClick={() => setFilter(vTag)}
          className={cn(
            "cursor-pointer bg-primary-foreground text-primary border border-primary hover:bg-secondary transition-all duration-300 ease-in-out",
            tag === vTag &&
              tag &&
              "bg-primary/95 text-primary-foreground hover:bg-primary/100"
          )}
          //   style={{ backgroundColor: createRandomColor() }}
        >
          {vTag}
        </Badge>
      ))}

      {/* <Badge
        onClick={() => setFilter("green")}
        className={cn(
          "cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100",
          tag === "green" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Green
      </Badge>
      <Badge
        onClick={() => setFilter("purple")}
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100",
          tag === "purple" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Purple
      </Badge> */}
    </div>
  );
}
