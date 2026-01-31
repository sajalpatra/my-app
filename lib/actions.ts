"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const text = formData.get("text") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;

  if (!text || isNaN(amount)) {
    return { error: "Please provide valid text and amount" };
  }

  try {
    await db.record.create({
      data: {
        text,
        amount,
        category: category || "Other",
        date: date ? new Date(date) : new Date(),
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { error: "Failed to add transaction" };
  }
}

export async function deleteTransaction(id: string) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Verify the transaction belongs to the user
    const transaction = await db.record.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!transaction) {
      return { error: "Transaction not found" };
    }

    await db.record.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { error: "Failed to delete transaction" };
  }
}

export async function getTransactions() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  try {
    const transactions = await db.record.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getBalance() {
  const user = await currentUser();

  if (!user) {
    return { balance: 0, income: 0, expense: 0 };
  }

  try {
    const transactions = await db.record.findMany({
      where: {
        userId: user.id,
      },
    });

    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const balance = income - expense;

    return { balance, income, expense };
  } catch (error) {
    console.error("Error calculating balance:", error);
    return { balance: 0, income: 0, expense: 0 };
  }
}
