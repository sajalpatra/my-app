"use client";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

export default function NavbarClient({ user }: { user: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const centerLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const authLinks = user
    ? [{ name: "Profile", href: "/profile", gradient: false }]
    : [
        { name: "Sign In", href: "/sign-in", gradient: true },
        { name: "Sign Up", href: "/sign-up", gradient: true },
      ];

  const gradientText =
    "hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-green-400 via-blue-500 to-green-600 dark:from-green-300 dark:via-blue-400 dark:to-green-500 bg-clip-text text-transparent";

  const normalText =
    "text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-green-600 dark:from-green-300 dark:via-blue-400 dark:to-green-500 bg-clip-text text-transparent"
            >
              💰 Expense Tracker
            </Link>
          </div>

          {/* Center - Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {centerLinks.map((link) => (
              <Link key={link.name} href={link.href} className={gradientText}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right - Auth Buttons + Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={link.gradient ? gradientText : normalText}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <SignOutButton>
                <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            )}

            {/* 🌙/☀️ Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-800" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[...centerLinks, ...authLinks].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <SignOutButton>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-800 dark:text-gray-200 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </SignOutButton>
            )}

            {/* Dark Mode Toggle in mobile */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-2 w-full text-left px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium flex items-center space-x-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-800">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-gray-800" />
                  <span className="text-gray-800">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
