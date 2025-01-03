"use client";

import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/custom/submit-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { setToast } from "@/lib/set-toast";
import { addReview } from "@/server/actions/add-review";
import { motion } from "framer-motion";
import { Milestone, Star } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import {
  ReviewsSchema,
  type ReviewsSchemaType,
} from "@/types/schema/reviews-schema";

export default function FormReviews() {
  const [openReview, setOpenReview] = useState(false);

  const params = useSearchParams();
  const productId = Number(params.get("productId"));

  const form = useForm<ReviewsSchemaType>({
    resolver: zodResolver(ReviewsSchema),
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
      setToast(data.data!);
      form.reset();
      if (data.data?.status === "success") {
        setOpenReview(false);
      } else {
        setOpenReview(true);
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: ReviewsSchemaType) {
    execute(parsedInput);
  }

  return (
    <Popover open={openReview} onOpenChange={setOpenReview}>
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
            <TextareaField />

            <StarsField form={form} status={status} />
            {/* ---- submit button ---- */}
            <SubmitButton
              title="send review"
              isLoading={status === "executing"}
            >
              <Milestone className="w-6 h-6" />
            </SubmitButton>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

function TextareaField() {
  return (
    <FormFieldWrapper<ReviewsSchemaType> name="comment" label="Comment">
      {(field) => <Textarea rows={6} {...field} />}
    </FormFieldWrapper>
  );
}

type StarsFieldProps = {
  form: UseFormReturn<
    {
      productId: number;
      rating: number;
      comment: string;
    },
    unknown,
    undefined
  >;
  status: HookActionStatus;
};

function StarsField({ form, status }: StarsFieldProps) {
  return (
    <FormFieldWrapper<ReviewsSchemaType> name="rating" label="Rating">
      {(field) => (
        <>
          <Input type="hidden" disabled={status === "executing"} {...field} />
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
      )}
    </FormFieldWrapper>
  );
}
