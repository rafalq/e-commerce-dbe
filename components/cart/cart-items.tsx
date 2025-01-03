"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format-price";
import emptyCart from "@/public/empty-cart-animation.json";
import { useCartStore } from "@/store";
import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowBigRight, MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "../ui/button";

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    const totalPriceStr = (totalPrice / 100).toFixed(2).toString();

    return [...totalPriceStr].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length > 0 && (
        <div className="flex flex-col items-center gap-6 mb-6 w-full">
          <motion.div className="relative flex items-center overflow-hidden">
            Total: <span className="ml-1 text-xl">$</span>
            <AnimatePresence mode="popLayout">
              {priceInLetters.map((letter, i) => (
                <motion.div key={letter.id}>
                  <motion.span
                    initial={{ y: 22 }}
                    animate={{ y: 0 }}
                    exit={{ y: -22 }}
                    transition={{ delay: i * 0.1 }}
                    className="inline-block font-semibold text-xl"
                  >
                    {letter.letter}
                  </motion.span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Button
            onClick={() => {
              setCheckoutProgress("payment-page");
            }}
            disabled={cart.length === 0}
            className="flex gap-2 w-1/3 text-lg tracking-wide"
          >
            Go to Checkout
            <ArrowBigRight className="w-6 h-6" />
          </Button>
        </div>
      )}
      {cart.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-center text-muted-foreground">
              Your cart is empty!
            </h2>
            <Lottie className="h-56" animationData={emptyCart} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="h-80 scrollbarY">
          <Table className="mx-auto max-w-2xl">
            <TableHeader>
              <TableRow className="hover:bg-muted/0">
                <TableCell className="text-muted-foreground">Product</TableCell>
                <TableCell className="text-muted-foreground">Price</TableCell>
                <TableCell className="text-muted-foreground">Image</TableCell>
                <TableCell className="text-muted-foreground">
                  Quantity
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={(item.id + item.variant.variantId).toString()}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-between items-center">
                      <MinusCircle
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                        className="hover:text-muted-foreground transition-colors duration-300 cursor-pointer"
                        size={14}
                      />
                      <p className="font-bold text-md">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="hover:text-muted-foreground transition-colors duration-300 cursor-pointer"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
