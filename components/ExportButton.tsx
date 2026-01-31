"use client";

import { Download } from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: Date;
};

export default function ExportButton({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export!");
      return;
    }

    // Create CSV content
    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-US"),
      `"${t.text}"`, // Wrap in quotes to handle commas in description
      t.category,
      Math.abs(t.amount).toFixed(2),
      t.amount > 0 ? "Income" : "Expense",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-md"
      disabled={transactions.length === 0}
    >
      <Download className="h-4 w-4" />
      Export to CSV
    </button>
  );
}
