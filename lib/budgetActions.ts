"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setBudget(
  category: string,
  limit: number,
  month: number,
  year: number,
) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!category || limit <= 0) {
    return { error: "Invalid budget data" };
  }

  try {
    await db.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: user.id,
          category,
          month,
          year,
        },
      },
      update: {
        limit,
      },
      create: {
        userId: user.id,
        category,
        limit,
        month,
        year,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error setting budget:", error);
    return { error: "Failed to set budget" };
  }
}

export async function getBudgets(month: number, year: number) {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  try {
    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
        month,
        year,
      },
    });

    return budgets;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

export async function deleteBudget(id: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const budget = await db.budget.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!budget) {
      return { error: "Budget not found" };
    }

    await db.budget.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return { error: "Failed to delete budget" };
  }
}

export async function getBudgetStatus(month: number, year: number) {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  try {
    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
        month,
        year,
      },
    });

    const transactions = await db.record.findMany({
      where: {
        userId: user.id,
        amount: { lt: 0 }, // Only expenses
      },
    });

    // Filter transactions for the specific month/year
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    // Calculate spending per category
    const categorySpending = monthTransactions.reduce(
      (acc, t) => {
        const category = t.category;
        const amount = Math.abs(t.amount);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Match budgets with spending
    return budgets.map((budget) => ({
      id: budget.id,
      category: budget.category,
      limit: budget.limit,
      spent: categorySpending[budget.category] || 0,
      percentage:
        ((categorySpending[budget.category] || 0) / budget.limit) * 100,
    }));
  } catch (error) {
    console.error("Error getting budget status:", error);
    return [];
  }
}
