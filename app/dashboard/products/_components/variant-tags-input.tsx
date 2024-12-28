"use client";

import { forwardRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useFormField } from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { Dispatch, SetStateAction } from "react";

type VariantTagsInputProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

const VariantTagsInput = forwardRef<HTMLInputElement, VariantTagsInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const { error } = useFormField();

    const { setFocus } = useFormContext();

    function addPendingDataPoint() {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...(value || []), pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }

    return (
      <div
        onClick={() => setFocus("tags")}
        className={cn(
          "flex outline-none ring-ring border-input file:border-0 bg-background file:bg-transparent disabled:opacity-50 p-2 border rounded-md focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-1 w-full min-h-[40px] file:font-medium text-sm file:text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed ",
          isFocused ? "ring-offset-2 ring-2" : "ring-offset-0 ring-0",
          isFocused && error && "ring-destructive/50",
          error && "bg-destructive/10 border-destructive/40"
        )}
      >
        <motion.div className="flex flex-wrap items-center gap-2 rounded-md min-h-[2.5rem]">
          <AnimatePresence>
            {value?.map((tag) => (
              <motion.div
                key={tag}
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
              >
                <Badge variant={"secondary"}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((i) => i !== tag))}
                    className="ml-1 w-3"
                  >
                    <XIcon className="w-3 text-destructive" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex">
            <Input
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlurCapture={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPendingDataPoint();
                } else if (
                  e.key === "Backspace" &&
                  !pendingDataPoint &&
                  value?.length > 0
                ) {
                  e.preventDefault();
                  const newValue = [...value];
                  newValue.pop();
                  onChange(newValue);
                }
              }}
              value={pendingDataPoint}
              ref={ref}
              className="border-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              {...props}
            />
          </div>
        </motion.div>
      </div>
    );
  }
);

VariantTagsInput.displayName = "VariantTagsInput";

export default VariantTagsInput;
