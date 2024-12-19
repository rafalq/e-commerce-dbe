"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TypeOrderProduct } from "@/types/type-order-product";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyChart } from "@/app/dashboard/analytics/_components/monthly-chart";
import { weeklyChart } from "@/app/dashboard/analytics/_components/weekly-chart";

export default function Earnings({
  totalOrders,
}: {
  totalOrders: TypeOrderProduct[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  const chartItems = totalOrders.map((order) => ({
    date: order.order.created!,
    revenue: order.order.total,
  }));

  const activeChart = useMemo(() => {
    const weekly = weeklyChart(chartItems);
    const monthly = monthlyChart(chartItems);

    if (filter === "week") {
      return weekly;
    }
    if (filter === "month") {
      return monthly;
    }
  }, [chartItems, filter]);

  const activeTotal = useMemo(() => {
    if (filter === "month") {
      return monthlyChart(chartItems)
        .reduce((acc, item) => acc + item.revenue, 0)
        .toFixed(2);
    }

    return weeklyChart(chartItems)
      .reduce((acc, item) => acc + item.revenue, 0)
      .toFixed(2);
  }, [chartItems, filter]);

  return (
    <Card className="flex-1 h-full shrink-0">
      <CardHeader>
        <CardTitle>Your Revenue: ${activeTotal}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex items-center gap-2 pb-4">
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
          >
            This Week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter === "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
        <CardContent className="h-96">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart data={activeChart}>
              <Tooltip
                content={(props) => (
                  <div>
                    {props.payload?.map((item) => {
                      return (
                        <div
                          className="bg-primary shadow-lg px-4 py-2 rounded-md text-primary-foreground"
                          key={item.payload.date}
                        >
                          <p>
                            Revenue: ${Math.floor(item.value as number) ?? "$0"}
                          </p>
                          <p>Date: {item.payload.date}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              <YAxis dataKey="revenue" />
              <XAxis dataKey="date" />
              <Bar dataKey="revenue" className="fill-primary" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
