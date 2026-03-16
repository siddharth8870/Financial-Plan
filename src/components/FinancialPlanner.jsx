import React, { useState } from "react";
import { AllocationPieChart } from "./AllocationPieChart";
import { AllocationBarChart } from "./AllocationBarChart";
import { generateAllocation } from "../utils/calculations";
import { MATERIALISTIC_OPTIONS, RETIREMENT_GOALS } from "../utils/constants";
import { getAIRecommendations } from "../services/aiService";

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

export default function FinancialPlanner() {
  const [step, setStep] = useState("form");
  const [retirementGoal, setRetirementGoal] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [allocations, setAllocations] = useState(null);
  const [netMonthly, setNetMonthly] = useState(0);
  const [warning, setWarning] = useState("");
  const [sliderValues, setSliderValues] = useState({});
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGoalToggle = (goalValue) => {
    setSelectedGoals((prev) =>
      prev.includes(goalValue)
        ? prev.filter((g) => g !== goalValue)
        : [...prev, goalValue]
    );
  };

  const handleSubmit = async (e) => {
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

    const initialSliders = {};
    Object.keys(alloc).forEach((key) => {
      initialSliders[key] = alloc[key];
    });
    setSliderValues(initialSliders);

    // Fetch AI insights
    setLoadingAI(true);
    try {
      const insights = await getAIRecommendations({
        salary: salaryNum,
        location,
        retirementGoal,
        goals: selectedGoals,
        allocations: alloc,
      });
      if (insights) {
        setAiInsights(insights);
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    } finally {
      setLoadingAI(false);
    }

    setStep("results");
  };

  const handleSliderChange = (label, newValue) => {
    setSliderValues((prev) => ({
      ...prev,
      [label]: Math.max(0, newValue),
    }));
  };

  if (step === "form") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1>💰 Financial Planning Tool</h1>
          <p>Answer a few questions to get your personalized financial plan</p>
        </div>

        <form onSubmit={handleSubmit} style={formContainerStyle}>
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

  const totalAllocated = Object.values(sliderValues).reduce((a, b) => a + b, 0);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>📊 Your Financial Plan</h1>
        <p>Monthly Net Income: <strong>${netMonthly.toLocaleString()}</strong></p>
        {warning && <p style={{ color: "#FF6B6B", marginTop: "10px" }}>{warning}</p>}
        {loadingAI && <p style={{ color: "#C9A96E", marginTop: "10px" }}>🤖 Generating AI insights...</p>}
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

      <div style={chartsContainerStyle}>
        <AllocationPieChart data={sliderValues} />
        <AllocationBarChart data={sliderValues} netMonthly={netMonthly} />
      </div>

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
            <span
              style={{
                color: totalAllocated > netMonthly ? "#FF6B6B" : "#C9A96E",
                fontWeight: "bold",
              }}
            >
              ${Math.round(totalAllocated).toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <span>Remaining:</span>
            <span
              style={{
                color: totalAllocated <= netMonthly ? "#5B8A72" : "#FF6B6B",
                fontWeight: "bold",
              }}
            >
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

      <div style={resultContainerStyle}>
        <h2 style={{ color: "#C9A96E", marginBottom: "20px" }}>Summary & Recommendations</h2>
        <div style={{ lineHeight: "1.8", color: "#CCC" }}>
          <p>
            ✓ <strong>Monthly Net Income:</strong> ${netMonthly.toLocaleString()}
          </p>
          <p>
            ✓ <strong>Retirement Goal:</strong>{" "}
            {RETIREMENT_GOALS.find((g) => g.value === retirementGoal)?.label}
          </p>
          <p>
            ✓ <strong>Selected Goals:</strong>{" "}
            {selectedGoals.length > 0 ? selectedGoals.join(", ") : "None selected"}
          </p>
          {aiInsights && (
            <div style={{ marginTop: "20px", padding: "15px", background: "#0D0D0D", borderRadius: "6px", borderLeft: "3px solid #C9A96E" }}>
              <p style={{ color: "#C9A96E", fontWeight: "bold", marginBottom: "10px" }}>🤖 AI Insights:</p>
              <p style={{ color: "#CCC", fontSize: "14px" }}>{aiInsights.recommendation}</p>
            </div>
          )}
          <p style={{ marginTop: "20px", color: "#C9A96E", fontStyle: "italic" }}>
            💡 Tip: Adjust the sliders above to customize your allocation. Ensure you don't exceed your monthly income.
          </p>
        </div>
      </div>
    </div>
  );
}
