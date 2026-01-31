# 🤖 AI Features Guide

## AI-Powered Expense Tracker

This expense tracker now includes powerful AI features powered by **Groq** and **Llama 4** models!

### 🚀 Features Implemented

#### 1. **Smart Auto-Categorization** 🎯
- Automatically suggests categories based on transaction descriptions
- Learns from your transaction history for better predictions
- Shows AI confidence level
- Toggle AI on/off per transaction

**How to use:**
- When adding a transaction, enable "AI On" toggle
- Select "🤖 Auto (AI will suggest)" in the category dropdown
- AI will analyze the description and assign the best category

#### 2. **Natural Language Transaction Input** 💬
- Add transactions using plain English
- No need to fill forms manually
- Supports dates, amounts, and descriptions

**Examples:**
```
"Spent $45 on groceries at Walmart yesterday"
"Got paid $2000 salary today"
"$30 for Uber rides last Friday"
"Bought coffee for $5.50"
```

**How to use:**
- Click "Quick Add with AI" button in Add Transaction card
- Type your transaction in plain English
- Click "Parse" - AI fills the form automatically

#### 3. **AI Budget Recommendations** 💰
- Get personalized budget suggestions based on your spending history
- Analyzes last 3 months of expenses per category
- Provides reasoning for each recommendation

**How to use:**
- Go to Budget Tracker section
- Click "AI Suggest" button
- Review AI-generated recommendations
- Click "Apply" to set budget for any category

#### 4. **AI Financial Coach** 🧠
- Personalized financial insights based on YOUR data
- Analyzes spending patterns, trends, and budgets
- Provides actionable advice
- Shows savings rate and spending trends

**How to use:**
- Find "AI Financial Coach" card on dashboard
- Click "Get AI Insights"
- Read personalized recommendations
- Refresh anytime for updated insights

### 📋 Setup Instructions

#### 1. Get Groq API Key
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Copy the key

#### 2. Add API Key to Environment
Add to your `.env` file:
```env
GROQ_API_KEY="gsk_your_api_key_here"
```

#### 3. Run Database Migration
```bash
npm run prisma:migrate
```

#### 4. Start Development Server
```bash
npm run dev
```

### 🧪 AI Models Used

- **Model**: `meta-llama/llama-4-scout-17b-16e-instruct`
- **Provider**: Groq (Ultra-fast inference)
- **Cost**: Free tier available (14,400 requests/day)

### 🎨 UI Enhancements

- Purple gradient buttons for AI features
- Sparkle (✨) icons indicate AI-powered features
- Loading states with spinners
- Success notifications for AI suggestions
- Color-coded insights and recommendations

### 📊 Database Schema Updates

New fields added to `Record` model:
- `aiSuggestedCategory`: AI's suggested category
- `aiConfidence`: Confidence score (0-1)

### 🔧 Technical Stack

- **AI Service**: `lib/aiService.ts` - Core AI functions
- **Actions**: `lib/aiActions.ts` - Server actions for AI features
- **SDK**: `groq-sdk` - Official Groq SDK
- **Validation**: `zod` - Schema validation
- **Dates**: `date-fns` - Date utilities

### 💡 Tips for Best Results

1. **Categorization**: Be descriptive in transaction descriptions
   - ❌ "Purchase"
   - ✅ "Groceries at Walmart"

2. **Natural Language**: Include key details
   - Amount, description, date
   - Use common phrases

3. **Budget AI**: Need at least 2-3 months of transaction history

4. **Insights**: More transactions = better AI insights

### 🚦 Feature Status

| Feature | Status | Location |
|---------|--------|----------|
| Auto-Categorization | ✅ Ready | Add Transaction |
| Natural Language Input | ✅ Ready | Add Transaction |
| Budget Recommendations | ✅ Ready | Budget Tracker |
| AI Financial Coach | ✅ Ready | Dashboard |

### 🔐 Privacy & Security

- All AI processing happens server-side
- Your data is only sent to Groq for analysis
- No data is stored by Groq (per their privacy policy)
- API keys are kept secure in environment variables

### 📈 Future Enhancements (Planned)

- [ ] Receipt OCR scanning
- [ ] Recurring transaction detection
- [ ] Spending predictions
- [ ] Anomaly detection & alerts
- [ ] Goal-based savings optimizer
- [ ] Chat interface with AI advisor

### 🐛 Troubleshooting

**AI features not working?**
1. Check `.env` file has `GROQ_API_KEY`
2. Verify API key is valid at console.groq.com
3. Check browser console for errors
4. Ensure you have transaction history (for some features)

**"Could not parse transaction" error?**
- Try simpler phrasing
- Include amount with $ symbol
- Specify relative dates (today, yesterday)

**No budget recommendations?**
- Need at least 1 month of expense data
- Transactions must have categories assigned

### 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Llama 4 Model Card](https://groq.com/models/)
- [API Limits](https://console.groq.com/docs/rate-limits)

---

**Enjoy your AI-powered expense tracking! 🎉**
