"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generateFinancialInsights } from "@/lib/aiService";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getAIInsights() {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // Get current month transactions
    const transactions = await db.record.findMany({
      where: {
        userId: user.id,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Calculate income and expenses
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Get top spending categories
    const categorySpending: { [key: string]: number } = {};
    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        categorySpending[t.category] =
          (categorySpending[t.category] || 0) + Math.abs(t.amount);
      });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    // Determine spending trend (compare to last month)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastMonthTransactions = await db.record.findMany({
      where: {
        userId: user.id,
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
        amount: { lt: 0 },
      },
    });

    const lastMonthExpense = lastMonthTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0,
    );

    let monthlyTrend: "increasing" | "decreasing" | "stable" = "stable";
    const trendChange =
      lastMonthExpense > 0
        ? ((totalExpense - lastMonthExpense) / lastMonthExpense) * 100
        : 0;

    if (trendChange > 5) monthlyTrend = "increasing";
    else if (trendChange < -5) monthlyTrend = "decreasing";

    // Get budget status
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    });

    const budgetStatus = budgets.map((budget) => ({
      category: budget.category,
      spent: categorySpending[budget.category] || 0,
      limit: budget.limit,
    }));

    // Generate AI insights
    const insights = await generateFinancialInsights({
      totalIncome,
      totalExpense,
      topCategories,
      monthlyTrend,
      budgetStatus,
    });

    return {
      success: true,
      insights,
      stats: {
        totalIncome,
        totalExpense,
        savingsRate:
          totalIncome > 0
            ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
            : 0,
        monthlyTrend,
      },
    };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return { error: "Failed to generate AI insights" };
  }
}
