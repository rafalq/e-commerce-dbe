type FormInputProps = {
  type: string;
  placeholder: string;
};

export default function FormInput({ type, placeholder }: FormInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className='px-1 text-gray-800'
    />
  );
}
