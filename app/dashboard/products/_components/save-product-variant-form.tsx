"use client";

import {
  useFieldArray,
  useForm,
  useFormContext,
  type FieldError,
  type UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setToast } from "@/lib/set-toast";
import { cn } from "@/lib/utils";
import { saveProductVariant } from "@/server/actions/save-product-variant";
import { UploadDropzone } from "@/app/api/uploadthing/_components";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import TextField from "@/components/form/text-field";
import Loader from "@/components/ui/custom/loader";
import { OptionsCombox } from "@/components/ui/custom/options-combox";
import SubmitButton from "@/components/ui/custom/submit-button";
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
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import truncateText from "@/lib/truncate-text";
import { deleteProductVariant } from "@/server/actions/delete-product-variant";
import { getTypeWithValues } from "@/server/actions/get-type-with-values";
import { ProductVariantSchema } from "@/types/schema/product-variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reorder } from "framer-motion";
import { isEmpty } from "lodash";
import isEqual from "lodash/isEqual";
import { FilePenLine, PackagePlus, Trash, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import VariantTagsInput from "./variant-tags-input";

import type { ProductVariantSchemaType } from "@/types/schema/product-variant-schema";
import type { VariantsWithImagesTags } from "@/lib/infer-types";

type FormSaveProductVariantProps = {
  editMode: boolean;
  variant?: VariantsWithImagesTags;
  productId?: number;
  onDialogClose(): void;
};

export default function SaveProductVariantForm({
  editMode,
  variant,
  productId,
  onDialogClose,
}: FormSaveProductVariantProps) {
  const [open, setOpen] = useState(false);
  const [dbTypes, setDbTypes] = useState<Record<string, string[]> | null>(null);
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
          if (response.status.includes("success") && response.payload) {
            setDbTypes(response.payload as Record<string, string[]>);
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

  const form = useForm<ProductVariantSchemaType>({
    resolver: zodResolver(ProductVariantSchema),
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
      setToast(data.data!);
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

  function onSubmit(parsedInput: ProductVariantSchemaType) {
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
      setToast(data.data!);
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
        <TextField<ProductVariantSchemaType>
          name="title"
          label="Title"
          status={status}
        />

        {/* ---- variant type input ---- */}

        <TypeOptionsField
          error={form.formState.errors.type!}
          options={dbTypes || {}}
          form={form}
          setSelectedType={setSelectedType}
          variant={variant}
        />

        {/* ---- variant value input ---- */}

        <ValueOptionsField
          error={form.formState.errors.type!}
          options={selectedTypeValues || []}
          form={form}
          variant={variant}
          editMode={editMode}
          selectedType={selectedType}
          handleValueChange={handleValueChange}
        />

        {/* ---- variant tags input ---- */}

        <VariantTagsField />

        {/* ---- variant images input ---- */}

        <VariantImagesFieldAndTable />

        <div className="pt-6">
          {/* ---- submit button ---- */}

          {!editMode && (
            <SubmitButton
              isLoading={status === "executing"}
              title="create variant"
            >
              <PackagePlus className="w-4 h-4" />
            </SubmitButton>
          )}

          {/* ---- delete button ---- */}

          {editMode && variant && (
            <div className="flex justify-end items-center gap-4">
              <SubmitButton isLoading={status === "executing"} title="update">
                <FilePenLine className="w-4 h-4" />
              </SubmitButton>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={status === "executing"}
                    className="w-full"
                  >
                    {status === "executing" ? (
                      <Loader size={8} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg uppercase tracking-wide">
                          delete
                        </span>
                        <Trash2 className="w-4 h-4" />
                      </div>
                    )}
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

type TypeOptionsFieldProps = {
  options: Record<string, string[]>;
  error: FieldError;
  form: UseFormReturn<ProductVariantSchemaType>;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  variant?: { type: string };
};

function TypeOptionsField({
  options,
  error,
  form,
  setSelectedType,
  variant,
}: TypeOptionsFieldProps) {
  return (
    <FormFieldWrapper<ProductVariantSchemaType>
      name="type"
      label="Variant Type"
    >
      {(field) => (
        <OptionsCombox
          type="selective"
          options={options || {}}
          value={field.value as string}
          error={error}
          onSelect={(selectedValue) => {
            field.onChange(selectedValue);
            setSelectedType(selectedValue);
          }}
        >
          <Input
            {...field}
            value={field.value as string}
            onChange={(e) => {
              field.onChange(e.target.value);
              form.setValue("value", "");
            }}
            onBlur={(e) => {
              if (e.target.value.trim().length <= 0) {
                const defaultValue = variant?.type || "";
                form.setValue("type", defaultValue); // Reset form value
                setSelectedType(defaultValue); // Reset local state
              } else {
                setSelectedType(e.target.value); // Update local state
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur(); // Unfocus the input
              }
            }}
          />
        </OptionsCombox>
      )}
    </FormFieldWrapper>
  );
}

type ValueOptionsFieldProps = {
  options: string[];
  error: FieldError;
  form: UseFormReturn<ProductVariantSchemaType>;
  variant?: { value: string };
  editMode?: boolean;
  selectedType: string;
  handleValueChange?: (value: string) => void;
};

function ValueOptionsField({
  options,
  error,
  form,
  variant,
  editMode,
  selectedType,
  handleValueChange,
}: ValueOptionsFieldProps) {
  return (
    <FormFieldWrapper<ProductVariantSchemaType>
      name="value"
      label="Variant Value"
      description="To enable the input, enter the Variant Type first"
    >
      {(field) => (
        <OptionsCombox
          type="readonly"
          options={options}
          value={field.value as string}
          error={error}
        >
          <Input
            {...field}
            value={field.value as string}
            onChange={(e) => {
              const newValue = e.target.value;
              field.onChange(newValue);
              handleValueChange?.(newValue);
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              handleValueChange?.(newValue);
              if (editMode && newValue.trim().length <= 0) {
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
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            disabled={selectedType.trim().length <= 0}
          />
        </OptionsCombox>
      )}
    </FormFieldWrapper>
  );
}

function VariantTagsField() {
  return (
    <FormFieldWrapper<ProductVariantSchemaType>
      name="tags"
      label="Variant Tags"
    >
      {(field) => (
        <VariantTagsInput
          {...field}
          value={field.value as string[]}
          onChange={(e) => field.onChange(e)}
        />
      )}
    </FormFieldWrapper>
  );
}

function VariantImagesFieldAndTable() {
  const [active, setActive] = useState(0);

  const {
    control,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useFormContext<ProductVariantSchemaType>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });

  const error = errors.variantImages;

  return (
    <div className="flex flex-col">
      <FormFieldWrapper<ProductVariantSchemaType>
        name="variantImages"
        label="Variant Images"
      >
        {() => (
          <UploadDropzone
            className={cn(
              "border-primary/30 hover:bg-primary/10 ut-button:bg-primary/75 ut-button:ut-readying:bg-primary/50 text-primary/50 ut-allowed-content:text-secondary-foreground ut-label-icon:text-primary/50 ut-label:text-primary transition-all cursor-pointer duration-500 ease-in-out",
              error &&
                "bg-destructive/20 ring-destructive/50 border-destructive/40 ut-upload-icon:text-destructive-foreground hover:bg-destructive/30"
            )}
            onBeforeUploadBegin={(files) => {
              clearErrors("variantImages");

              files.map((file) =>
                append({
                  name: file.name,
                  size: file.size,
                  url: URL.createObjectURL(file),
                })
              );

              return files;
            }}
            onUploadError={(error) => {
              setError("variantImages", {
                type: "validate",
                message: error.message,
              });
              return;
            }}
            onClientUploadComplete={(files) => {
              const images = getValues("variantImages");
              images.map((field, imgIDX) => {
                if (field.url.search("blob:") === 0) {
                  const image = files.find((img) => img.name === field.name);
                  if (image) {
                    update(imgIDX, {
                      url: image.url,
                      name: image.name,
                      size: image.size,
                      key: image.key,
                    });
                    URL.revokeObjectURL(field.url);
                  }
                }
              });

              return;
            }}
            config={{ mode: "auto" }}
            endpoint="variantUploader"
          />
        )}
      </FormFieldWrapper>

      {fields.length > 0 && (
        <div className="flex items-center">
          <Table className="mt-4">
            <TableHeader className="bg-primary/10">
              <TableRow className="text-xs">
                <TableHead className="font-semibold text-center">
                  Order
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Size
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Image
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <Reorder.Group
              as="tbody"
              values={fields}
              onReorder={(e) => {
                const activeElement = fields[active];
                e.map((item, index) => {
                  if (item === activeElement) {
                    move(active, index);
                    setActive(index);
                    return;
                  }
                  return;
                });
              }}
            >
              {fields.map((field, index) => {
                return (
                  <Reorder.Item
                    as="tr"
                    key={field.id}
                    value={field}
                    id={field.id}
                    onDragStart={() => setActive(index)}
                    className={cn(
                      field.url.search("blob:") === 0
                        ? "animate-pulse transition-all"
                        : "",
                      "text-xs text-muted-foreground hover:text-primary hover:bg-secondary p-1"
                    )}
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {truncateText(field.name, 10)}
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{field.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      {(field.size / (1024 * 1024)).toFixed(2)} MB
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Image
                          src={field.url}
                          alt={field.name}
                          className="rounded-md"
                          width={72}
                          height={48}
                          style={{ height: "auto", width: "auto" }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"ghost"}
                              onClick={(e) => {
                                e.preventDefault();
                                remove(index);
                              }}
                              className="hover:bg-destructive/30 scale-75"
                            >
                              <Trash className="h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete image</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </Table>
        </div>
      )}
    </div>
  );
}
