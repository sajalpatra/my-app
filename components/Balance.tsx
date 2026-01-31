export default function Balance({
  balance,
  income,
  expense,
}: {
  balance: number;
  income: number;
  expense: number;
}) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
        Your Balance
      </h2>
      <h1
        className={`text-4xl font-bold mb-6 ${
          balance >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {formatAmount(balance)}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Income
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatAmount(income)}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Expense
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatAmount(expense)}
          </p>
        </div>
      </div>
    </div>
  );
}
