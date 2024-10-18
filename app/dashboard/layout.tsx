import { auth } from "@/server/auth";
import { BarChart, Boxes, PackagePlus, Settings, Truck } from "lucide-react";
import NavDashboard from "./_components/nav-dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const linksUser = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const linksAdmin =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Boxes size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/products/create",
            icon: <PackagePlus size={16} />,
          },
        ]
      : [];

  const links = [...linksAdmin, ...linksUser];

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <NavDashboard links={links} />
      {children}
    </div>
  );
}
