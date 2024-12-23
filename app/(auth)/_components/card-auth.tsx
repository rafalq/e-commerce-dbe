import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonBack from "@/components/ui/custom/button-back";
import Separator from "@/components/ui/custom/separator";
import SocialsAuth from "@/app/(auth)/_components/socials-auth";

type CardAuthProps = {
  cardTitle?: string;
  cardDescription?: string;
  children: React.ReactNode;
  showSocials?: boolean;
  buttonBackLabel?: string;
  buttonBackHref?: string;
};

export const CardAuth = ({
  cardTitle,
  cardDescription,
  children,
  showSocials,
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
        {showSocials && (
          <div className="flex flex-col justify-center items-center w-full">
            <Separator text="or" />
            <div className="pt-8">
              <SocialsAuth />
            </div>
          </div>
        )}

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
