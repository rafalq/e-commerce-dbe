"use client";

import * as z from "zod";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SchemaProductVariant } from "@/types/schema-product-variant";
import { FormField } from "@/components/ui/form";
import CustomFormField from "@/components/ui/custom-form-field";
import { UploadDropzone } from "@/app/api/uploadthing/_components";

export default function CustomInputImages() {
  const { getValues, control, setError } =
    useFormContext<z.infer<typeof SchemaProductVariant>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });

  return (
    <FormField
      control={control}
      name="variantImages"
      render={({ field }) => (
        <CustomFormField label="Variant Images">
          <UploadDropzone />
        </CustomFormField>
      )}
    />
  );
}
