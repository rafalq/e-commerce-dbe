"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SchemaProductVariant } from "@/types/schema-product-variant";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "@/components/ui/custom-form-field";
import CustomInputTags from "@/app/dashboard/products/_components/custom-input-tags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import CustomInputImages from "@/app/dashboard/products/_components/custom-input-images";

type FormProductVariantProps = {
  variant?: VariantsWithImagesTags;
  editMode: boolean;
};

export default function FormProductVariant({
  variant,
  editMode,
}: FormProductVariantProps) {
  const form = useForm<z.infer<typeof SchemaProductVariant>>({
    resolver: zodResolver(SchemaProductVariant),
    defaultValues: {
      id: undefined,
      variantTitle: undefined,
      variantType: "color",
      variantValue: "#000000",
      productType: "",
      editMode: false,
      productId: undefined,
    },
    mode: "onChange",
  });

  function onSubmit() {
    console.log("submit");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="variantTitle"
          render={({ field }) => (
            <CustomFormField label="Title">
              <Input {...field} disabled={status === "executing"} />
            </CustomFormField>
          )}
        />
        <div className="flex justify-between">
          {/* ---- variant type input ---- */}
          <FormField
            control={form.control}
            name="variantType"
            render={({ field }) => (
              <CustomFormField label="Type">
                <Input {...field} disabled={status === "executing"} />
              </CustomFormField>
            )}
          />
          {/* ---- variant value input ---- */}
          <FormField
            control={form.control}
            name="variantValue"
            render={({ field }) => (
              <CustomFormField label="Value">
                <Input {...field} disabled={status === "executing"} />
              </CustomFormField>
            )}
          />
        </div>

        {/* ---- variant tags input ---- */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <CustomFormField
              label="Tags"
              description="lorem ipsum and so on..."
            >
              <CustomInputTags {...field} onChange={(e) => field.onChange(e)} />
            </CustomFormField>
          )}
        />

        {/* ---- variant images input ---- */}

        <CustomInputImages />

        <div className="flex justify-end items-center gap-4">
          {/* ---- delete button ---- */}
          {editMode && variant && (
            <Button
              variant="destructive"
              type="button"
              disabled={status === "executing" || !form.formState.isValid}
              className={cn(status === "executing" && "animate-pulse")}
            >
              DELETE
            </Button>
          )}

          {/* ---- submit button ---- */}
          <CustomButtonSubmit
            disabled={status === "executing" || !form.formState.isValid}
            className={cn(status === "executing" && "animate-pulse")}
          />
        </div>
      </form>
    </Form>
  );
}
