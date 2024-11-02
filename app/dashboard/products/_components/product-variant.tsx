"use client";

import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import { useState } from "react";

import CustomDialog from "@/components/ui/custom-dialog";

type ProductVariantProps = {
  productId?: number;
  variant?: VariantsWithImagesTags;
  editMode: boolean;
  children: React.ReactNode;
  triggerButtonContent?: React.ReactNode | string;
};

export default function ProductVariant({
  editMode,
  children,
  triggerButtonContent,
}: ProductVariantProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <CustomDialog
        title={editMode ? "Update Variant" : "Create Variant"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {children}
      </CustomDialog>
      <button onClick={() => setIsOpen(true)}>
        {triggerButtonContent ? triggerButtonContent : "Open"}
      </button>
    </div>
  );
}
