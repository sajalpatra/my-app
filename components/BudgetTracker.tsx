"use client";

import { useState } from "react";
import { setBudget, deleteBudget } from "@/lib/budgetActions";
import { AlertCircle, CheckCircle, Trash2, Plus } from "lucide-react";

type BudgetStatus = {
  id: string;
  category: string;
  limit: number;
  spent: number;
  percentage: number;
};

export default function BudgetTracker({
  budgets,
  categories,
}: {
  budgets: BudgetStatus[];
  categories: string[];
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !budgetLimit) {
      alert("Please fill in all fields");
      return;
    }

    const result = await setBudget(
      selectedCategory,
      parseFloat(budgetLimit),
      currentMonth,
      currentYear,
    );

    if (result.success) {
      setShowAddForm(false);
      setSelectedCategory("");
      setBudgetLimit("");
    } else if (result.error) {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this budget?")) {
      const result = await deleteBudget(id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100)
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (percentage >= 80)
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          💰 Budget Tracker
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Budget
        </button>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Budget Limit"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
            >
              Save Budget
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Budget List */}
      {budgets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No budgets set for this month. Add one to start tracking!
        </p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(budget.percentage)}
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {budget.category}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {formatAmount(budget.spent)} / {formatAmount(budget.limit)}
                  </span>
                  <span className="font-semibold">
                    {budget.percentage.toFixed(0)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${getStatusColor(
                      budget.percentage,
                    )}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>

                {/* Warning Messages */}
                {budget.percentage >= 100 && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠️ Budget exceeded!
                  </p>
                )}
                {budget.percentage >= 80 && budget.percentage < 100 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    ⚠️ Approaching budget limit
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
