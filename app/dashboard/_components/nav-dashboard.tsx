"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardLink } from "../_types";

type NavDashboardProps = {
  links: DashboardLink[];
};

export default function NavDashboard({ links }: NavDashboardProps) {
  const pathname = usePathname();
  return (
    <nav className="my-4">
      <ul className="flex items-end gap-6 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 p-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full w-full [&::-webkit-scrollbar]:h-2 overflow-x-auto">
        <AnimatePresence>
          {links.map(({ label, path, icon }) => (
            <motion.li whileTap={{ scale: 0.95 }} key={label}>
              <Link
                href={path}
                className={cn(
                  "relative flex flex-col items-center gap-1.5",
                  pathname === path ? "text-primary" : "text-primary/60"
                )}
              >
                {icon}
                <span className="font-semibold text-xs">{label}</span>
                {pathname === path ? (
                  <motion.div
                    layoutId="underline"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="-bottom-1.5 absolute bg-primary rounded-full w-full h-[2.5px]"
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
