"use client";

import { useCartStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";

type CartStageProps = {
  title: string;
} & (
  | { cartStage: "payment-page" }
  | { cartStage: "cart-page"; description: string }
  | { cartStage: "confirmation-page"; description: string }
);

export default function CartStage(props: CartStageProps) {
  const setCheckoutProgress = useCartStore(
    (state) => state.setCheckoutProgress
  );
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <DrawerTitle>{props.title}</DrawerTitle>
      <DrawerDescription>
        {props.cartStage === "payment-page" && (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex justify-center items-center gap-1 hover:text-primary cursor-pointer"
          >
            <ArrowLeft size={14} /> Head Back To Cart
          </span>
        )}

        {props.cartStage === "cart-page" && props.description}
        {props.cartStage === "confirmation-page" && (
          <div className="flex flex-col gap-4 mt-2">
            <span>{props.description}</span>
            <span
              onClick={() => setCheckoutProgress("cart-page")}
              className="flex justify-center items-center gap-1 hover:text-primary cursor-pointer"
            >
              <ArrowLeft size={14} /> Head Back To Cart
            </span>
          </div>
        )}
      </DrawerDescription>
    </div>
  );
}
