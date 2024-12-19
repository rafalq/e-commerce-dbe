"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";

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
          "cursor-pointer bg-black hover:bg-black/75 hover:opacity-100",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      {variantTags.map((vTag) => (
        <Badge
          key={vTag}
          onClick={() => setFilter(vTag)}
          className={cn(
            "cursor-pointer bg-primary text-primary-foreground hover:opacity-100",
            tag === vTag && tag ? "opacity-100" : "opacity-50"
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
