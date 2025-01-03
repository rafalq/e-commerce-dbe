"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/loader";
import { createOrder } from "@/server/actions/create-order";
import {
  createPaymentIntent,
  type TypePaymentIntentSuccessData,
} from "@/server/actions/create-payment-intent";
import { useCartStore } from "@/store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/format-price";
import type { ApiResponseType } from "@/types/api-response-type";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  const { cart, setCheckoutProgress, clearCart, setCartOpen } = useCartStore();

  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const { execute } = useAction(createOrder, {
    onExecute() {
      toast.loading("Creating order...");
    },
    onSuccess(data) {
      toast.dismiss();

      setIsLoading(false);

      if (data.data?.status.includes("error")) {
        toast.error(data.data.message || "Something went wrong.");
      } else if (data.data?.status.includes("success")) {
        setIsLoading(false);
        toast.success(data.data.message || "Operation done successfully!");
        setCheckoutProgress("confirmation-page");
        clearCart();
      } else if (data.data?.status.includes("warning")) {
        toast.warning(data.data.message || "Operation suspended.");
      }
    },
    onError() {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }
    const dataPaymentIntent = await createPaymentIntent({
      amount: totalPrice,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productId: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });

    if (dataPaymentIntent?.data?.status.includes("error")) {
      setErrorMessage(dataPaymentIntent.data.message as string);
      setIsLoading(false);
      router.push("/auth/sign-in");
      setCartOpen(false);
      return;
    }

    if (dataPaymentIntent?.data?.status.includes("success")) {
      const { clientSecretId, user, paymentIntentId } = (
        dataPaymentIntent?.data as ApiResponseType
      ).payload as TypePaymentIntentSuccessData;

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecretId as string,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: user as string,
        },
      });

      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);

        execute({
          status: "pending",
          paymentIntentId: paymentIntentId,
          total: totalPrice,
          products: cart.map((item) => ({
            productId: item.id,
            variantId: item.variant.variantId,
            quantity: item.variant.quantity,
          })),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        size="lg"
        disabled={!stripe || !elements || isLoading}
        className="my-4"
      >
        {isLoading ? (
          <Loader size={6} text="Processing..." />
        ) : (
          <span className="flex justify-center items-center gap-2 text-xl uppercase tracking-wide">
            PAY
            <span>{formatPrice(totalPrice)}</span>
          </span>
        )}
      </Button>
    </form>
  );
}
