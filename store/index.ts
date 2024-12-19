import { create } from "zustand";
import { persist } from "zustand/middleware";

type CheckoutProgress = "cart-page" | "payment-page" | "confirmation-page";

export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  cartOpen: boolean;
  checkoutProgress: CheckoutProgress;

  setCheckoutProgress: (val: CheckoutProgress) => void;

  addToCart: (item: CartItem) => void;

  removeFromCart: (item: CartItem) => void;

  clearCart: () => void;

  setCartOpen: (val: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      checkoutProgress: "cart-page",

      setCartOpen: (val) => set({ cartOpen: val }),

      clearCart: () => set({ cart: [] }),

      setCheckoutProgress: (val) => set(() => ({ checkoutProgress: val })),

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantId === item.variant.variantId
          );

          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantId === item.variant.variantId) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });

            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantId: item.variant.variantId,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            };
          }
        }),

      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantId === item.variant.variantId) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          };
        }),
    }),
    { name: "cart-storage" }
  )
);
