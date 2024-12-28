"use client";

import FormFieldWrapper from "@/components/form/form-field-wrapper";
import TextField from "@/components/form/text-field";
import FormCard from "@/components/ui/custom/form-card";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/ui/tiptap";
import { setToast } from "@/lib/set-toast";
import { getProduct } from "@/server/actions/get-product";
import { saveProduct } from "@/server/actions/save-product";
import type { ApiResponseType } from "@/types/api-response-type";
import { ProductSchema, type ProductSchemaType } from "@/types/product-schema";
import { type TypeSchemaProduct } from "@/types/schema-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { DollarSign, PackagePlus } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TiptapRef = {
  clearContent: () => void;
};

export default function FormSaveProduct() {
  const tiptapRef = useRef<TiptapRef | null>(null);

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "all",
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

      if (status === "error") {
        toast.error(message);
        router.push("/dashboard/products");
        return;
      } else if (status === "success" && product) {
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
      toast.loading("Processing...");
    },
    onSuccess(data) {
      toast.dismiss();

      setToast(data?.data as ApiResponseType);

      if (data.data?.status === "success") router.push("/dashboard/products");
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: TypeSchemaProduct) {
    if (editMode) {
      const currentData = form.control._defaultValues;
      const newData = form.getValues();

      if (!isEqual(currentData, newData)) {
        toast.warning("No changes detected");
        return;
      }
    }

    execute(parsedInput);
  }

  return (
    <FormCard
      cardTitle={editMode ? "Update Product" : "Create Product"}
      cardDescription={
        (editMode &&
          'To exit "Edit Mode" and enter "Create Mode" click "Save " icon from above.') ||
        ""
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---- title input ---- */}
          <TextField<ProductSchemaType>
            name="title"
            label="Product Title"
            description="This is a product public display name"
            status={status}
          />
          {/* ---- description input ---- */}
          <DescriptionField tiptapRef={tiptapRef} />
          {/* ---- price input ---- */}

          <PriceField form={form} status={status} />

          {/* ---- submit button ---- */}
          <div className="mt-8">
            <SubmitButton
              isLoading={status === "executing"}
              title="create product"
            >
              <PackagePlus className="w-4 h-4" />
            </SubmitButton>
          </div>
        </form>
      </Form>
    </FormCard>
  );
}

type DescriptionFieldProps = {
  tiptapRef: MutableRefObject<TiptapRef | null>;
};

function DescriptionField({ tiptapRef }: DescriptionFieldProps) {
  return (
    <FormFieldWrapper<ProductSchemaType>
      name="description"
      label="Product Description"
      description="Use the option buttons below to format your description text."
    >
      {(field) => <Tiptap ref={tiptapRef} val={field.value as string} />}
    </FormFieldWrapper>
  );
}

function PriceField({
  form,
  status,
}: {
  form: ReturnType<typeof useForm<ProductSchemaType>>;
  status: HookActionStatus;
}) {
  const [priceInCents, setPriceInCents] = useState<number>(
    form.watch("price") || 0
  );

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.price !== undefined) {
        setPriceInCents(value.price);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <FormFieldWrapper<ProductSchemaType>
      name="price"
      label="Price in cents"
      description={
        <span className="flex items-center gap-0.5">
          <DollarSign className="w-3 h-3" />
          {priceInCents / 100 || 0}
        </span>
      }
    >
      {(field) => (
        <Input
          {...field}
          onChange={(e) => {
            const inputValue = Number(e.target.value);
            if (!isNaN(inputValue)) {
              setPriceInCents(inputValue);
              field.onChange(e);
            }
          }}
          disabled={status === "executing"}
          type="number"
          min={0}
          step={1}
          className="max-w-32"
        />
      )}
    </FormFieldWrapper>
  );
}
