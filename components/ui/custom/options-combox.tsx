import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import truncateText from "@/lib/truncate-text";
import type { FieldError } from "react-hook-form";

type BaseProps = {
  value: string;
  error?: FieldError;
  children?: React.ReactNode;
};

type SelectiveProps = {
  type: "selective";
  options: Record<string, string[]>;
  onSelect: (value: string) => void;
};

type ReadonlyProps = {
  type: "readonly";
  options: string[];
};

type CombinedProps = BaseProps & (SelectiveProps | ReadonlyProps);

export function OptionsCombox(props: CombinedProps) {
  const [open, setOpen] = useState(false);

  const renderedOptions =
    props.type === "selective"
      ? Object.keys(props.options as Record<string, string[]>)
      : (props.options as string[]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between gap-2 w-full",
            props.error && "bg-destructive/10 border-destructive/40"
          )}
        >
          {truncateText(props.value, 30) ||
            (props.type === "selective"
              ? "Available variant types"
              : "Values for selected type")}
          <ChevronsUpDown className="opacity-50 w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-full">
        <Command>
          {renderedOptions.length > 1 && (
            <CommandInput placeholder="Search options..." className="h-9" />
          )}
          <CommandList>
            <CommandGroup>
              {renderedOptions.map((option) =>
                props.type === "selective" ? (
                  props.value !== option && (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => {
                        if (props.onSelect) {
                          props.onSelect(option);
                        }
                        setOpen(false);
                      }}
                      className="my-2"
                    >
                      {option}
                    </CommandItem>
                  )
                ) : (
                  <p key={option} className="my-2 text-primary/50">
                    {option}
                  </p>
                )
              )}
            </CommandGroup>
            <div className="mt-2 p-2">{props.children}</div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
