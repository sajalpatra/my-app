# Quick Start Guide

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 2. Database Setup

1. Make sure PostgreSQL is running
2. Create a database:

   ```sql
   CREATE DATABASE expense_tracker;
   ```

3. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

4. (Optional) Open Prisma Studio to view data:
   ```bash
   npx prisma studio
   ```

### 3. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys to the `.env` file
4. Enable email/password authentication in Clerk dashboard
5. (Optional) Configure social login providers

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features to Test

1. **Landing Page** - Visit home page to see features
2. **Sign Up** - Create a new account
3. **Dashboard** - View your balance and transactions
4. **Add Income** - Add a positive transaction
5. **Add Expense** - Add a negative transaction
6. **Categories** - Try different categories
7. **Delete** - Remove a transaction
8. **Dark Mode** - Toggle theme in navbar
9. **Profile** - Update your profile settings

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists
- Run `npx prisma migrate reset` to reset database

### Clerk Authentication Issues

- Verify API keys are correct
- Check if keys are prefixed correctly (NEXT*PUBLIC* for publishable key)
- Restart dev server after changing .env

### Build Errors

- Clear `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Delete `node_modules` and reinstall: `npm install`
- Regenerate Prisma Client: `npx prisma generate`

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database

- Use a managed PostgreSQL service (Supabase, Neon, Railway, etc.)
- Update DATABASE_URL with production connection string

### Clerk

- Update Clerk dashboard with production domain
- Use production API keys in Vercel environment variables

## Next Steps

- Add charts and visualizations
- Add budget tracking
- Add expense categories management
- Add recurring transactions
- Add export to CSV
- Add filters and search
- Add multi-currency support
