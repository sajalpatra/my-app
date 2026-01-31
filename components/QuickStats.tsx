"use client";

import { Receipt, TrendingDown, Percent, Tag } from "lucide-react";

type Transaction = {
  amount: number;
  category: string;
};

export default function QuickStats({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate stats
  const totalTransactions = transactions.length;

  const averageExpense =
    expenses.length > 0 ? totalExpense / expenses.length : 0;

  const biggestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((t) => Math.abs(t.amount)))
      : 0;

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Most frequent category
  const categoryCount = expenses.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostFrequentCategory =
    Object.entries(categoryCount).length > 0
      ? Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0][0]
      : "None";

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const stats = [
    {
      icon: Receipt,
      label: "Total Transactions",
      value: totalTransactions.toString(),
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: TrendingDown,
      label: "Avg Expense",
      value: formatAmount(averageExpense),
      color: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: TrendingDown,
      label: "Biggest Expense",
      value: formatAmount(biggestExpense),
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: Percent,
      label: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      color: savingsRate > 0 ? "bg-green-500" : "bg-gray-500",
      textColor:
        savingsRate > 0
          ? "text-green-600 dark:text-green-400"
          : "text-gray-600 dark:text-gray-400",
      bgColor:
        savingsRate > 0
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-gray-50 dark:bg-gray-900/20",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        📊 Quick Stats
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} p-4 rounded-lg border-l-4 ${stat.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Most Frequent Category */}
      <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Most Frequent Category
          </p>
        </div>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {mostFrequentCategory}
        </p>
        {mostFrequentCategory !== "None" && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {categoryCount[mostFrequentCategory]} transaction(s)
          </p>
        )}
      </div>
    </div>
  );
}
