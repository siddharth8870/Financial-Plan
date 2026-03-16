// AI Service - Backend integration for personalized financial insights
// This service communicates with an AI model for generating custom recommendations

export async function getAIRecommendations(financialProfile) {
  try {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(financialProfile),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Service Error:', error);
    return null;
  }
}

export async function getPersonalizedInsights(goals, income, currentAge) {
  try {
    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goals,
        income,
        currentAge,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch personalized insights');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Insights Service Error:', error);
    return null;
  }
}

export async function analyzeFinancialGoals(allocations, goals) {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        allocations,
        goals,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze goals');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis Service Error:', error);
    return null;
  }
}
