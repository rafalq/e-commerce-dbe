"use client";

import CustomFormField from "@/components/ui/custom-form-field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";

import { useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { setToast } from "@/lib/set-toast";
import { addReview } from "@/server/actions/add-review";
import { SchemaReviews, type TypeSchemaReviews } from "@/types/schema-reviews";
import type { TypeApiResponse } from "@/types/type-api-response";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import CustomLoader from "../ui/custom-loader";

export default function FormReviews() {
  const params = useSearchParams();
  const productId = Number(params.get("productId"));

  const form = useForm<TypeSchemaReviews>({
    resolver: zodResolver(SchemaReviews),
    defaultValues: {
      productId,
      rating: 0,
      comment: "",
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(addReview, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data as TypeApiResponse);
      if (data.data?.status && data.data?.status[0] === "success") {
        form.reset();
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: TypeSchemaReviews) {
    execute(parsedInput);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full font-semibold" variant="secondary">
          LEAVE A REVIEW
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-72"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <CustomFormField label="Comment">
                  <Textarea {...field} disabled={status === "executing"} />
                </CustomFormField>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <CustomFormField label="Rating">
                  <>
                    <Input
                      type="hidden"
                      disabled={status === "executing"}
                      {...field}
                    />
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((value) => {
                        return (
                          <motion.div
                            className="relative cursor-pointer"
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.2 }}
                            key={value}
                          >
                            <Star
                              key={value}
                              onClick={() => {
                                form.setValue("rating", value, {
                                  shouldValidate: true,
                                });
                              }}
                              className={cn(
                                "text-primary bg-transparent transition-all duration-300 ease-in-out",
                                form.getValues("rating") >= value
                                  ? "fill-primary"
                                  : "fill-muted",
                                form.formState.errors.rating &&
                                  "fill-destructive/10 text-destructive/50"
                              )}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                </CustomFormField>
              )}
            />
            {/* ---- submit button ---- */}

            <Button
              type="submit"
              disabled={status === "executing"}
              className="mt-4 min-w-full"
            >
              {status === "executing" ? (
                <CustomLoader text="ADDING REVIEW..." />
              ) : (
                "ADD REVIEW"
              )}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
