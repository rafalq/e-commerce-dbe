import type { InputProps } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { forwardRef } from "react";

// Override value to be strictly string or undefined
type CustomInputProps = Omit<InputProps, "value"> &
  Omit<InputProps, "onChange"> & {
    value?: string;
    onChange?: () => void;
    slotsAmount: number;
  };

const CustomInputCode = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ slotsAmount, className, ...props }, ref) => {
    return (
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        ref={ref}
        className={cn(className)}
        {...props}
      >
        <InputOTPGroup>
          {Array.from({ length: slotsAmount }, (_, index) => (
            <InputOTPSlot index={index} key={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  }
);

CustomInputCode.displayName = "CustomInputCode";

export default CustomInputCode;
