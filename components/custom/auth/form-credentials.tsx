'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInSchema } from '@/types/sign-in-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { PiSignIn } from 'react-icons/pi';
import { signInEmail } from '@/server/actions/sign-in-email';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';

export default function FormCredentials() {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute, status } = useAction(signInEmail, {});

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='email'
                  placeholder='e-commerce-dbe@email.com'
                  autoComplete='email'
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='password'
                  placeholder='***********'
                  autoComplete='current-password'
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-between mt-2 mb-6'>
          <Button size={'sm'} variant={'link'} asChild>
            <Link href='/auth/reset' className='underline'>
              Forgot your password?
            </Link>
          </Button>
          <Button
            type='submit'
            className={cn(
              'px-8',
              status === 'executing' ? 'animate-pulse' : null
            )}
          >
            <p>{'Sign In'}</p> <PiSignIn className='w-5 h-5 ml-2' />
          </Button>
        </div>
      </form>
    </Form>
  );
}
