import FormCreateProduct from "@/app/dashboard/products/_components/form-create-product";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProductCreate() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return (
    <div className="w-full md:max-w-2xl">
      <FormCreateProduct />
    </div>
  );
}
