"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getExpenseAmount, type ExpenseWithItineraryTitle } from "../services/get.service"
import { cn } from "@/lib/utils"

interface ExpenseSourceChartProps {
  expenses: ExpenseWithItineraryTitle[]
  className?: string
}

const SOURCE_COLORS = {
  custom: "hsl(var(--chart-1))",
  itinerary: "hsl(var(--chart-2))",
}

const chartConfig = {
  custom: {
    label: "Custom",
    color: SOURCE_COLORS.custom,
  },
  itinerary: {
    label: "From Itineraries",
    color: SOURCE_COLORS.itinerary,
  },
}

export function ExpenseSourceChart({ expenses, className }: ExpenseSourceChartProps) {
  const data = [
    {
      name: "Custom",
      value: expenses
        .filter((e) => e.expenseType === "custom")
        .reduce((sum, e) => sum + getExpenseAmount(e), 0),
      color: SOURCE_COLORS.custom,
    },
    {
      name: "Itineraries",
      value: expenses
        .filter((e) => e.expenseType === "itinerary")
        .reduce((sum, e) => sum + getExpenseAmount(e), 0),
      color: SOURCE_COLORS.itinerary,
    },
  ].filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-48 text-muted-foreground text-sm", className)}>
        No expense data
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className={cn("h-48", className)}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const value = payload[0].value as number
              const name = payload[0].name as string
              return (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                  <p className="text-xs text-muted-foreground">{name}</p>
                  <p className="text-sm font-semibold">
                    Rp {value.toLocaleString("id-ID")}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ChartContainer>
  )
}

interface ExpenseTrendChartProps {
  periods: {
    label: string
    total: number
  }[]
  className?: string
}

const trendChartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
}

export function ExpenseTrendChart({ periods, className }: ExpenseTrendChartProps) {
  if (periods.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-48 text-muted-foreground text-sm", className)}>
        No expense data
      </div>
    )
  }

  // Reverse to show oldest first
  const data = [...periods].reverse().map((p) => ({
    label: p.label,
    total: p.total,
  }))

  return (
    <ChartContainer config={trendChartConfig} className={cn("h-48", className)}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const value = payload[0].value as number
              return (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold">
                    Rp {value.toLocaleString("id-ID")}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
