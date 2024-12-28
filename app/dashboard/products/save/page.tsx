import SaveProductForm from "@/app/dashboard/products/_components/save-product-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProductSave() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return <SaveProductForm />;
}
