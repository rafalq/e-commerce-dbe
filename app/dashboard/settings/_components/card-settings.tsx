"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Session } from "next-auth";
import { FormSettings } from "./form-settings";
import { CircleAlert } from "lucide-react";

type CardSettingsProps = {
  session: Session;
};

export default function CardSettings({ session }: CardSettingsProps) {
  return (
    <div className="flex justify-center items-center">
      <Card className="md:w-[450px]">
        <CardHeader>
          <CardTitle className="text-center">Settings</CardTitle>
          <CardDescription className="text-center">
            Update your profile settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="my-6">
          <FormSettings session={session} />
        </CardContent>
        <CardFooter>
          <p className="flex gap-2">
            <CircleAlert className="w-4 h-4 text-red-700" />
            <span className="text-sm">
              Settings disabled when using social authentication.
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
