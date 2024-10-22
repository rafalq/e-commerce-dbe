"use client";

import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-form-wrapper";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/ui/tiptap";
import { SchemaProduct } from "@/types/schema-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, PackagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
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

  function onSubmit() {
    // execute(parsedInput);
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
                <Input {...field} />
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
                    placeholder="999.99"
                    className="max-w-32"
                  />
                </div>
              </CustomFormField>
            )}
          />
          {/* ---- submit button ---- */}
          <div className="block sm:flex sm:flex-row-reverse">
            <Button type="submit" className="mt-6">
              <div className="flex items-center gap-2">
                <p className="font-semibold uppercase">submit</p>
                <PackagePlus className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}
