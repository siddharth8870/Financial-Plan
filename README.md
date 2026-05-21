# Financial Planning Dashboard

A modern, interactive financial planning web application built with Next.js 14, TypeScript, TailwindCSS, and Recharts.

## Features

 **Modern Dashboard UI**
- Dark gradient theme with glassmorphism cards
- Smooth animations with Framer Motion
- Responsive design for desktop and tablet
- Real-time chart updates

**Financial Tools**
- Monthly savings calculation
- Budget allocation with interactive sliders
- Pie chart visualization of allocations
- Savings goal tracking with progress indicators
- Retirement projection with compound growth calculations
- Timeline adjustment for goals (1-15 years)

**Dashboard Sections**

1. **Financial Input Form** - Enter your income, expenses, age, and goal targets
2. **Allocation Sliders** - Distribute monthly savings across different goals
3. **Budget Visualization** - Pie chart showing allocation breakdown
4. **Savings Goals** - Track progress toward Emergency Fund, House, Wedding, and Car goals
5. **Retirement Projection** - Line chart showing growth projections to retirement age
6. **Timeline Adjustment** - Adjust goal timelines to recalculate all metrics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + CSS Modules
- **Charts**: Recharts
- **Animations**: Framer Motion
- **UI Components**: Custom components with ShadCN UI patterns
- **Form Handling**: React Hook Form (ready to extend)

## Project Structure

```
financial-planning-dashboard/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── FinancialInputForm.tsx      # Input form component
│   ├── AllocationSliders.tsx       # Budget allocation sliders
│   ├── PieAllocationChart.tsx      # Pie chart visualization
│   ├── SavingsGoalTimeline.tsx     # Goals timeline cards
│   ├── RetirementProjection.tsx    # Retirement projection chart
│   ├── TimelineAdjustSlider.tsx    # Goal timeline adjustment
│   └── StatCard.tsx                # Reusable stat card component
├── lib/
│   ├── financialCalculations.ts    # Core financial logic
│   └── helpers.ts                  # Utility functions
├── types/
│   └── financial.ts                # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to project directory:

```bash
cd "Sans financial model"
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will hot-reload as you make changes.

## Usage

### 1. Enter Your Financial Details

Fill out the form with:
- Current age and retirement age
- Monthly income and expenses
- Current savings and expected annual return
- Goal targets (emergency fund, house, wedding, car)

### 2. Generate Your Plan

Click "Generate Financial Plan" to create your personalized dashboard.

### 3. Adjust Allocations

Use the sliders to distribute your monthly savings across different goals. The charts update in real-time.

### 4. View Retirement Projection

See how your investments will grow until retirement with a detailed line chart showing:
- Total portfolio value
- Roth IRA balance
- 401(k) balance

### 5. Adjust Timeline

Use the bottom slider to compress or expand goal timelines. This will recalculate:
- Monthly savings needed for each goal
- Retirement projections
- Overall financial plan

## Financial Calculations

### Monthly Savings
```
Monthly Savings = Monthly Income - Monthly Expenses
```

### Allocation Split
Allocations are normalized to sum to 100% of monthly savings.

### Goal Timeline
```
Months Needed = Goal Target / Monthly Contribution
Years Needed = Months Needed / 12
```

### Retirement Projection
Uses compound growth formula with 7% average annual return:
```
FutureValue = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
```

Where:
- PV = Present Value (current savings)
- PMT = Monthly contribution
- r = Monthly interest rate (annual rate / 12)
- n = Number of months until retirement

## Customization

### Change Colors

Edit `tailwind.config.ts` to customize the gold accent color:

```typescript
colors: {
  gold: '#C9A96E', // Change this
}
```

### Modify Goals

Edit the default goals in `components/FinancialInputForm.tsx`:

```typescript
const DEFAULT_VALUES: FinancialInput = {
  emergencyFundTarget: 15000, // Change goal amounts
  // ...
}
```

### Adjust Average Return Rate

Edit `lib/financialCalculations.ts`:

```typescript
const ANNUAL_RETURN = 0.07 // Change from 7%
```

## Building for Production

```bash
npm run build
npm start
```

## Performance Optimizations

- ✅ Server-side rendering with Next.js
- ✅ Client-side calculations with memoization
- ✅ Lazy-loaded components
- ✅ CSS-in-JS with TailwindCSS
- ✅ Optimized animations with Framer Motion

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

- [ ] Backend API for saving user data
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Multiple plan scenarios
- [ ] PDF export
- [ ] Email reports
- [ ] AI-powered recommendations
- [ ] Tax optimization calculations
- [ ] Investment allocation suggestions

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

For questions or issues, please check the code comments and TypeScript types for detailed explanations of each function.

---

Built with  using Next.js and TailwindCSS
npm run dev
```
This will start the Vite dev server at `http://localhost:3000`

#### Option 2: Production Build
```bash
npm run build
npm run preview
```

#### Option 3: With Backend AI Service
```bash
# Terminal 1: Start the backend server
npm run server
# Server runs on http://localhost:5000

# Terminal 2: Start the frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## Features

### Financial Planning
- **Income Analysis**: Calculates net income based on gross salary, taxes, and state-specific rates
- **Budget Allocation**: Intelligent allocation of monthly income across:
  - Retirement (401k + IRA)
  - Emergency Fund
  - Daily Living Expenses
  - Subscriptions & Insurance
  - Personal Goals
  - Entertainment & Leisure

### Goal Selection
Choose from materialistic goals including:
- **House**: Down payment, EMI, maintenance, furnishings
- **Car**: Purchase, insurance, maintenance
- **Travel**: Quarterly, semi-annual, or annual trips
- **Personal**: Wedding, education, health, hobbies
- **Lifestyle**: Dining, shopping, tech & gadgets

### Visualization
- **Pie Chart**: Visual breakdown of monthly allocation
- **Bar Chart**: Horizontal bar chart showing allocation amounts
- **Interactive Sliders**: Adjust allocations in real-time

### Tax Calculation
Supports state-specific tax calculations for:
- CA (California): 9.3% state tax
- TX, FL, WA: 0% state tax
- NY: 6.5% state tax
- MA: 5% state tax
- IL: 4.5% state tax
- CO: 4% state tax
- OR: 9.9% state tax
- And more with default 5% fallback

## AI Integration

The application includes a backend service for AI-powered recommendations:

### API Endpoints

1. **POST /api/ai/recommendations**
   - Gets personalized financial recommendations
   - Body: `{ salary, location, retirementGoal, goals, allocations }`

2. **POST /api/ai/insights**
   - Generates financial insights
   - Body: `{ goals, income, currentAge }`

3. **POST /api/ai/analyze**
   - Analyzes allocations and goals
   - Body: `{ allocations, goals }`

4. **GET /api/health**
   - Health check endpoint

### Setting Up Real AI (Optional)

The `server.js` file includes a placeholder `getAIResponse()` function. To integrate with a real AI service:

1. **OpenAI Integration:**
   ```javascript
   // In server.js
   const OpenAI = require('openai');
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });
   
   async function getAIResponse(prompt) {
     const response = await openai.chat.completions.create({
       model: "gpt-3.5-turbo",
       messages: [{ role: "user", content: prompt }],
     });
     return { recommendation: response.choices[0].message.content };
   }
   ```

2. **Anthropic Claude Integration:**
   ```javascript
   const Anthropic = require("@anthropic-ai/sdk");
   const client = new Anthropic();
   
   async function getAIResponse(prompt) {
     const response = await client.messages.create({
       model: "claude-3-sonnet-20240229",
       max_tokens: 1024,
       messages: [{ role: "user", content: prompt }],
     });
     return { recommendation: response.content[0].text };
   }
   ```

3. **Set up environment variables in `.env`:**
   ```
   OPENAI_API_KEY=your_key_here
   PORT=5000
   ```

## Financial Calculations

### Net Income Calculation
1. **Gross Annual**: Your starting salary
2. **Federal Tax**: Based on 2025 tax brackets
3. **FICA**: 7.65% (6.2% Social Security + 1.45% Medicare)
4. **State Tax**: Varies by location
5. **Insurance**: $100/paycheck deduction
6. **Net Monthly**: (Gross - Total Tax - Insurance) / 12

### Allocation Strategy
- **26% - Invest & Grow**: 401k + Roth IRA + Brokerage
- **36% - Save for Goals**: House, wedding, car, emergency fund
- **38% - Daily Living + Buffer**: Food, transport, utilities, entertainment

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Charts**: Chart.js 4.4.0 (CDN)
- **Backend**: Express.js
- **Styling**: Inline CSS with dark theme
- **Build Tool**: Vite

## File Descriptions

### Core Files
- **finances.jsx**: Main React component containing all UI logic, state management, and chart components
- **index.html**: HTML entry point with Chart.js CDN integration
- **server.js**: Express backend for AI service integration

### Components (in finances.jsx)
- `FinancialPlannerApp`: Main component managing form and results views
- `AllocationPieChart`: Renders pie chart of allocation breakdown
- `AllocationBarChart`: Renders horizontal bar chart

### Utilities
- **calculations.js**: Financial calculation functions (`calculateNetIncome`, `generateAllocation`)
- **aiService.js**: Functions for AI service communication
- **constants.js**: Application-wide constants (if used)

## Styling

The application uses a sophisticated dark theme with gold accents:
- Primary Color: #C9A96E (Gold)
- Dark Background: #0D0D0D to #1A1A1A
- Text Color: #F5F0E8 (Light cream)
- Accent Colors: Various shades for different categories

## Troubleshooting

### Issue: "Cannot find module 'Chart.js'"
**Solution**: Make sure Chart.js is loaded from CDN in index.html. The script is already included.

### Issue: Chart not rendering
**Solution**: Ensure Chart.js CDN link is properly loaded before the React component renders.

### Issue: AI service not responding
**Solution**: 
1. Make sure server.js is running on port 5000
2. Check that CORS is enabled in server.js
3. Verify the API endpoint URL in aiService.js

### Issue: Blank webpage
**Solution**:
1. Check browser console for errors (F12)
2. Verify React DOM is properly loaded
3. Ensure `#root` div exists in index.html
4. Check that finances.jsx is being loaded correctly

## Future Enhancements

- [ ] Real database integration for saving user profiles
- [ ] Authentication system for user accounts
- [ ] Advanced charts and financial projections
- [ ] Goal milestone tracking
- [ ] Savings calculator with compound interest
- [ ] Investment portfolio recommendations
- [ ] Mobile app version
- [ ] Integration with real financial APIs (Plaid, etc.)

##  License

MIT License - Feel free to use and modify for your projects.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For questions or issues, please open an issue in the repository.

---

**Happy Planning!**
