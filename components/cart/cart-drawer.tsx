"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCartStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import CartItems from "@/components/cart/cart-items";
import CartStage from "@/components/cart/cart-stage";
import Payment from "@/components/cart/payment";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderConfirmed from "./order-confirmed";
import CartProgress from "./cart-progress";

export default function CartDrawer() {
  const { cart, cartOpen, checkoutProgress, setCartOpen } = useCartStore();

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger className="ring-0 focus-visible:ring-0 focus:ring-0 active:ring-0 outline-none">
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="-top-1 -right-0.5 absolute flex justify-center items-center bg-primary dark:bg-primary rounded-full w-4 h-4 font-bold text-primary-foreground text-xs"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="outline-none">
                <ShoppingBag />
              </TooltipTrigger>
              <TooltipContent>
                <p>Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DrawerTrigger>
      <DrawerContent className="bottom-0 left-0 fixed py-10 h-[80vh]">
        <CartProgress />

        <AnimatePresence mode="wait">
          {checkoutProgress === "cart-page" && (
            <Slider keyS={checkoutProgress}>
              <DrawerHeader className="mt-6">
                <CartStage
                  cartStage="cart-page"
                  title="Your Cart Items"
                  description="View and edit your bag"
                />
              </DrawerHeader>
              <div className="p-4 h-full">
                <CartItems />
              </div>
            </Slider>
          )}
          {checkoutProgress === "payment-page" && (
            <Slider keyS={checkoutProgress}>
              <DrawerHeader className="mt-6">
                <CartStage
                  cartStage="payment-page"
                  title="Choose A Payment Method"
                />
              </DrawerHeader>
              <div className="p-4 h-full">
                <Payment />
              </div>
            </Slider>
          )}
          {checkoutProgress === "confirmation-page" && (
            <Slider keyS={checkoutProgress}>
              <DrawerHeader className="mt-6">
                <CartStage
                  cartStage="confirmation-page"
                  title="Order Confirmed"
                  description="You will receive an email with your receipt!"
                />
              </DrawerHeader>
              <div className="p-4 h-full">
                <OrderConfirmed />
              </div>
            </Slider>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}

type SliderProps = {
  keyS: string;
  children: React.ReactNode;
};

function Slider({ keyS, children }: SliderProps) {
  const animationVariants = {
    hidden: { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: "0%" },
    exit: { opacity: 0, x: "100%" },
  };

  return (
    <motion.div
      key={keyS}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full h-full scrollbarY"
    >
      {children}
    </motion.div>
  );
}
