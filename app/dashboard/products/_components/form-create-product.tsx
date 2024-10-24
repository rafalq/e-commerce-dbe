"use client";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-form-wrapper";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/ui/tiptap";
import { cn } from "@/lib/utils";
import { createProduct } from "@/server/actions/create-product";
import { SchemaProduct } from "@/types/schema-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function FormCreateProduct() {
  const form = useForm<z.infer<typeof SchemaProduct>>({
    resolver: zodResolver(SchemaProduct),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();

  const { execute, status } = useAction(createProduct, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      if (data.data?.status === "error") {
        toast.error(data.data.message || "Something went wrong.");
      } else if (data.data?.status === "success") {
        router.push("/dashboard/products");
        toast.success(data.data.message || "Operation done successfully!");
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: z.infer<typeof SchemaProduct>) {
    execute(parsedInput);
  }

  return (
    <FormCard title="Create Product">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---- title input ---- */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <CustomFormField
                label="Product Title"
                description="This is a public product display name."
              >
                <Input disabled={status === "executing"} {...field} />
              </CustomFormField>
            )}
          />
          {/* ---- description input ---- */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <CustomFormField
                label="Product Description"
                description="Use the option buttons below to format your description text."
              >
                <Tiptap val={field.value} />
              </CustomFormField>
            )}
          />
          {/* ---- price input ---- */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <CustomFormField
                label="Price"
                description="Product price in USD."
              >
                <div className="flex items-center gap-1">
                  <DollarSign size={38} className="bg-muted p-2" />
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="999,99"
                    disabled={status === "executing"}
                    className="max-w-32"
                  />
                </div>
              </CustomFormField>
            )}
          />

          {/* ---- submit button ---- */}
          <CustomButtonSubmit
            disabled={
              status === "executing" ||
              !form.formState.isValid ||
              !form.formState.isDirty
            }
            className={cn(status === "executing" && "animate-pulse")}
          />
        </form>
      </Form>
    </FormCard>
  );
}
