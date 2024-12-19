"use client";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import FormCard from "@/components/ui/custom-card-wrapper";
import CustomFormField from "@/components/ui/custom-form-field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/ui/tiptap";
import { hasChanges } from "@/lib/has-changes";
import { setToast } from "@/lib/set-toast";
import { cn } from "@/lib/utils";
import { getProduct } from "@/server/actions/get-product";
import { saveProduct } from "@/server/actions/save-product";
import { SchemaProduct, type TypeSchemaProduct } from "@/types/schema-product";
import type { TypeApiResponse } from "@/types/type-api-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TiptapRef = {
  clearContent: () => void;
};

export default function FormSaveProduct() {
  const tiptapRef = useRef<TiptapRef | null>(null);
  const form = useForm<TypeSchemaProduct>({
    resolver: zodResolver(SchemaProduct),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();

  // ---- edit mode
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  useEffect(() => {
    if (editMode) {
      findProduct(parseInt(editMode));
    } else {
      form.reset();
      tiptapRef.current?.clearContent();
    }
  }, [editMode]);

  async function findProduct(id: number) {
    if (editMode) {
      const { status, message, data: product } = await getProduct(id);

      if (status[0] === "error") {
        toast.error(message);
        router.push("/dashboard/products");
        return;
      } else if (status[0] === "success" && product) {
        const id = parseInt(editMode);
        form.setValue("title", product.title);
        form.setValue("description", product.description);
        form.setValue("price", product.price);
        form.setValue("id", id);
      }
    }
  }

  const { execute, status } = useAction(saveProduct, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data as TypeApiResponse);
      if (data.data?.status[0] === "success")
        router.push("/dashboard/products");
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: TypeSchemaProduct) {
    const currentData = form.control._defaultValues;
    const newData = form.getValues();

    if (!hasChanges({ currentData, newData })) {
      toast.warning("No changes detected");
      return;
    }

    execute(parsedInput);
  }

  return (
    <FormCard
      title={editMode ? "Update Product" : "Create Product"}
      description={
        editMode
          ? 'To exit "Edit Mode" and enter "Create Mode" click "Save " icon from above.'
          : undefined
      }
    >
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
                <Tiptap ref={tiptapRef} val={field.value} />
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
            label={(editMode ? "UPDATE" : "CREATE") + " PRODUCT"}
            disabled={status === "executing"}
            className={cn(status === "executing" && "animate-pulse")}
          />
        </form>
      </Form>
    </FormCard>
  );
}
