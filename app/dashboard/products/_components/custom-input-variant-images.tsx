"use client";

import { Reorder } from "framer-motion";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { UploadDropzone } from "@/app/api/uploadthing/_components";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/ui/custom-form-field";
import { FormField } from "@/components/ui/form";
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
import { cn } from "@/lib/utils";
import { type TypeSchemaProductVariant } from "@/types/schema-product-variant";

export default function CustomInputVariantImages() {
  const [active, setActive] = useState(0);

  const {
    getValues,
    control,
    setError,
    formState: { errors },
    clearErrors,
  } = useFormContext<TypeSchemaProductVariant>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });

  const error = errors.variantImages;

  return (
    <div className="flex flex-col w-full">
      <FormField
        control={control}
        name="variantImages"
        render={() => (
          <CustomFormField label="Variant Images">
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
          </CustomFormField>
        )}
      />
      {fields.length > 0 && (
        <div className="flex items-center w-full scrollbarX">
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
