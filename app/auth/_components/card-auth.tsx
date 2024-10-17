import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Socials from "./socials";
import ButtonBack from "@/components/ui/custom/button-back";

type CardAuthProps = {
  cardTitle: string;
  children?: React.ReactNode;
  buttonBackHref?: string;
  buttonBackLabel?: string;
  showSocials?: boolean;
};

export default function CardAuth({
  cardTitle,
  children,
  buttonBackHref,
  buttonBackLabel,
  showSocials,
}: CardAuthProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      {buttonBackHref && (
        <CardFooter className="flex justify-center gap-2 mt-2">
          <ButtonBack href={buttonBackHref} label={buttonBackLabel || ""} />
        </CardFooter>
      )}
    </Card>
  );
}
