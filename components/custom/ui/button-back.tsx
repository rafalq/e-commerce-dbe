'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ButtonBackProps = {
  href: string;
  label: string;
};

export default function ButtonBack({ href, label }: ButtonBackProps) {
  return (
    <Button variant={'ghost'} className='underline font-semibold'>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
