"use client";

import { searchClient } from "@/lib/algolia-client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Hits, SearchBox } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

function Hit({
  hit,
}: {
  hit: {
    objectID: string;
    id: string;
    price: number;
    productTitle: string;
    variantTitle: string;
    variantImages: string;

    _highlightResult: {
      productTitle: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
      variantTitle: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
    };
  };
}) {
  // if (
  //   hit._highlightResult.productTitle.matchLevel === "none" &&
  //   hit._highlightResult.variantTitle.matchLevel === "none"
  // ) {
  //   return null;
  // }
  return (
    <div className="hover:bg-secondary mb-2 p-4">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productId=${hit.id}&price=${hit.price}&title=${hit.productTitle}&variant=${hit.variantTitle}&image=${hit.variantImages[0]}`}
      >
        <div className="flex justify-between items-center gap-12 w-full">
          <Image
            src={hit.variantImages[0]}
            alt={hit.variantTitle}
            width={60}
            height={60}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productTitle.value,
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.variantTitle.value,
            }}
          />
          <p className="font-medium">${hit.price}</p>
        </div>
      </Link>
    </div>
  );
}

export default function Algolia() {
  const [active, setActive] = useState(false);

  const MCard = useMemo(() => motion.create(Card), []);
  return (
    <InstantSearchNext
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
      indexName="products"
      searchClient={searchClient}
    >
      <div className="relative">
        <SearchBox
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setActive(false);
            }
          }}
          onFocus={() => setActive(true)}
          onBlur={() => {
            setTimeout(() => {
              setActive(false);
            }, 100);
          }}
          placeholder="Search for our amazing products..."
          classNames={{
            form: "relative mb-4",
            input:
              "h-full w-full rounded-md border border-primary/50 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden",
            resetIcon: "hidden",
          }}
        />
        {!active && (
          <Search className="top-1.5 right-2 absolute w-5 h-5 text-primary/80" />
        )}
        <AnimatePresence>
          {active && (
            <MCard
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="z-50 absolute bg-secondary p-2 w-full h-96 scrollbarY"
            >
              <Hits hitComponent={Hit} className="rounded-md" />
            </MCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  );
}
