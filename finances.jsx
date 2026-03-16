import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// ─── TAX CALCULATION ───────────────────────────────────────────────────────────
function calculateNetIncome(grossAnnual, state = "CA") {
  // Simplified tax calculation
  const INSURANCE_PER_PAYCHECK = 100;
  const PAYCHECKS_PER_YEAR = 26;
  const INSURANCE_ANNUAL = INSURANCE_PER_PAYCHECK * PAYCHECKS_PER_YEAR;

  // Federal tax
  const TAXABLE_INCOME = grossAnnual - 15000;
  const FEDERAL_TAX =
    1192.5 +
    Math.max(0, Math.min(TAXABLE_INCOME - 11925, 36550) * 0.12) +
    Math.max(0, (TAXABLE_INCOME - 48475) * 0.22);
  const FICA = grossAnnual * 0.062 + grossAnnual * 0.0145;

  // State tax varies by state
  const stateTaxRates = {
    CA: 0.093,
    TX: 0,
    FL: 0,
    NY: 0.065,
    MA: 0.05,
    IL: 0.045,
    WA: 0,
    CO: 0.04,
    OR: 0.099,
    default: 0.05,
  };
  const STATE_TAX = grossAnnual * (stateTaxRates[state] || stateTaxRates.default);

  const TOTAL_TAX = FEDERAL_TAX + FICA + STATE_TAX;
  const NET_ANNUAL = grossAnnual - TOTAL_TAX - INSURANCE_ANNUAL;
  return Math.round(NET_ANNUAL / 12);
}

// ─── MATERIALISTIC GOALS OPTIONS ───────────────────────────────────────────────
const MATERIALISTIC_OPTIONS = [
  {
    category: "House",
    icon: "🏡",
    subcategories: [
      { label: "Down Payment", value: "house_down" },
      { label: "EMI (Monthly Payments)", value: "house_emi" },
      { label: "Maintenance & Repairs", value: "house_maintenance" },
      { label: "Furnishings & Decor", value: "house_furnish" },
    ],
  },
  {
    category: "Car",
    icon: "🚗",
    subcategories: [
      { label: "Down Payment/Purchase", value: "car_purchase" },
      { label: "Insurance & Maintenance", value: "car_maintenance" },
    ],
  },
  {
    category: "Travel",
    icon: "✈️",
    subcategories: [
      { label: "Travel Quarterly (4x/year)", value: "travel_quarterly" },
      { label: "Travel Semi-Annually (2x/year)", value: "travel_semi" },
      { label: "Travel Annually (1x/year)", value: "travel_annual" },
      { label: "Vacation Fund", value: "vacation_fund" },
    ],
  },
  {
    category: "Personal",
    icon: "💎",
    subcategories: [
      { label: "Wedding/Engagement", value: "wedding" },
      { label: "Education & Skills", value: "education" },
      { label: "Health & Wellness", value: "health" },
      { label: "Hobbies & Recreation", value: "hobbies" },
    ],
  },
  {
    category: "Lifestyle",
    icon: "🎯",
    subcategories: [
      { label: "Dining & Entertainment", value: "dining" },
      { label: "Shopping & Fashion", value: "shopping" },
      { label: "Tech & Gadgets", value: "tech" },
    ],
  },
];

const RETIREMENT_GOALS = [
  { label: "Modest Retirement (Basic Living)", value: "modest" },
  { label: "Comfortable Retirement (Good Lifestyle)", value: "comfortable" },
  { label: "Luxury Retirement (Premium Lifestyle)", value: "luxury" },
  { label: "I Don't Know - Plan for Me", value: "idk" },
];
// ─── RETIREMENT PROJECTION ────────────────────────────────────────────────────
function calculateRetirementProjection(netMonthly, currentAge = 26, retirementAge = 65) {
  const yearsToRetirement = retirementAge - currentAge;
  const annualAvgReturn = 0.07; // 7% average annual return
  
  // Monthly contributions
  const retirementMonthly401k = netMonthly * 0.13; // 13% to 401k
  const retirementMonthlyRoth = Math.min(netMonthly * 0.10, 583.33); // Max ~$7,000/year to Roth IRA
  
  let balance401k = 0;
  let balanceRoth = 0;
  
  // Project growth month by month
  const monthlyReturn = Math.pow(1 + annualAvgReturn, 1/12) - 1;
  
  for (let month = 0; month < yearsToRetirement * 12; month++) {
    balance401k = (balance401k * (1 + monthlyReturn)) + retirementMonthly401k;
    balanceRoth = (balanceRoth * (1 + monthlyReturn)) + retirementMonthlyRoth;
  }
  
  const totalAtRetirement = balance401k + balanceRoth;
  
  return {
    total: Math.round(totalAtRetirement),
    roth: Math.round(balanceRoth),
    fourOhOneK: Math.round(balance401k),
    yearsToRetirement,
  };
}

// ─── SAVINGS GOAL PROJECTION ──────────────────────────────────────────────────
function calculateSavingsGoals(netMonthly, allocations) {
  const goals = [
    {
      name: "Emergency fund",
      target: 15000,
      icon: "🛡️",
      color: "#5B8A72",
      description: "$386/mo · 3-3 yrs",
    },
    {
      name: "House down payment",
      target: 45000,
      icon: "🏡",
      color: "#C9A96E",
      description: "$926/mo · 4.1 yrs",
    },
    {
      name: "Wedding fund",
      target: 20000,
      icon: "💍",
      color: "#A67C9B",
      description: "$579/mo · 2.9 yrs",
    },
    {
      name: "Car fund",
      target: 12000,
      icon: "🚗",
      color: "#7B9BB5",
      description: "$174/mo · 5.8 yrs",
    },
  ];
  
  return goals.map(goal => {
    // Find corresponding allocation or use default
    const monthlyAllocation = allocations[goal.name] || goal.target / 48;
    const monthsToGoal = goal.target / (monthlyAllocation || 500);
    const yearsToGoal = (monthsToGoal / 12).toFixed(1);
    
    return {
      ...goal,
      monthly: monthlyAllocation,
      monthsNeeded: Math.ceil(monthsToGoal),
      yearsNeeded: yearsToGoal,
      progress: Math.min((monthlyAllocation * 12) / goal.target * 100, 100),
    };
  });
}
// ─── ALLOCATION LOGIC ───────────────────────────────────────────────────────────
function generateAllocation(grossAnnual, retirementGoal, goals, location) {
  const netMonthly = calculateNetIncome(grossAnnual, location);
  const netAnnual = netMonthly * 12;

  let allocations = {};

  // Base allocation
  allocations["Retirement (401k + IRA)"] = netMonthly * 0.20;
  allocations["Emergency Fund"] = netMonthly * 0.10;
  allocations["Daily Living (Food, Transport, Utilities)"] = netMonthly * 0.25;
  allocations["Subscriptions & Insurance"] = netMonthly * 0.05;

  // Calculate remaining
  let remaining = netMonthly - Object.values(allocations).reduce((a, b) => a + b, 0);

  // Allocate to selected goals
  const materialisticCount = goals.length;

  if (materialisticCount === 0 && retirementGoal !== "idk") {
    allocations["Flexible Savings & Investments"] = remaining * 0.4;
    allocations["Entertainment & Leisure"] = remaining * 0.6;
  } else if (materialisticCount > 0) {
    const goalShare = remaining * 0.55;
    const perGoal = goalShare / materialisticCount;
    goals.forEach((goal) => {
      allocations[goal] = perGoal;
    });
    allocations["Entertainment & Leisure"] = remaining * 0.45;
  }

  // Check if retirement goal is too ambitious
  let warning = "";
  if (retirementGoal === "luxury" && grossAnnual < 100000) {
    warning = "⚠️ Luxury retirement may not be sustainable at your current income level. Consider a comfortable retirement goal instead.";
  }

  return { allocations, netMonthly, warning };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "40px",
  color: "#F5F0E8",
};

const formContainerStyle = {
  background: "#1A1A1A",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "30px",
  marginBottom: "30px",
};

const formGroupStyle = {
  marginBottom: "25px",
};

const labelStyle = {
  display: "block",
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "10px",
  color: "#C9A96E",
};

const selectStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#0D0D0D",
  color: "#F5F0E8",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#0D0D0D",
  color: "#F5F0E8",
};

const multiSelectStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
  marginTop: "10px",
};

const checkboxContainerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  background: "#0D0D0D",
  border: "1px solid #444",
  borderRadius: "6px",
  cursor: "pointer",
};

const buttonStyle = {
  background: "#C9A96E",
  color: "#0D0D0D",
  padding: "12px 30px",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px",
  transition: "all 0.3s",
};

const resultContainerStyle = {
  background: "#1A1A1A",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "30px",
  marginBottom: "30px",
};

const chartsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px",
  marginBottom: "30px",
};

const chartStyle = {
  background: "#0D0D0D",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
};

const sliderContainerStyle = {
  marginBottom: "20px",
  padding: "15px",
  background: "#0D0D0D",
  borderRadius: "8px",
  border: "1px solid #333",
};

const sliderLabelStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  color: "#C9A96E",
  fontWeight: "600",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FinancialPlannerApp() {
  const [step, setStep] = useState("form"); // "form" or "results"
  const [retirementGoal, setRetirementGoal] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [allocations, setAllocations] = useState(null);
  const [netMonthly, setNetMonthly] = useState(0);
  const [warning, setWarning] = useState("");
  const [sliderValues, setSliderValues] = useState({});
  const [goalTimelines, setGoalTimelines] = useState({});

  const handleGoalToggle = (goalValue) => {
    setSelectedGoals((prev) =>
      prev.includes(goalValue) ? prev.filter((g) => g !== goalValue) : [...prev, goalValue]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!salary || !location || !retirementGoal) {
      alert("Please fill all required fields");
      return;
    }

    const salaryNum = parseFloat(salary);
    const { allocations: alloc, netMonthly: nm, warning: warn } = generateAllocation(
      salaryNum,
      retirementGoal,
      selectedGoals,
      location
    );

    setAllocations(alloc);
    setNetMonthly(nm);
    setWarning(warn);

    // Initialize slider values
    const initialSliders = {};
    Object.keys(alloc).forEach((key) => {
      initialSliders[key] = alloc[key];
    });
    setSliderValues(initialSliders);

    // Initialize goal timelines
    const savingsGoals = calculateSavingsGoals(nm, initialSliders);
    const timelines = {};
    savingsGoals.forEach(goal => {
      timelines[goal.name] = parseFloat(goal.yearsNeeded);
    });
    setGoalTimelines(timelines);

    setStep("results");
  };

  const handleSliderChange = (label, newValue) => {
    setSliderValues((prev) => ({
      ...prev,
      [label]: Math.max(0, newValue),
    }));
  };

  // ─── FORM VIEW ───────────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1>💰 Financial Planning Tool</h1>
          <p>Answer a few questions to get your personalized financial plan</p>
        </div>

        <form onSubmit={handleSubmit} style={formContainerStyle}>
          {/* Question 1: Retirement Goal */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>1. What is your goal at retirement (age 60)?</label>
            <select
              style={selectStyle}
              value={retirementGoal}
              onChange={(e) => setRetirementGoal(e.target.value)}
            >
              <option value="">-- Select an option --</option>
              {RETIREMENT_GOALS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2: Materialistic Goals */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>2. What are your materialistic goals? (Select all that apply)</label>
            <div style={multiSelectStyle}>
              {MATERIALISTIC_OPTIONS.map((category) => (
                <div key={category.category}>
                  <p style={{ color: "#C9A96E", fontWeight: "600", marginBottom: "10px" }}>
                    {category.icon} {category.category}
                  </p>
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.value}
                      style={{
                        ...checkboxContainerStyle,
                        background: selectedGoals.includes(sub.value) ? "#333" : "#0D0D0D",
                      }}
                      onClick={() => handleGoalToggle(sub.value)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(sub.value)}
                        onChange={() => {}}
                        style={{
                          marginRight: "10px",
                          cursor: "pointer",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <label style={{ cursor: "pointer", flex: 1 }}>{sub.label}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Question 3: Current Salary */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>3. What is your current salary (USD per annum)?</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g., 75000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          {/* Question 4: Location */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>4. Where do you live? (State/Region)</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="e.g., California, TX, Florida"
              value={location}
              onChange={(e) => setLocation(e.target.value.toUpperCase())}
            />
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              width: "100%",
              padding: "15px",
              fontSize: "18px",
            }}
            onMouseOver={(e) => (e.target.style.background = "#D4A574")}
            onMouseOut={(e) => (e.target.style.background = "#C9A96E")}
          >
            Generate My Financial Plan 🎯
          </button>
        </form>
      </div>
    );
  }

  // ─── RESULTS VIEW ───────────────────────────────────────────────────────────
  const totalAllocated = Object.values(sliderValues).reduce((a, b) => a + b, 0);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>📊 Your Financial Plan</h1>
        <p>Monthly Net Income: <strong>${netMonthly.toLocaleString()}</strong></p>
        {warning && <p style={{ color: "#FF6B6B", marginTop: "10px" }}>{warning}</p>}
      </div>

      <button
        onClick={() => {
          setStep("form");
          setRetirementGoal("");
          setSelectedGoals([]);
          setSalary("");
          setLocation("");
        }}
        style={{
          ...buttonStyle,
          marginBottom: "20px",
          background: "#666",
        }}
      >
        ← Back to Form
      </button>

      {/* Charts */}
      <div style={chartsContainerStyle}>
        {/* Pie Chart */}
        <AllocationPieChart data={sliderValues} />

        {/* Bar Chart */}
        <AllocationBarChart data={sliderValues} netMonthly={netMonthly} />
      </div>

      {/* Sliders for Adjustment */}
      <div style={resultContainerStyle}>
        <h2 style={{ color: "#C9A96E", marginBottom: "20px" }}>Adjust Your Allocation</h2>
        {Object.entries(sliderValues).map(([label, value]) => (
          <div key={label} style={sliderContainerStyle}>
            <div style={sliderLabelStyle}>
              <span>{label}</span>
              <span>${Math.round(value).toLocaleString()}/month</span>
            </div>
            <input
              type="range"
              min="0"
              max={netMonthly}
              step="50"
              value={Math.round(value)}
              onChange={(e) => handleSliderChange(label, parseFloat(e.target.value))}
              style={{
                width: "100%",
                cursor: "pointer",
                accentColor: "#C9A96E",
              }}
            />
            <div
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "5px",
              }}
            >
              {Math.round((value / netMonthly) * 100)}% of monthly income
            </div>
          </div>
        ))}
        <div
          style={{
            background: "#0D0D0D",
            padding: "15px",
            borderRadius: "6px",
            marginTop: "20px",
            border: totalAllocated > netMonthly ? "2px solid #FF6B6B" : "1px solid #333",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Allocated:</span>
            <span style={{ color: totalAllocated > netMonthly ? "#FF6B6B" : "#C9A96E", fontWeight: "bold" }}>
              ${Math.round(totalAllocated).toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <span>Remaining:</span>
            <span style={{ color: totalAllocated <= netMonthly ? "#5B8A72" : "#FF6B6B", fontWeight: "bold" }}>
              ${Math.round(netMonthly - totalAllocated).toLocaleString()}
            </span>
          </div>
          {totalAllocated > netMonthly && (
            <p style={{ color: "#FF6B6B", marginTop: "10px", fontSize: "14px" }}>
              ⚠️ Your allocation exceeds your monthly income. Please reduce some categories.
            </p>
          )}
        </div>
      </div>

      {/* Retirement Projection */}
      <RetirementProjectionChart netMonthly={netMonthly} currentAge={26} retirementAge={65} />

      {/* Summary */}
      <div style={resultContainerStyle}>
        <h2 style={{ color: "#C9A96E", marginBottom: "20px" }}>Summary & Recommendations</h2>
        <div style={{ lineHeight: "1.8", color: "#CCC" }}>
          <p>
            ✓ <strong>Monthly Net Income:</strong> ${netMonthly.toLocaleString()}
          </p>
          <p>
            ✓ <strong>Retirement Goal:</strong> {RETIREMENT_GOALS.find((g) => g.value === retirementGoal)?.label}
          </p>
          <p>
            ✓ <strong>Selected Goals:</strong> {selectedGoals.length > 0 ? selectedGoals.join(", ") : "None selected"}
          </p>
          <p style={{ marginTop: "20px", color: "#C9A96E", fontStyle: "italic" }}>
            💡 Tip: Adjust the sliders above to customize your allocation. Ensure you don't exceed your monthly income.
          </p>
        </div>
      </div>

      {/* Savings Goal Timeline */}
      <div style={resultContainerStyle}>
        <h2 style={{ color: "#C9A96E", marginBottom: "20px" }}>💰 Savings Goal Timeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          {calculateSavingsGoals(netMonthly, sliderValues).map((goal) => (
            <div key={goal.name} style={{ background: "#0D0D0D", padding: "20px", borderRadius: "8px", borderLeft: `4px solid ${goal.color}` }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{goal.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#F5F0E8", marginBottom: "4px" }}>{goal.name}</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: goal.color, marginBottom: "8px" }}>${goal.target.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "12px" }}>
                ${Math.round(goal.monthly || 0)}/mo · {goal.yearsNeeded} yrs
              </div>
              <div style={{ background: "#1A1A1A", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    background: goal.color,
                    height: "100%",
                    width: `${goal.progress || 0}%`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ color: "#C9A96E", marginBottom: "15px", fontSize: "16px" }}>📊 Adjust Goal Timeline</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {calculateSavingsGoals(netMonthly, sliderValues).map((goal) => (
            <div key={`slide-${goal.name}`} style={sliderContainerStyle}>
              <div style={sliderLabelStyle}>
                <span>{goal.name}</span>
                <span style={{ color: goal.color }}>${Math.round(goal.target).toLocaleString()} target</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={goalTimelines[goal.name] || goal.yearsNeeded}
                  onChange={(e) => {
                    setGoalTimelines(prev => ({
                      ...prev,
                      [goal.name]: parseFloat(e.target.value)
                    }));
                  }}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    accentColor: goal.color,
                  }}
                />
                <div style={{ minWidth: "70px", textAlign: "right", fontSize: "14px", fontWeight: "bold", color: goal.color }}>
                  {(goalTimelines[goal.name] || goal.yearsNeeded).toFixed(1)} yrs
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "#999" }}>
                Monthly needed: ${Math.round(goal.target / ((goalTimelines[goal.name] || goal.yearsNeeded) * 12)).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "15px", background: "#0F1A0F", borderRadius: "6px", border: "1px solid #1A3A1A" }}>
          <div style={{ fontSize: "12px", color: "#5B8A72", fontWeight: "bold", marginBottom: "8px" }}>💡 Smart Tip</div>
          <div style={{ fontSize: "12px", color: "#5A7A5A", lineHeight: 1.6 }}>
            Adjust the sliders to see how different timelines affect your required monthly savings. Shorter timelines require higher monthly contributions, while longer ones allow smaller monthly amounts.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PIE CHART COMPONENT ───────────────────────────────────────────────────────
function AllocationPieChart({ data }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const labels = Object.keys(data);
    const values = Object.values(data).map((v) => Math.round(v));

    const colors = [
      "#C9A96E",
      "#B8860B",
      "#5B8A72",
      "#7B9BB5",
      "#A67C9B",
      "#D4845A",
      "#6B8E8E",
      "#8B7355",
      "#9B8EA0",
      "#7A7A7A",
      "#5A5A5A",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Check if Chart is available from CDN
    if (typeof Chart === "undefined") {
      console.error("Chart.js not loaded");
      return;
    }

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: "#0D0D0D",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#F5F0E8",
              font: { size: 12 },
            },
          },
          title: {
            display: true,
            text: "Allocation by Category",
            color: "#C9A96E",
            font: { size: 14, weight: "bold" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />;
}

// ─── BAR CHART COMPONENT ───────────────────────────────────────────────────────
function AllocationBarChart({ data, netMonthly }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const labels = Object.keys(data);
    const values = Object.values(data).map((v) => Math.round(v));

    const colors = [
      "#C9A96E",
      "#B8860B",
      "#5B8A72",
      "#7B9BB5",
      "#A67C9B",
      "#D4845A",
      "#6B8E8E",
      "#8B7355",
      "#9B8EA0",
      "#7A7A7A",
      "#5A5A5A",
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
    ];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js not loaded");
      return;
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Amount ($)",
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: "#F5F0E8",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#F5F0E8", font: { size: 12 } },
          },
          title: {
            display: true,
            text: "Monthly Allocation Breakdown",
            color: "#C9A96E",
            font: { size: 14, weight: "bold" },
          },
        },
        scales: {
          x: {
            ticks: { color: "#F5F0E8" },
            grid: { color: "#333" },
            max: netMonthly,
          },
          y: {
            ticks: { color: "#F5F0E8", font: { size: 11 } },
            grid: { color: "#333" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, netMonthly]);

  return <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />;
}

// ─── RETIREMENT PROJECTION CHART ───────────────────────────────────────────────
function RetirementProjectionChart({ netMonthly, currentAge = 26, retirementAge = 65 }) {
  const canvasRef = React.useRef(null);
  const chartRef = React.useRef(null);
  
  const projection = calculateRetirementProjection(netMonthly, currentAge, retirementAge);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const years = [];
    const total401k = [];
    const totalRoth = [];
    const totalCombined = [];

    const monthlyReturn = Math.pow(1.07, 1 / 12) - 1;
    let balance401k = 0;
    let balanceRoth = 0;
    const retirementMonthly401k = netMonthly * 0.13;
    const retirementMonthlyRoth = Math.min(netMonthly * 0.10, 583.33);

    for (let age = currentAge; age <= retirementAge; age += 1) {
      // Project 12 months at a time
      for (let month = 0; month < 12; month++) {
        balance401k = balance401k * (1 + monthlyReturn) + retirementMonthly401k;
        balanceRoth = balanceRoth * (1 + monthlyReturn) + retirementMonthlyRoth;
      }
      years.push(age);
      total401k.push(Math.round(balance401k / 1000));
      totalRoth.push(Math.round(balanceRoth / 1000));
      totalCombined.push(Math.round((balance401k + balanceRoth) / 1000));
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js not loaded");
      return;
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Total",
            data: totalCombined,
            borderColor: "#C9A96E",
            backgroundColor: "rgba(201, 169, 110, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Roth IRA",
            data: totalRoth,
            borderColor: "#5B8A72",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
          },
          {
            label: "401(k)",
            data: total401k,
            borderColor: "#7B9BB5",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: "#F5F0E8",
              font: { size: 12 },
            },
          },
          title: {
            display: true,
            text: `Retirement Projection — Age ${currentAge} > ${retirementAge} at 7% Avg Growth`,
            color: "#C9A96E",
            font: { size: 13, weight: "bold" },
          },
        },
        scales: {
          y: {
            ticks: {
              color: "#F5F0E8",
              callback: function (value) {
                return "$" + value.toLocaleString() + "k";
              },
            },
            grid: { color: "#333" },
          },
          x: {
            ticks: { color: "#F5F0E8" },
            grid: { color: "#333" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [netMonthly, currentAge, retirementAge]);

  return (
    <div style={resultContainerStyle}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "20px" }}>
        <div style={{ background: "#0D0D0D", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Total at {retirementAge}</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#C9A96E" }}>${(projection.total / 1000000).toFixed(2)}M</div>
        </div>
        <div style={{ background: "#0D0D0D", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>Roth IRA at {retirementAge}</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#5B8A72" }}>${(projection.roth / 1000).toFixed(0)}k</div>
        </div>
        <div style={{ background: "#0D0D0D", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>401(k) at {retirementAge}</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#7B9BB5" }}>${(projection.fourOhOneK / 1000).toFixed(0)}k</div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "400px" }} />
    </div>
  );
}

// ─── RENDER TO DOM ────────────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<FinancialPlannerApp />);

