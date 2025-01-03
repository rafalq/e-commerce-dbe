"use client";

import orderPaid from "@/public/order-paid.json";
import { useCartStore } from "@/store";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Telescope } from "lucide-react";

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie animationData={orderPaid} />
      </motion.div>
      <h2 className="font-medium text-2xl">Thank you for your purchase!</h2>
      <Link href={"/dashboard/orders"} className="w-1/3">
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
          className="flex justify-center items-center gap-2 w-full text-lg"
        >
          View your order <Telescope className="w-8 h-8" />
        </Button>
      </Link>
    </div>
  );
}
