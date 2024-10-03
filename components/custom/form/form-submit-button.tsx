'use client';

import { useFormStatus } from 'react-dom';

type FormButtonProps = {
  type: 'button' | 'submit';
  title: string;
};

export default function FormSubmitButton({ type, title }: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type={type}
      className='bg-slate-500 rounded-sm p-1'
    >
      <span className='text-gray-100 uppercase'>
        {!pending ? title : '...'}
      </span>
    </button>
  );
}
