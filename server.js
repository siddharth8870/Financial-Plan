// Backend server for AI service integration
// This file provides AI-powered financial insights for the Financial Planning Tool

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',');
const AI_SERVICE = process.env.AI_SERVICE || 'mock'; // Options: 'mock', 'openai', 'anthropic'

// Middleware
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('.'));

// ─── AI SERVICE IMPLEMENTATIONS ─────────────────────────────────────────────────

/**
 * Mock AI Response (Default - No API Key Required)
 * Provides realistic financial advice without external API calls
 */
async function getMockAIResponse(prompt) {
  console.log('📊 Using Mock AI - Generating response...');
  
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const responses = {
    recommendations: "Based on your financial profile, I recommend this strategy: 1) Build an emergency fund of 3-6 months of expenses (use your Emergency Fund allocation). 2) Maximize tax-advantaged retirement accounts (401k + Roth IRA) to the fullest extent. 3) Invest remaining funds in low-cost index funds (VTI/VOO) for long-term growth. 4) Automate all savings to enforce consistency. This balanced approach ensures security while building significant wealth over time.",
    insights: "Your savings rate is excellent! By maintaining consistent contributions and leveraging compound interest at 7% average returns, you could accumulate substantial wealth. Key milestones: Emergency fund complete by year 1, first major goal funded by year 2, significant net worth by year 5.",
    analysis: "Your allocation is well-balanced. The 26% retirement savings rate is solid for long-term wealth building. Your goal allocation is reasonable - just ensure you don't sacrifice emergency fund completion. Consider: Once emergency fund is complete, redirect that 10% to accelerate goal achievement.",
  };
  
  return {
    recommendation: responses[Object.keys(responses)[Math.floor(Math.random() * Object.keys(responses).length)]],
    confidence: 0.85,
    model: 'mock-ai',
  };
}

/**
 * OpenAI Integration
 * Requires: OPENAI_API_KEY in .env
 */
async function getOpenAIResponse(prompt) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not configured, falling back to mock AI');
      return getMockAIResponse(prompt);
    }
    
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial advisor providing personalized recommendations based on user financial profiles. Be concise, actionable, and specific.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return {
      recommendation: response.choices[0].message.content,
      confidence: 0.95,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    return getMockAIResponse(prompt);
  }
}

/**
 * Anthropic Claude Integration
 * Requires: ANTHROPIC_API_KEY in .env
 */
async function getAnthropicResponse(prompt) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('⚠️ ANTHROPIC_API_KEY not configured, falling back to mock AI');
      return getMockAIResponse(prompt);
    }
    
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const response = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    
    return {
      recommendation: response.content[0].text,
      confidence: 0.95,
      model: 'claude-3-sonnet',
    };
  } catch (error) {
    console.error('❌ Anthropic API Error:', error.message);
    return getMockAIResponse(prompt);
  }
}

/**
 * Main AI Response Router
 * Routes to appropriate AI service based on configuration
 */
async function getAIResponse(prompt) {
  console.log(`🤖 AI Service: ${AI_SERVICE.toUpperCase()}`);
  
  switch (AI_SERVICE.toLowerCase()) {
    case 'openai':
      return getOpenAIResponse(prompt);
    case 'anthropic':
    case 'claude':
      return getAnthropicResponse(prompt);
    case 'mock':
    default:
      return getMockAIResponse(prompt);
  }
}

// ─── API ROUTES ────────────────────────────────────────────────────────────────

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Financial AI Server',
    aiService: AI_SERVICE,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get AI Recommendations for Financial Plan
 */
app.post('/api/ai/recommendations', async (req, res) => {
  try {
    const { salary, location, retirementGoal, goals, allocations } = req.body;
    
    if (!salary || !location) {
      return res.status(400).json({ error: 'Missing required fields: salary, location' });
    }
    
    const prompt = `You are a financial advisor. Based on the following profile, provide ONE specific, actionable recommendation:

Salary: $${salary}/year
Location: ${location}
Retirement Goal: ${retirementGoal || 'Not specified'}
Financial Goals: ${goals && goals.length > 0 ? goals.join(', ') : 'None selected'}
Current Allocation: ${JSON.stringify(allocations || {})}

Provide a concise recommendation (2-3 sentences) that's practical and aligned with their goals.`;
    
    const aiResponse = await getAIResponse(prompt);
    res.json(aiResponse);
  } catch (error) {
    console.error('❌ Error in /api/ai/recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      message: error.message,
    });
  }
});

/**
 * Get Personalized Financial Insights
 */
app.post('/api/ai/insights', async (req, res) => {
  try {
    const { goals, income, currentAge } = req.body;
    
    if (!income) {
      return res.status(400).json({ error: 'Missing required field: income' });
    }
    
    const prompt = `Generate financial insights for someone:
- Age: ${currentAge || 'Not specified'}
- Annual Income: $${income}
- Goals: ${goals && goals.length > 0 ? goals.join(', ') : 'None specified'}

Provide 2-3 key insights about their financial situation and success probability.`;
    
    const aiResponse = await getAIResponse(prompt);
    res.json(aiResponse);
  } catch (error) {
    console.error('❌ Error in /api/ai/insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: error.message,
    });
  }
});

/**
 * Analyze Goals and Allocations
 */
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { allocations, goals } = req.body;
    
    if (!allocations) {
      return res.status(400).json({ error: 'Missing required field: allocations' });
    }
    
    const prompt = `Analyze these financial allocations and goals for potential issues:

Allocations: ${JSON.stringify(allocations)}
Goals: ${goals && goals.length > 0 ? goals.join(', ') : 'None specified'}

Identify any gaps, risks, or optimization opportunities in 2-3 sentences.`;
    
    const aiResponse = await getAIResponse(prompt);
    res.json(aiResponse);
  } catch (error) {
    console.error('❌ Error in /api/ai/analyze:', error);
    res.status(500).json({ 
      error: 'Failed to analyze goals',
      message: error.message,
    });
  }
});

// ─── ERROR HANDLING ────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║      🤖 Financial AI Server is Running                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  📍 Server:  http://localhost:${PORT}                           
║  🤖 AI Mode: ${AI_SERVICE.toUpperCase()}                                   
║  📊 Endpoints:                                                 ║
║    • POST /api/ai/recommendations  (Get financial advice)      ║
║    • POST /api/ai/insights         (Get financial insights)    ║
║    • POST /api/ai/analyze          (Analyze goals)             ║
║    • GET  /api/health              (Health check)              ║
║                                                                ║
║  ⚙️ Configuration:                                              ║
║    ${AI_SERVICE === 'openai' ? '✅' : '⚪'} OpenAI${AI_SERVICE === 'openai' ? ' (configured)' : ' (not configured)'}
║    ${AI_SERVICE === 'anthropic' ? '✅' : '⚪'} Anthropic${AI_SERVICE === 'anthropic' ? ' (configured)' : ' (not configured)'}
║    ${AI_SERVICE === 'mock' ? '✅' : '⚪'} Mock AI${AI_SERVICE === 'mock' ? ' (running)' : ' (fallback)'}
║                                                                ║
║  💡 To use real AI:                                             ║
║    1. Set AI_SERVICE in .env (openai or anthropic)            ║
║    2. Add your API key (OPENAI_API_KEY or ANTHROPIC_API_KEY)  ║
║    3. Restart the server                                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
