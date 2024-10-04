import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Socials from './socials';
import ButtonBack from '../ui/button-back';

type CardAuthProps = {
  cardTitle: string;
  children?: React.ReactNode;
  buttonBackHref: string;
  buttonBackLabel: string;
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
      <CardFooter className='mt-2 flex gap-2 justify-center'>
        <p>No account?</p>
        <ButtonBack href={buttonBackHref} label={buttonBackLabel} />
      </CardFooter>
    </Card>
  );
}
