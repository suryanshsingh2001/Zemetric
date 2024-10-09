"use client";

import { TrendingDown } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Stats {
  smsSentInLastMinute: number;
  totalSmsSentToday: number;
  violations: number;
}

const chartConfig = {
  smsUsage: {
    label: "SMS Usage",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function SMSUsageCharts({ stats }: { stats: Stats }) {
  const minuteLimit = 3;
  const dailyLimit = 10;

  const minuteChartData = [
    {
      name: "Used",
      value: stats.smsSentInLastMinute,
      fill: "var(--color-used)",
    },
    {
      name: "Remaining",
      value: minuteLimit - stats.smsSentInLastMinute,
      fill: "var(--color-remaining)",
    },
  ];

  const dailyChartData = [
    { name: "Used", value: stats.totalSmsSentToday, fill: "var(--color-used)" },
    {
      name: "Remaining",
      value: dailyLimit - stats.totalSmsSentToday,
      fill: "var(--color-remaining)",
    },
  ];

  const remainingMinute = minuteLimit - stats.smsSentInLastMinute;
  const remainingDaily = dailyLimit - stats.totalSmsSentToday;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Last Minute SMS Usage</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={minuteChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }: any) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {remainingMinute}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Remaining
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Daily SMS Usage</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={dailyChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }: any) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {remainingDaily}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Remaining
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        {remainingDaily === 0 && (
          <CardFooter className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span>Daily Limit reached</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
