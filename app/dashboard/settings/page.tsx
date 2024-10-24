import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { FormSettings } from "./_components/form-settings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  } else {
    return <FormSettings session={session} />;
  }
}
