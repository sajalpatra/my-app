"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  category: string;
};

export default function SpendingChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Calculate spending by category (only expenses)
  const categoryData = transactions
    .filter((t) => t.amount < 0)
    .reduce(
      (acc, t) => {
        const category = t.category;
        const amount = Math.abs(t.amount);
        const existing = acc.find((item) => item.name === category);

        if (existing) {
          existing.value += amount;
        } else {
          acc.push({ name: category, value: amount });
        }

        return acc;
      },
      [] as { name: string; value: number }[],
    );

  const COLORS = [
    "#10b981", // green
    "#3b82f6", // blue
    "#f59e0b", // yellow
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ];

  if (categoryData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Spending by Category
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No expense data to display
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Spending by Category
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(value)
                : ""
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
