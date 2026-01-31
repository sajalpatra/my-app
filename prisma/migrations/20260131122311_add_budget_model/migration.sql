-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Budget_userId_idx" ON "public"."Budget"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_category_month_year_key" ON "public"."Budget"("userId", "category", "month", "year");

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
