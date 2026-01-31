# 💰 Expense Tracker

A modern, full-stack expense tracking application built with Next.js 15, Prisma, PostgreSQL, and Clerk authentication.

## Features

- ✅ **User Authentication** - Secure sign-up/sign-in with Clerk
- 💵 **Income & Expense Tracking** - Add, view, and delete transactions
- 📊 **Balance Overview** - Real-time balance calculation with income/expense breakdown
- 🏷️ **Categories** - Organize transactions by categories (Food, Transportation, etc.)
- 📅 **Date Tracking** - Track when transactions occurred
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Server Actions** - Fast server-side operations with Next.js
- 🔒 **Secure** - Protected routes and user-specific data

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Theme:** next-themes for dark mode
- **TypeScript:** Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with:

```env
DATABASE_URL="your-postgresql-database-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma Client:

```bash
npx prisma generate
```

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### User Model

- `id` - Unique identifier
- `clerkUserId` - Clerk user ID
- `email` - User email
- `name` - User name
- `imageUrl` - Profile image URL
- `Records` - Related transactions

### Record Model

- `id` - Unique identifier
- `amount` - Transaction amount (positive for income, negative for expenses)
- `text` - Transaction description
- `category` - Transaction category
- `date` - Transaction date
- `userId` - Associated user

## Features Overview

### Dashboard

- View current balance
- See total income and expenses
- Add new transactions
- View transaction history
- Delete transactions

### Transactions

- Income/Expense toggle
- Category selection
- Date picker
- Real-time updates

### Authentication

- Sign up with email
- Sign in with multiple providers
- Secure session management
- User profile management

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
my-app/
├── app/
│   ├── dashboard/         # Dashboard page
│   ├── profile/           # User profile page
│   ├── sign-in/          # Sign in page
│   ├── sign-up/          # Sign up page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── AddTransaction.tsx    # Add transaction form
│   ├── Balance.tsx          # Balance display
│   ├── Navbar.tsx           # Server navbar wrapper
│   ├── NavbarClient.tsx     # Client navbar component
│   └── TransactionList.tsx  # Transaction list
├── lib/
│   ├── actions.ts        # Server actions
│   ├── checkUser.ts      # User verification
│   └── db.ts            # Prisma client
├── prisma/
│   └── schema.prisma     # Database schema
└── middleware.ts         # Clerk middleware
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Author

Built with ❤️ using Next.js and Prisma
