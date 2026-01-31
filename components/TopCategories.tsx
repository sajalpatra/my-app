"use client";

import { TrendingUp } from "lucide-react";

type Transaction = {
  amount: number;
  category: string;
};

export default function TopCategories({
  transactions,
}: {
  transactions: Transaction[];
}) {
  // Calculate spending by category (only expenses)
  const categorySpending = transactions
    .filter((t) => t.amount < 0)
    .reduce(
      (acc, t) => {
        const category = t.category;
        const amount = Math.abs(t.amount);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      },
      {} as Record<string, number>,
    );

  // Sort by spending amount and get top 5
  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
    }));

  const totalSpending = Object.values(categorySpending).reduce(
    (sum, val) => sum + val,
    0,
  );

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      Food: "🍔",
      Transportation: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Bills: "💡",
      Healthcare: "🏥",
      Education: "📚",
      Salary: "💰",
      Business: "💼",
      Investment: "📈",
      Other: "📦",
    };
    return emojiMap[category] || "📦";
  };

  if (topCategories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          🏆 Top Spending Categories
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No expense data available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        🏆 Top Spending Categories
      </h2>

      <div className="space-y-4">
        {topCategories.map((item, index) => {
          const percentage = (item.amount / totalSpending) * 100;

          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {getCategoryEmoji(item.category)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {item.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage.toFixed(1)}% of total spending
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 dark:text-red-400">
                    {formatAmount(item.amount)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>#{index + 1}</span>
                    <TrendingUp className="h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Expenses
          </span>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {formatAmount(totalSpending)}
          </span>
        </div>
      </div>
    </div>
  );
}
