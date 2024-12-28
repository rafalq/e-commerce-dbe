"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SaveProductVariantForm from "@/app/dashboard/products/_components/save-product-variant-form";

import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import { forwardRef, useState, type PropsWithRef } from "react";

type ProductVariantProps = {
  editMode: boolean;
  children: React.ReactNode;
  variant?: VariantsWithImagesTags;
  productId?: number;
};

const ProductVariant: React.FC<PropsWithRef<ProductVariantProps>> = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ editMode, variant, productId, children }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="md:w-[420px] max-w-screen-sm max-h-[740px] md:max-h-[500px] overflow-x-hidden scrollbarY">
          <div className="p-4">
            <DialogHeader className="pb-6">
              <DialogTitle className="font-semibold text-3xl text-center">
                {editMode ? "Edit" : "Add"} Variant
              </DialogTitle>
              <DialogDescription className="text-center">
                Manage the product variant here
              </DialogDescription>
            </DialogHeader>
            <SaveProductVariantForm
              editMode={editMode}
              variant={variant}
              productId={productId}
              onDialogClose={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ProductVariant.displayName = "ProductVariant";

export default ProductVariant;
