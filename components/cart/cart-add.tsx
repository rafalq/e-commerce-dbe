"use client";

import { useCartStore } from "@/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CartAdd() {
  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productId = Number(params.get("productId"));
  const title = params.get("title");
  const variant = params.get("variant");
  const price = Number(params.get("price"));
  const image = params.get("image");

  if (!id || !productId || !title || !variant || !price || !image) {
    toast.error("Product not found");
    return redirect("/");
  }
  return (
    <>
      <div className="flex justify-stretch items-center gap-4 my-4">
        <Button
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
          variant="secondary"
          className="text-primary"
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex-1 lg:bg-secondary py-2 text-center cursor-help">
                <span className="font-semibold text-xl">{quantity}</span>
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quantity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
          variant="secondary"
          className="text-primary"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added "${title + " " + variant}" to your cart!`);
          addToCart({
            id: productId,
            variant: { variantId: id, quantity },
            name: title + " " + variant,
            price,
            image,
          });
        }}
        className="flex justify-center items-center gap-2"
      >
        ADD TO CART <ShoppingBag className="w-4 h-4" />
      </Button>
    </>
  );
}
