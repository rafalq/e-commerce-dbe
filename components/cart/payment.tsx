"use client";

import { useCartStore, type CartItem } from "@/store";
import getStripe from "@/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import PaymentForm from "@/components/cart/payment-form";

const stripe = getStripe();

export default function Payment() {
  const cart = useCartStore((state) => state.cart);
  const { theme } = useTheme();

  const totalPrice = cart.reduce((acc, item: CartItem) => {
    return acc + item.price * item.variant.quantity;
  }, 0);

  return (
    <motion.div className="mx-auto max-w-2xl">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice,
          appearance: { theme: theme === "dark" ? "night" : "flat" },
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
