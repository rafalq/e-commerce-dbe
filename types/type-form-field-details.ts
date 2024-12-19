export type TypeSelectItem = {
  value: string;
  label: string;
};

type TypeTwoFactorField = "two-factor-password" | "two-factor-code";

export type TypeFormFieldDetails<T> = {
  name: keyof T;
  label?: string;
  labelInfo?: React.ReactNode;
  description?: string;
  placeholder?: string;
} & (
  | {
      type:
        | "text"
        | "email"
        | "password"
        | "select-custom"
        | TypeTwoFactorField;
    }
  | {
      type: "select-single" | "select";
      options: TypeSelectItem[];
    }
);
