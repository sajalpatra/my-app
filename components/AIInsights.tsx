"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { getAIInsights } from "@/lib/aiActions";

export default function AIInsights() {
  const [insights, setInsights] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const result = await getAIInsights();
      if (result.success && result.insights) {
        setInsights(result.insights);
        setStats(result.stats);
        setHasLoaded(true);
      } else {
        alert(result.error || "Could not generate insights");
      }
    } catch (error) {
      alert("Failed to load AI insights");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          AI Financial Coach
        </h2>
        {!hasLoaded ? (
          <button
            onClick={loadInsights}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-md font-medium transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI Insights
              </>
            )}
          </button>
        ) : (
          <button
            onClick={loadInsights}
            disabled={isLoading}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 disabled:text-gray-400"
          >
            {isLoading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        )}
      </div>

      {!hasLoaded && !isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Get personalized financial insights powered by AI
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Click "Get AI Insights" to analyze your spending patterns
          </p>
        </div>
      )}

      {hasLoaded && stats && (
        <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Savings Rate
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.savingsRate}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trend</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                <TrendingUp
                  className={`h-5 w-5 ${
                    stats.monthlyTrend === "increasing"
                      ? "text-red-500"
                      : stats.monthlyTrend === "decreasing"
                        ? "text-green-500 rotate-180"
                        : "text-gray-500"
                  }`}
                />
                {stats.monthlyTrend === "increasing"
                  ? "Up"
                  : stats.monthlyTrend === "decreasing"
                    ? "Down"
                    : "Stable"}
              </p>
            </div>
          </div>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-purple-500"
            >
              <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-800 dark:text-white">{insight}</p>
            </div>
          ))}
        </div>
      )}

      {hasLoaded && insights.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          Not enough data to generate insights. Keep tracking your expenses!
        </p>
      )}
    </div>
  );
}
