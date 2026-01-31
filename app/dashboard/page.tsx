import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import { getBalance, getTransactions } from "@/lib/actions";
import { getBudgetStatus } from "@/lib/budgetActions";
import Balance from "@/components/Balance";
import AddTransaction from "@/components/AddTransaction";
import TransactionList from "@/components/TransactionList";
import SpendingChart from "@/components/SpendingChart";
import FinancialInsights from "@/components/FinancialInsights";
import ExportButton from "@/components/ExportButton";
import BudgetTracker from "@/components/BudgetTracker";
import SpendingTrends from "@/components/SpendingTrends";
import TopCategories from "@/components/TopCategories";
import QuickStats from "@/components/QuickStats";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Ensure user exists in database
  await checkUser();

  // Fetch balance and transactions
  const { balance, income, expense } = await getBalance();
  const transactions = await getTransactions();

  // Get current month/year for budget
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Fetch budget status
  const budgets = await getBudgetStatus(currentMonth, currentYear);

  // Get unique categories from transactions
  const categories = Array.from(
    new Set(transactions.map((t) => t.category)),
  ).sort();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome back, {user.firstName || "User"}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your income and expenses
            </p>
          </div>
          <ExportButton transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Balance and Add Transaction */}
          <div className="lg:col-span-1 space-y-6">
            <Balance balance={balance} income={income} expense={expense} />
            <AddTransaction />
            <QuickStats transactions={transactions} />
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-2 space-y-6">
            <TransactionList transactions={transactions} />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <SpendingChart transactions={transactions} />
          <FinancialInsights transactions={transactions} />
          <TopCategories transactions={transactions} />
        </div>

        {/* Budget Section */}
        <div className="mt-6">
          <BudgetTracker budgets={budgets} categories={categories} />
        </div>

        {/* Trends Section */}
        <div className="mt-6">
          <SpendingTrends transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
