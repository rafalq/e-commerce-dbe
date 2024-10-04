import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonCustomProps = {
  onClick?: () => void;
  className?: string;
} & (
  | { variant: 'titled'; title: string; icon?: React.ReactNode }
  | { variant: 'blank'; children: React.ReactNode }
);

export function ButtonCustom(props: ButtonCustomProps) {
  return (
    <Button
      onClick={props.onClick}
      className={cn('flex w-full md:max-w-sm', `${props.className}`)}
    >
      {props.variant === 'blank' && props.children}
      {props.variant === 'titled' && (
        <div className='flex gap-2'>
          <p>{props.title}</p>
          {props.icon && <span>{props.icon}</span>}
        </div>
      )}
    </Button>
  );
}
