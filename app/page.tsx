import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, DollarSign, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-green-600 bg-clip-text text-transparent">
              Finances
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your income and expenses effortlessly. Make smarter financial
            decisions with our intuitive expense tracker.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg transition-all border border-gray-200 dark:border-gray-700"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Easy Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Add and categorize your income and expenses with just a few clicks
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Visual Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              See your financial overview at a glance with clear balance display
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your financial data is encrypted and protected with
              enterprise-grade security
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built with Next.js for blazing fast performance and seamless
              experience
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-24 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already taking control of their
              finances
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
