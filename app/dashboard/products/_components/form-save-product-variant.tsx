"use client";

import { useForm, type FieldError } from "react-hook-form";

import CustomInputVariantImages from "@/app/dashboard/products/_components/custom-input-variant-images";
import CustomInputVariantTags from "@/app/dashboard/products/_components/custom-input-variant-tags";
import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/ui/custom-form-field";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setToast } from "@/lib/set-toast";
import { cn } from "@/lib/utils";
import { saveProductVariant } from "@/server/actions/save-product-variant";
import {
  SchemaProductVariant,
  type TypeSchemaProductVariant,
} from "@/types/schema-product-variant";

import { ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import truncateText from "@/lib/truncate-text";
import { deleteProductVariant } from "@/server/actions/delete-product-variant";
import { getTypeWithValues } from "@/server/actions/get-type-with-values";
import { zodResolver } from "@hookform/resolvers/zod";
import isEqual from "lodash/isEqual";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { TypeApiResponse } from "@/types/type-api-response";
import type { VariantTypesWithValues } from "@/app/dashboard/products/_types/variant-types-with-values";
import { isEmpty } from "lodash";

type FormSaveProductVariantProps = {
  editMode: boolean;
  variant?: VariantsWithImagesTags;
  productId?: number;
  onDialogClose(): void;
};

export default function FormSaveProductVariant({
  editMode,
  variant,
  productId,
  onDialogClose,
}: FormSaveProductVariantProps) {
  const [open, setOpen] = useState(false);
  const [dbTypes, setDbTypes] = useState<VariantTypesWithValues | null>(null);
  const [selectedType, setSelectedType] = useState("");

  let selectedTypeValues: string[];

  if (isEmpty(dbTypes) || dbTypes === null) {
    selectedTypeValues = [];
  } else {
    const valuesSet = new Set(dbTypes[selectedType]);
    selectedTypeValues = Array.from(valuesSet).filter(
      (val) => val !== variant?.value
    );
  }

  useEffect(() => {
    async function fetchVariantTypes() {
      try {
        if (productId) {
          const response = await getTypeWithValues(productId);
          if (response.status.includes("success") && response.data) {
            setDbTypes(response.data);
          } else {
            toast.error("Failed to load variant types");
          }
        }
      } catch (error: unknown) {
        toast.error(`An error: ${error} occurred while fetching variant types`);
      }
    }
    fetchVariantTypes();
  }, [productId]);

  const form = useForm<TypeSchemaProductVariant>({
    resolver: zodResolver(SchemaProductVariant),
    defaultValues: {
      id: undefined,
      title: "",
      type: "",
      value: "",
      tags: [],
      variantImages: [],
      editMode,
      productId,
    },
  });

  const setEdit = useCallback(() => {
    if (!editMode) {
      form.reset();
      return;
    }

    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("title", variant.title || "");
      form.setValue("type", variant.type);
      form.setValue("value", variant.value);
      form.setValue("productId", variant.productId);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.url,
        }))
      );
      setSelectedType(variant?.type || "");
    }
  }, [editMode, form, variant]);

  useEffect(() => {
    setEdit();
  }, [setEdit]);

  const { execute, status } = useAction(saveProductVariant, {
    onExecute() {
      toast.loading(editMode ? "Updating variant..." : "Creating variant...", {
        duration: 500,
      });
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data?.data as TypeApiResponse);
      if (data?.data?.status.includes("success")) onDialogClose();
    },
  });

  function isVariantChanged() {
    const currentData = variant;
    const newData = form.getValues();

    const normalizeSize = (size: number) => parseFloat(size.toFixed(2));

    const currentVariant = {
      title: currentData?.title,
      type: currentData?.type,
      value: currentData?.value,
    };
    const currentTags = currentData?.variantTags.map((item) => item.tag);
    const currentImages = currentData?.variantImages?.map((image) => ({
      name: image.name,
      size: normalizeSize(image?.size || 0),
      url: image.url,
      order: image.order,
    }));

    const newVariant = {
      title: newData.title,
      type: newData.type,
      value: newData.value,
    };
    const newTags = newData.tags;
    const newImages = newData.variantImages.map((image, index) => ({
      name: image.name,
      size: normalizeSize(image?.size || 0),
      url: image?.url,
      order: index,
    }));

    const hasVariantChanges = !isEqual(currentVariant, newVariant);
    const hasTagsChanges = !isEqual(currentTags, newTags);
    const hasImagesChanges = !isEqual(currentImages, newImages);

    const hasChanges = hasVariantChanges || hasTagsChanges || hasImagesChanges;

    return hasChanges;
  }

  function onSubmit(parsedInput: TypeSchemaProductVariant) {
    if (!isVariantChanged()) {
      toast.warning("No changes detected");
      return;
    }
    execute(parsedInput);
  }

  const handleVariantDelete = useAction(deleteProductVariant, {
    onExecute() {
      toast.loading("Deleting variant...", {
        duration: 500,
      });
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data?.data as TypeApiResponse);
      onDialogClose();
    },
  });

  const handleValueChange = (val: string) => {
    if (selectedTypeValues.includes(val)) {
      form.setError("value", {
        type: "manual",
        message: "Value is taken. Type something else.",
      });
    } else {
      form.clearErrors("value");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <CustomFormField label="Title">
              <Input {...field} disabled={status === "executing"} />
            </CustomFormField>
          )}
        />
        <div className="flex flex-col md:grid md:grid-cols-2 w-full">
          {/* ---- variant type input ---- */}

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <CustomFormField label="Type">
                <OptionsInput
                  dbTypes={dbTypes || {}}
                  error={form.formState.errors.type}
                  value={field.value || ""}
                  onSelect={(value) => {
                    field.onChange(value);
                    setSelectedType(value);
                  }}
                >
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value.trim().length <= 0) {
                        form.setValue("type", variant?.type || "");
                        setSelectedType(variant?.type || "");
                      } else {
                        setSelectedType(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </OptionsInput>
              </CustomFormField>
            )}
          />

          {/* ---- variant value input ---- */}

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <CustomFormField label="Value">
                <ReadonlyOptionsInput
                  options={selectedTypeValues}
                  error={form.formState.errors.value}
                  value={field.value || ""}
                >
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleValueChange(e.target.value);
                    }}
                    onBlur={(e) => {
                      handleValueChange(e.target.value);
                      if (editMode && e.target.value.trim().length <= 0) {
                        form.setValue("value", variant?.value || "");
                      }
                      if (
                        !editMode &&
                        form.formState.errors.value?.message ===
                          "Value is taken. Type something else."
                      ) {
                        form.setValue("value", "");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                </ReadonlyOptionsInput>
              </CustomFormField>
            )}
          />
        </div>

        {/* ---- variant tags input ---- */}

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <CustomFormField label="Tags">
              <CustomInputVariantTags
                {...field}
                onChange={(e) => field.onChange(e)}
              />
            </CustomFormField>
          )}
        />

        {/* ---- variant images input ---- */}

        <CustomInputVariantImages />

        <div className="flex justify-end items-center gap-4 pt-6">
          {/* ---- submit button ---- */}

          <CustomButtonSubmit
            label={(editMode && variant ? "UPDATE" : "CREATE") + " VARIANT"}
            disabled={status === "executing"}
            className={cn(status === "executing" && "animate-pulse")}
          ></CustomButtonSubmit>

          {/* ---- delete button ---- */}

          {editMode && variant && (
            <div className="pt-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={status === "executing"}
                    className={cn(
                      "tracking-wide font-semibold",
                      status === "executing" && "animate-pulse"
                    )}
                  >
                    DELETE VARIANT
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <div className="p-4">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="font-semibold text-2xl">
                        Delete {'"' + variant.title + '"'}?
                      </DialogTitle>
                      <DialogDescription className="text-lg">
                        Are you sure? This action is irreversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex md:flex-row flex-col md:justify-end gap-4 pt-4">
                      <DialogClose asChild>
                        <Button type="button">CANCEL</Button>
                      </DialogClose>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleVariantDelete.execute({
                            id: variant.id,
                            title: variant.title || "",
                          });
                          setOpen(false);
                        }}
                        variant="outline"
                        type="button"
                        className={cn(
                          "tracking-wide font-semibold text-destructive border border-destructive",
                          status === "executing" && "animate-pulse"
                        )}
                      >
                        DELETE VARIANT
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

type OptionsInputProps = {
  dbTypes: VariantTypesWithValues;
  value: string;
  error: FieldError | undefined;
  onSelect(value: string): void;
  children: React.ReactNode;
};

export function OptionsInput({
  dbTypes,
  value,
  error,
  onSelect,
  children,
}: OptionsInputProps) {
  const [open, setOpen] = useState(false);

  const options = Array.from(Object.keys(dbTypes));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="minOutline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between gap-2 w-full md:w-[256px]",
            error && "bg-destructive/10 border-destructive/40"
          )}
        >
          {truncateText(value, 25) || "Available options"}
          <ChevronsUpDown className="opacity-50 w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-full">
        <Command>
          {options.length > 1 && (
            <CommandInput placeholder="Search options..." className="h-9" />
          )}
          <CommandList>
            <CommandGroup>
              {options.map(
                (option) =>
                  value !== option && (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        onSelect(option);
                        setOpen(false);
                      }}
                      className="my-2"
                    >
                      {option}
                    </CommandItem>
                  )
              )}
            </CommandGroup>
            <div className="mt-2 p-2">{children}</div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type ReadonlyOptionsInputProps = {
  options: string[];
  value: string;
  error: FieldError | undefined;
  children?: React.ReactNode;
};

export function ReadonlyOptionsInput({
  options,
  value,
  error,
  children,
}: ReadonlyOptionsInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="minOutline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between gap-2 w-full md:w-[256px]",
            error && "bg-destructive/10 border-destructive/40"
          )}
        >
          {truncateText(value, 25) || "Values for selected type"}
          <ChevronsUpDown className="opacity-50 w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-full">
        <Command>
          {options.length > 1 && (
            <CommandInput placeholder="Search options..." className="h-9" />
          )}
          <CommandList>
            <CommandGroup>
              {options.map(
                (option) =>
                  value !== option && (
                    <CommandItem
                      key={option}
                      value={option}
                      className="my-2"
                      disabled
                    >
                      {option}
                    </CommandItem>
                  )
              )}
            </CommandGroup>
            <div className="mt-2 p-2">{children}</div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
