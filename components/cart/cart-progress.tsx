"use client";
import { motion } from "framer-motion";
import { useCartStore } from "@/store";
import { Check, CreditCard, ShoppingCart } from "lucide-react";

export default function CartProgress() {
  const { checkoutProgress } = useCartStore();
  return (
    <div className="flex justify-center items-center pb-6">
      <div className="relative bg-muted rounded-md w-64 h-1">
        <div className="top-0 left-0 absolute flex justify-between items-center w-full h-full">
          <motion.span
            className="top-0 left-0 z-30 absolute border-primary-foreground bg-primary border h-full ease-in-out"
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page"
                  ? 0
                  : checkoutProgress === "payment-page"
                  ? "50%"
                  : "100%",
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="z-50 border-2 border-primary bg-primary-foreground p-2 rounded-full"
          >
            <ShoppingCart className="text-primary" size={16} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress === "payment-page"
                  ? 1
                  : 0 || checkoutProgress === "confirmation-page"
                  ? 1
                  : 0,
            }}
            transition={{ delay: 0.5 }}
            className="z-50 border-2 border-primary bg-primary-foreground p-2 rounded-full"
          >
            <CreditCard className="text-primary" size={16} />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "confirmation-page" ? 1 : 0,
            }}
            transition={{ delay: 0.5 }}
            className="z-50 border-2 border-primary bg-primary-foreground p-2 rounded-full"
          >
            <Check className="text-primary" size={16} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
