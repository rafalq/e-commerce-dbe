import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonBack from "@/components/ui/custom/button-back";

type CardAuthProps = {
  cardTitle?: string;
  cardDescription?: string;
  children: React.ReactNode;
  buttonBackLabel?: string;
  buttonBackHref?: string;
};

export const CardAuth = ({
  cardTitle,
  cardDescription,
  children,
  buttonBackHref,
  buttonBackLabel,
}: CardAuthProps) => {
  return (
    <Card className="bg-primary-foreground/50 shadow mt-8 mb-12 p-4 w-full md:w-[420px]">
      <CardHeader>
        {cardTitle && (
          <CardTitle className="pb-4 font-bold text-2xl text-center text-primary md:text-3xl tracking-tight">
            {cardTitle}
          </CardTitle>
        )}
        {cardDescription && (
          <CardDescription>{cardDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        {(buttonBackHref || buttonBackLabel) && (
          <ButtonBack
            href={buttonBackHref || ""}
            label={buttonBackLabel || ""}
          />
        )}
      </CardFooter>
    </Card>
  );
};
