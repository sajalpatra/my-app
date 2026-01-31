"use client";

import { deleteTransaction } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import TransactionFilters from "./TransactionFilters";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: Date;
};

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = transactions.map((t) => t.category);
    return Array.from(new Set(cats)).sort();
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch = transaction.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      // Type filter
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "income" && transaction.amount > 0) ||
        (typeFilter === "expense" && transaction.amount < 0);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchTerm, categoryFilter, typeFilter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      const result = await deleteTransaction(id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Transaction History
      </h2>

      <TransactionFilters
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onTypeChange={setTypeFilter}
        categories={categories}
      />

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          {transactions.length === 0
            ? "No transactions yet. Add your first transaction above!"
            : "No transactions match your filters."}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                transaction.amount > 0
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-red-500 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {transaction.text}
                  </h3>
                  <span
                    className={`font-bold text-lg ${
                      transaction.amount > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(transaction.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
          
