import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import CardSettings from "./_components/card-settings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  } else {
    return <CardSettings session={session} />;
  }
}
