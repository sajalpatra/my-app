"use client";

import { addTransaction } from "@/lib/actions";
import { useState } from "react";

export default function AddTransaction() {
  const [isIncome, setIsIncome] = useState(true);

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Education",
    "Salary",
    "Business",
    "Investment",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Convert amount to negative if it's an expense
    let amount = parseFloat(formData.get("amount") as string);
    if (!isIncome) {
      amount = -Math.abs(amount);
    }
    formData.set("amount", amount.toString());

    const result = await addTransaction(formData);

    if (result.success) {
      e.currentTarget.reset();
      setIsIncome(true);
    } else if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsIncome(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              isIncome
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setIsIncome(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              !isIncome
                ? "bg-red-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Expense
          </button>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="text"
            name="text"
            required
            placeholder="Enter description..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}
