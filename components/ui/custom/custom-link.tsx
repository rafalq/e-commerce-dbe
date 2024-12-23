import Link from "next/link";

type CustomLinkProps = {
  text?: string;
  href?: string;
  title: string;
};

export default function CustomLink({ text, href, title }: CustomLinkProps) {
  return (
    <p className="text-center">
      {text && <span className="font-light text-primary/55">{text}</span>}
      {href ? (
        <Link
          href={href}
          className="border-primary/0 hover:border-primary/60 ml-2 border-b-2 font-medium text-primary/70 transition-all duration-300 ease-in-out"
        >
          <span>{title}</span>
        </Link>
      ) : (
        <span>{title}</span>
      )}
    </p>
  );
}
