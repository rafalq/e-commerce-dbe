export default function AvatarFallback({ name }: { name?: string }) {
  return (
    <p className="flex justify-center items-center bg-primary rounded-full w-8 h-8 font-bold text-primary-foreground">
      {name ? name.charAt(0).toUpperCase() : "X"}
    </p>
  );
}
