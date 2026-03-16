# 🚀 Quick Start Guide

Get your Financial Planning Dashboard running in 5 minutes!

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "Sans financial model"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Recharts (charting library)
- Framer Motion (animations)
- And more...

**Installation takes 2-3 minutes** depending on your internet connection.

### 3. Start Development Server

```bash
npm run dev
```

You should see:
```
> next dev

▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.5s
```

### 4. Open in Browser

Go to: **[http://localhost:3000](http://localhost:3000)**

🎉 Your dashboard should now be running!

## Using the Dashboard

### Step 1: Enter Your Details

Fill out the financial input form:
- **Age**: Your current age (default: 26)
- **Retirement Age**: Target retirement age (default: 65)
- **Monthly Income**: Your gross monthly income (default: $5,000)
- **Monthly Expenses**: Your monthly spending (default: $2,500)
- **Current Savings**: Amount saved so far (default: $10,000)
- **Expected Annual Return**: Estimated investment return % (default: 7%)

### Step 2: Set Goal Targets

Set your target amounts:
- **Emergency Fund**: 3-6 months expenses (default: $15,000)
- **House Down Payment**: (default: $45,000)
- **Wedding Fund**: (default: $20,000)
- **Car Fund**: (default: $12,000)

### Step 3: Generate Plan

Click **"Generate Financial Plan"** button.

Your personalized dashboard will show:
- ✅ Monthly savings available
- ✅ Budget allocation sliders
- ✅ Pie chart breakdown
- ✅ Savings goal timeline
- ✅ Retirement projections
- ✅ Timeline adjustment controls

### Step 4: Adjust Allocations

Use the sliders to distribute your monthly savings:
- Move sliders left/right to adjust percentages
- Charts update in real-time
- All allocations normalize to 100%

### Step 5: View Projections

**Pie Chart** - See how much goes to each goal monthly

**Savings Goals** - Track progress toward each goal with:
- Target amount
- Monthly contribution needed
- Timeline to reach goal
- Progress bar

**Retirement Projection** - See portfolio growth until retirement:
- Total portfolio value at 65
- Roth IRA balance
- 401(k) balance
- Interactive line chart

### Step 6: Adjust Timeline

Use the bottom slider to compress/expand timelines:
- **Shorter timeline** (1-3 years): Higher monthly savings needed
- **Longer timeline** (5-15 years): Lower monthly savings needed
- All calculations update automatically

## Troubleshooting

### Port 3000 Already in Use

If you get error: `Port 3000 is already in use`

**Option A:** Kill the process on port 3000
```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti :3000 | xargs kill -9
```

**Option B:** Use a different port
```bash
npm run dev -- -p 3001
```
Then open: http://localhost:3001

### Module Not Found Errors

If you see: `Cannot find module 'react'`

**Solution:** 
```bash
npm install
```

Make sure all dependencies are properly installed.

### Slow Performance

If the dashboard loads slowly:

1. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

2. Check your browser - close unused tabs
3. Clear browser cache

### TypeScript Errors in Editor

If VS Code shows red squiggles despite running fine:

1. Click "Command Palette" (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

## Production Build

To create optimized production build:

```bash
npm run build
npm start
```

Then open http://localhost:3000

## Development Tips

### Hot Reload

The app automatically refreshes when you save files - no manual refresh needed!

### Edit Form Values

To change default values in the form, edit:
```
components/FinancialInputForm.tsx → DEFAULT_VALUES
```

### Customize Colors

Edit the gold accent color in:
```
tailwind.config.ts → colors.gold
```

### Change Retirement Age or Return Rate

Edit:
```
lib/financialCalculations.ts → ANNUAL_RETURN (line 1)
```

## File Structure

```
Sans financial model/
├── app/
│   ├── page.tsx              ← Main dashboard
│   ├── layout.tsx            ← App wrapper
│   └── globals.css           ← Global styles
├── components/               ← React components
│   ├── FinancialInputForm.tsx
│   ├── AllocationSliders.tsx
│   ├── PieAllocationChart.tsx
│   ├── SavingsGoalTimeline.tsx
│   ├── RetirementProjection.tsx
│   ├── TimelineAdjustSlider.tsx
│   └── StatCard.tsx
├── lib/
│   ├── financialCalculations.ts  ← Financial math
│   └── helpers.ts                 ← Utilities
├── types/
│   └── financial.ts          ← TypeScript types
├── package.json              ← Dependencies
├── tailwind.config.ts        ← Style config
└── README.md                 ← Full documentation
```

## Common Customizations

### Change Default Age

In `components/FinancialInputForm.tsx`:
```typescript
age: 26, // Change this
```

### Change Goal Targets

In `components/FinancialInputForm.tsx`:
```typescript
emergencyFundTarget: 15000, // Change amounts
houseDownPaymentTarget: 45000,
weddingFundTarget: 20000,
carFundTarget: 12000,
```

### Adjust Investment Return

In `lib/financialCalculations.ts`:
```typescript
const ANNUAL_RETURN = 0.07 // Change from 7%
```

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Try entering different values
5. ✅ Explore all sections
6. 📖 Read full [README.md](./README.md) for details

## Getting Help

- Check the inline code comments - each function is documented
- Review TypeScript types in `types/financial.ts`
- Look at component props and their descriptions
- Consult [Next.js Docs](https://nextjs.org/docs)
- Check [Recharts Examples](https://recharts.org/examples)

## Performance Tips

- The app runs entirely in the browser - no backend needed
- All calculations happen client-side
- Charts are optimized with [Recharts](https://recharts.org/)
- Smooth animations use [Framer Motion](https://www.framer.com/motion/)

---

**Ready to go!** Run `npm install && npm run dev` 🚀
