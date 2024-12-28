import SettingsForm from "@/app/dashboard/settings/_components/settings-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  } else {
    return <SettingsForm session={session} />;
  }
}
