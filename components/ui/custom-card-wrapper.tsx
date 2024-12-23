import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CustomCardWrapperProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: JSX.Element;
};

export default function CustomCardWrapper({
  title,
  description,
  children,
  footer,
}: CustomCardWrapperProps) {
  return (
    <Card className="px-4 py-6 w-full">
      <CardHeader className="pb-8 text-center">
        {title && (
          <CardTitle className="font-bold text-3xl sm:text-4xl tracking-tight">
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="mt-2 text-sm leading-8">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <div className="flex flex-col gap-4">
        <CardContent className="flex flex-col justify-center gap-6 px-10">
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </div>
    </Card>
  );
}
