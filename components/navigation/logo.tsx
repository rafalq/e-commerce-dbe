type LogoProps = {
  text?: string;
};

export default function Logo({ text }: LogoProps) {
  return <p className="font-semibold text-2xl">{text ? text : "LOGO"}</p>;
}
