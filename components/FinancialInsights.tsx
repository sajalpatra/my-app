"use client";

import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

type Transaction = {
  amount: number;
  date: Date;
};

export default function FinancialInsights({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Current month transactions
  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  // Last month transactions
  const lastMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const calculateStats = (trans: Transaction[]) => {
    const income = trans
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = trans
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expense, total: trans.length };
  };

  const currentStats = calculateStats(currentMonthTransactions);
  const lastStats = calculateStats(lastMonthTransactions);

  const expenseChange =
    lastStats.expense > 0
      ? ((currentStats.expense - lastStats.expense) / lastStats.expense) * 100
      : 0;

  const avgDailySpending = currentStats.expense / new Date().getDate();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        💡 Financial Insights
      </h2>

      <div className="space-y-4">
        {/* Average Daily Spending */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              Average Daily Spending
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatAmount(avgDailySpending)}
            </p>
          </div>
        </div>

        {/* Month Comparison */}
        <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          {expenseChange > 0 ? (
            <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          ) : (
            <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              vs Last Month
            </p>
            <p
              className={`text-lg font-bold ${
                expenseChange > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {expenseChange > 0 ? "+" : ""}
              {expenseChange.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {expenseChange > 0 ? "Spending increased" : "Spending decreased"}
            </p>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              This Month's Transactions
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {currentStats.total}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {formatAmount(currentStats.income)} income •{" "}
              {formatAmount(currentStats.expense)} spent
            </p>
          </div>
        </div>

        {/* Smart Tip */}
        {expenseChange > 10 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm text-gray-800 dark:text-white font-medium">
              💡 Tip: Your spending increased by {expenseChange.toFixed(0)}%
              this month. Consider reviewing your expenses.
            </p>
          </div>
        )}

        {expenseChange < -10 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-800 dark:text-white font-medium">
              🎉 Great job! You reduced spending by{" "}
              {Math.abs(expenseChange).toFixed(0)}% compared to last month!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
