import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const CATEGORIES = [
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

export interface CategoryPrediction {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface ParsedTransaction {
  description: string;
  amount: number;
  category: string;
  date: string;
  isIncome: boolean;
}

/**
 * Predict category for a transaction using AI
 */
export async function predictCategory(
  description: string,
  amount: number,
  userHistory?: { description: string; category: string }[],
): Promise<CategoryPrediction> {
  try {
    const historyContext =
      userHistory && userHistory.length > 0
        ? `\n\nUser's recent transaction patterns:\n${userHistory
            .slice(0, 10)
            .map((t) => `- "${t.description}" → ${t.category}`)
            .join("\n")}`
        : "";

    const prompt = `You are a financial assistant helping categorize transactions. 

Transaction details:
- Description: "${description}"
- Amount: $${Math.abs(amount)}
${historyContext}

Available categories: ${CATEGORIES.join(", ")}

Analyze this transaction and respond with a JSON object containing:
- category: the most appropriate category from the list
- confidence: a number between 0 and 1 indicating your confidence
- reasoning: brief explanation (max 20 words)

Respond ONLY with valid JSON, no additional text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a financial categorization expert. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.3,
      max_completion_tokens: 200,
      response_format: { type: "json_object" },
    });

    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(response);

    // Validate category is in our list
    const category = CATEGORIES.includes(parsed.category)
      ? parsed.category
      : "Other";

    return {
      category,
      confidence: parsed.confidence || 0.5,
      reasoning: parsed.reasoning || "AI categorization",
    };
  } catch (error) {
    console.error("Error predicting category:", error);
    // Fallback to simple rule-based categorization
    return {
      category: "Other",
      confidence: 0.3,
      reasoning: "Fallback categorization",
    };
  }
}

/**
 * Parse natural language transaction input
 */
export async function parseNaturalLanguageTransaction(
  input: string,
): Promise<ParsedTransaction | null> {
  try {
    const prompt = `Parse this natural language transaction into structured data:

"${input}"

Extract:
- description: what was purchased/received (concise)
- amount: numeric value (positive number)
- category: choose from [${CATEGORIES.join(", ")}]
- date: ISO format (YYYY-MM-DD), default to today if not specified
- isIncome: true if it's income, false if expense

Today's date: ${new Date().toISOString().split("T")[0]}

Examples:
- "Spent $45 on groceries yesterday" → {"description": "Groceries", "amount": 45, "category": "Food", "date": "YYYY-MM-DD", "isIncome": false}
- "Got paid $2000 salary" → {"description": "Salary payment", "amount": 2000, "category": "Salary", "date": "today", "isIncome": true}

Respond ONLY with valid JSON, no additional text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a financial data parser. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2,
      max_completion_tokens: 300,
      response_format: { type: "json_object" },
    });

    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      return null;
    }

    const parsed = JSON.parse(response);

    // Validate and normalize
    return {
      description: parsed.description || "Transaction",
      amount: Math.abs(parseFloat(parsed.amount) || 0),
      category: CATEGORIES.includes(parsed.category)
        ? parsed.category
        : "Other",
      date: parsed.date || new Date().toISOString().split("T")[0],
      isIncome: parsed.isIncome === true,
    };
  } catch (error) {
    console.error("Error parsing natural language:", error);
    return null;
  }
}

/**
 * Generate personalized budget recommendations
 */
export async function generateBudgetRecommendations(
  categorySpending: { category: string; spent: number; months: number }[],
): Promise<{ category: string; recommendedBudget: number; reasoning: string }[]> {
  try {
    const spendingData = categorySpending
      .map(
        (s) =>
          `- ${s.category}: $${s.spent.toFixed(2)} over ${s.months} months (avg: $${(s.spent / s.months).toFixed(2)}/month)`,
      )
      .join("\n");

    const prompt = `You are a financial advisor. Based on this spending history, recommend monthly budgets for each category:

${spendingData}

For each category, provide:
- category: the category name
- recommendedBudget: suggested monthly budget (number, realistic but encourages some savings)
- reasoning: brief explanation (max 30 words)

Consider:
- Past average spending
- Some buffer for flexibility (10-15%)
- Encouraging modest savings where possible

Respond with a JSON array of recommendations. Use valid JSON only.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.4,
      max_completion_tokens: 800,
      response_format: { type: "json_object" },
    });

    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      return [];
    }

    const parsed = JSON.parse(response);
    // Handle both array and object with array property
    const recommendations = Array.isArray(parsed)
      ? parsed
      : parsed.recommendations || [];

    return recommendations.map((rec: any) => ({
      category: rec.category,
      recommendedBudget: parseFloat(rec.recommendedBudget) || 0,
      reasoning: rec.reasoning || "",
    }));
  } catch (error) {
    console.error("Error generating budget recommendations:", error);
    return [];
  }
}

/**
 * Generate smart financial insights
 */
export async function generateFinancialInsights(context: {
  totalIncome: number;
  totalExpense: number;
  topCategories: { category: string; amount: number }[];
  monthlyTrend: "increasing" | "decreasing" | "stable";
  budgetStatus: { category: string; spent: number; limit: number }[];
}): Promise<string[]> {
  try {
    const prompt = `You are a financial advisor. Analyze this financial data and provide 3-4 actionable insights:

Financial Summary:
- Total Income: $${context.totalIncome.toFixed(2)}
- Total Expenses: $${context.totalExpense.toFixed(2)}
- Savings Rate: ${(((context.totalIncome - context.totalExpense) / context.totalIncome) * 100).toFixed(1)}%
- Spending Trend: ${context.monthlyTrend}

Top Spending Categories:
${context.topCategories.map((c) => `- ${c.category}: $${c.amount.toFixed(2)}`).join("\n")}

Budget Status:
${context.budgetStatus.map((b) => `- ${b.category}: $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)} (${((b.spent / b.limit) * 100).toFixed(0)}%)`).join("\n")}

Provide 3-4 specific, actionable insights as a JSON array of strings. Each insight should be:
- Personalized to this data
- Actionable (suggest what to do)
- Concise (max 100 characters)

Format: {"insights": ["insight 1", "insight 2", "insight 3"]}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial advisor. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.6,
      max_completion_tokens: 500,
      response_format: { type: "json_object" },
    });

    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) {
      return [];
    }

    const parsed = JSON.parse(response);
    return parsed.insights || [];
  } catch (error) {
    console.error("Error generating insights:", error);
    return [];
  }
}
