"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  amount: number;
  date: Date;
};

export default function SpendingTrends({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Get last 6 months of data
  const getLast6Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    return months;
  };

  const months = getLast6Months();

  // Calculate income and expenses per month
  const monthlyData = months.map(({ month, monthIndex, year }) => {
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === monthIndex && date.getFullYear() === year;
    });

    const income = monthTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      name: month,
      Income: parseFloat(income.toFixed(2)),
      Expenses: parseFloat(expense.toFixed(2)),
    };
  });

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📈 Spending Trends
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No transaction data to display trends
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📈 Spending Trends (Last 6 Months)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280" }}
            style={{ fontSize: "12px" }}
          />
          <YAxis tick={{ fill: "#6b7280" }} style={{ fontSize: "12px" }} />
          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(value)
                : ""
            }
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Income"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
