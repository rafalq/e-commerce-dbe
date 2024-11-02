import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

type CustomDialogProps = {
  title: string;
  children?: React.ReactNode;
  cancelButtonTitle?: string;
  confirmButtonTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function CustomDialog({
  title,
  children,
  cancelButtonTitle,
  confirmButtonTitle,
  isOpen,
  onClose,
  onCancel,
  onConfirm,
}: CustomDialogProps) {
  return (
    <div
      onClick={onClose}
      className={cn(
        "z-40 fixed grid place-items-center inset-0 bg-black bg-opacity-60 backdrop-blur-sm w-screen h-screen transition-opacity duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative max-h-[480px] bg-primary-foreground shadow-2xl rounded-lg w-2/5 font-light antialiased leading-relaxed transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 p-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full h-full [&::-webkit-scrollbar]:w-2 overflow-y-auto",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-28 scale-0 pointer-events-none"
        )}
      >
        <div className="relative">
          <h1 className="p-4 font-semibold text-2xl text-primary antialiased leading-snug">
            {title}
          </h1>
          <button
            onClick={onClose}
            className="top-2 right-2 absolute text-destructive"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children && (
          <div className="relative p-4 border-t border-t-secondary/30 border-b border-b-secondary/30 font-light text-base text-primary antialiased leading-relaxed">
            {children}
          </div>
        )}

        <div className="px-4 pb-2">
          {(onCancel || onConfirm) && (
            <div className="flex sm:flex-row flex-col justify-center md:justify-end items-end gap-4 pt-4 pb-2 text-blue-gray-500">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  {cancelButtonTitle || "Cancel"}
                </Button>
              )}{" "}
              {onConfirm && (
                <Button onClick={onConfirm}>
                  {confirmButtonTitle || "Confirm"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
