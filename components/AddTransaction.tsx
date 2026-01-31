"use client";

import { addTransaction, parseNaturalLanguage } from "@/lib/actions";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function AddTransaction() {
  const [isIncome, setIsIncome] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const [nlInput, setNlInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [showNLInput, setShowNLInput] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

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

  const handleNaturalLanguage = async () => {
    if (!nlInput.trim()) return;

    setIsParsing(true);
    try {
      const result = await parseNaturalLanguage(nlInput);
      if (result.success && result.data) {
        // Populate the form with parsed data
        const form = document.getElementById(
          "transaction-form",
        ) as HTMLFormElement;
        if (form) {
          (form.elements.namedItem("text") as HTMLInputElement).value =
            result.data.description;
          (form.elements.namedItem("amount") as HTMLInputElement).value =
            result.data.amount.toString();
          (form.elements.namedItem("category") as HTMLSelectElement).value =
            result.data.category;
          (form.elements.namedItem("date") as HTMLInputElement).value =
            result.data.date;
          setIsIncome(result.data.isIncome);
          setNlInput("");
          setShowNLInput(false);
        }
      } else {
        alert(result.error || "Could not parse transaction");
      }
    } catch (error) {
      alert("Failed to parse transaction");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Convert amount to negative if it's an expense
    let amount = parseFloat(formData.get("amount") as string);
    if (!isIncome) {
      amount = -Math.abs(amount);
    }
    formData.set("amount", amount.toString());
    formData.set("useAI", useAI.toString());

    const result = await addTransaction(formData);

    if (result.success) {
      form.reset();
      setIsIncome(true);
      if (result.aiSuggestion) {
        setAiSuggestion(result.aiSuggestion);
        setTimeout(() => setAiSuggestion(null), 3000);
      }
    } else if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Add Transaction
      </h2>

      {/* Natural Language Input Toggle */}
      <button
        type="button"
        onClick={() => setShowNLInput(!showNLInput)}
        className="w-full mb-4 flex items-center justify-center gap-2 py-2 px-4 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md font-medium transition-all"
      >
        <Sparkles className="h-4 w-4" />
        {showNLInput ? "Use Form" : "Quick Add with AI"}
      </button>

      {/* Natural Language Input */}
      {showNLInput && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💬 Describe your transaction
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNaturalLanguage()}
              placeholder='e.g., "Spent $45 on groceries at Walmart yesterday"'
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              disabled={isParsing}
            />
            <button
              type="button"
              onClick={handleNaturalLanguage}
              disabled={isParsing || !nlInput.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors flex items-center gap-2"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                "Parse"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            AI will parse your description and fill the form below
          </p>
        </div>
      )}

      {/* AI Suggestion Notification */}
      {aiSuggestion && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-800 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            AI suggested category: <strong>{aiSuggestion}</strong>
          </p>
        </div>
      )}

      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <button
              type="button"
              onClick={() => setUseAI(!useAI)}
              className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700"
            >
              <Sparkles className={`h-3 w-3 ${useAI ? "fill-purple-600" : ""}`} />
              {useAI ? "AI On" : "AI Off"}
            </button>
          </div>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {useAI && (
              <option value="auto">🤖 Auto (AI will suggest)</option>
            )}
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {useAI && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              AI will suggest the best category based on your description
            </p>
          )}
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
