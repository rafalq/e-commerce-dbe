"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { LoaderCircle, LogOut, Moon, Settings, Sun, Truck } from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function ButtonUser({ user }: Session) {
  const { setTheme, theme, resolvedTheme } = useTheme(); // Get resolvedTheme to check the system preference
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    handleTheme();
  }, [resolvedTheme]); // Add resolvedTheme to trigger when the theme changes

  function handleCheckedChange(e: boolean) {
    setIsChecked(e);

    if (e) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  function handleTheme() {
    if (resolvedTheme === "dark") {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          <Suspense
            fallback={<LoaderCircle className="w-6 h-6 animate-spin" />}
          >
            {user?.image ? (
              <Image src={user.image} alt={user.name || "user avatar"} fill />
            ) : (
              <AvatarFallback>
                <p className="font-bold text-primary dark:text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </p>
              </AvatarFallback>
            )}
          </Suspense>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col gap-0.5 p-4 min-w-40"
        align="end"
      >
        <DropdownMenuLabel className="bg-primary/5 mb-2 p-4 rounded-md">
          <p>{user?.name}</p>
          <p className="mt-1 font-light text-xs">{user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className="p-3 cursor-pointer group"
        >
          <DropdownMenuItemContent
            icon={
              <Truck className="w-4 h-4 transition-all group-hover:-translate-x-1 duration-300 ease-in-out" />
            }
            text="Orders"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="p-3 cursor-pointer group"
        >
          {" "}
          <DropdownMenuItemContent
            icon={
              <Settings className="group-hover:rotate-180 w-4 h-4 transition-all duration-300 ease-in-out" />
            }
            text="Settings"
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-3 cursor-pointer group">
          {theme && (
            <ButtonTheme
              isChecked={isChecked}
              onCheckedChange={handleCheckedChange}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="focus:dark:bg-destructive focus:bg-destructive/10 p-3 cursor-pointer group"
        >
          <DropdownMenuItemContent
            icon={
              <LogOut className="group-hover:scale-110 w-4 h-4 transition-all duration-300 ease-in-out" />
            }
            text="Sign out"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DropdownMenuItemContentProps = {
  icon?: React.ReactNode;
  text: string;
  children?: React.ReactNode;
  className?: string;
};

function DropdownMenuItemContent({
  icon,
  text,
  children,
  className,
}: DropdownMenuItemContentProps) {
  return (
    <div className={cn(className)}>
      <div>
        <p className="flex items-center gap-3">
          {icon && icon}
          <span className="font-medium">{text}</span>
        </p>
      </div>
      {children}
    </div>
  );
}

type ButtonThemeProps = {
  isChecked: boolean;
  onCheckedChange: (e: boolean) => void;
};

function ButtonTheme({ isChecked, onCheckedChange }: ButtonThemeProps) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="flex gap-4">
      <DropdownMenuItemContent
        icon={
          <>
            {!isChecked ? (
              <Sun className="group-hover:text-yellow-300 group-hover:bg-blue-400 -ml-1 p-1 rounded-full w-6 h-6 transition-all duration-300 ease-in-out" />
            ) : (
              <Moon className="group-hover:bg-blue-900 group-hover:text-gray-100 -ml-1 p-1 rounded-full w-6 h-6 transition-all duration-300 ease-in-out" />
            )}
          </>
        }
        text="Theme"
      />
      <Switch checked={isChecked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
