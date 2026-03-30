// Multi-key load balancing — one key per feature for quota isolation
const KEY_FINBOT     = import.meta.env.VITE_GEMINI_KEY_FINBOT;
const KEY_ANALYSIS   = import.meta.env.VITE_GEMINI_KEY_ANALYSIS;
const KEY_SAVING     = import.meta.env.VITE_GEMINI_KEY_SAVING;
const KEY_TIMEMACHINE = import.meta.env.VITE_GEMINI_KEY_TIMEMACHINE;

// ─────────────────────────────────────────────────────────────
//  DEMO MODE — 10 pre-programmed FinBot responses
//  Triggered automatically when the API quota is exceeded.
//  Each response is tailored to an Indian student persona:
//  ₹5,000 food | ₹1,500 transport | ₹800 subscriptions
// ─────────────────────────────────────────────────────────────

const DEMO_FINBOT_RESPONSES = [
  {
    keywords: ['save money', 'saving tips', 'how to save'],
    answer: `Great question! Here's a practical breakdown for a student on a tight budget:\n\n💰 **50/30/20 Rule for ₹15,000/month income:**\n- **₹7,500** → Needs (food, rent, transport)\n- **₹4,500** → Wants (outings, subscriptions, shopping)\n- **₹3,000** → Savings & Investments\n\n**Quick Wins this week:**\n1. 🍛 Cut Swiggy to 1x/week → saves **₹1,200/month**\n2. 📱 Share your Netflix/Spotify with 2 friends → saves **₹400/month**\n3. 🚌 Buy a metro student pass instead of Ola/Uber → saves **₹600/month**\n\nEven saving ₹2,000/month at 12% in a Nifty 50 Index Fund grows to **₹1.65 lakh in 5 years** via compounding. Start small — consistency beats amount! 🚀`,
  },
  {
    keywords: ['what is sip', 'sip meaning', 'systematic investment'],
    answer: `**SIP (Systematic Investment Plan)** is the smartest way for students to start investing!\n\n📌 **How it works:** You invest a fixed ₹ amount every month automatically into a mutual fund.\n\n**Example — ₹500/month in a Nifty 50 Index Fund:**\n| Time | Total Invested | Value at 12% CAGR |\n|------|--------------|-------------------|\n| 1 yr | ₹6,000 | ₹6,420 |\n| 3 yr | ₹18,000 | ₹21,800 |\n| 5 yr | ₹30,000 | ₹41,000 |\n| 10 yr | ₹60,000 | ₹1,16,000 |\n\n**Why SIP beats lump sum:** Rupee-cost averaging means you buy more units when markets fall — automatically reducing risk over time.\n\n🎯 **Best apps for students:** Groww (zero commission) or Zerodha Coin. Minimum SIP is just **₹100/month**!`,
  },
  {
    keywords: ['afford trip', 'can i go', 'travel budget', 'trip to', 'vacation', 'goa'],
    answer: `Let me crunch the numbers for you! Here's a realistic Goa trip budget:\n\n✈️ **Goa Long Weekend (3N/4D):**\n| Item | Cost |\n|------|------|\n| Train/Bus (round trip) | ₹1,200 – ₹2,500 |\n| Hostel (₹500/night × 3) | ₹1,500 |\n| Food (₹400/day × 4) | ₹1,600 |\n| Bike rent + sightseeing | ₹1,000 |\n| **Total** | **~₹5,800 – ₹7,500** |\n\n**Can you afford it?** If you save ₹3,000/month, you can fund Goa in **2 months without breaking your SIP**.\n\n💡 **Pro tips:** Book 6+ weeks in advance on Ixigo (fares drop 30-40%). Always keep a ₹1,500 emergency buffer when you travel. Avoid Goa in peak December — prices double!`,
  },
  {
    keywords: ['best investment', 'where to invest', 'investment for students', 'invest money'],
    answer: `As a student, your biggest asset is **time** — compounding works best over long horizons. Here's my ranked list:\n\n🏆 **Best Investments for Students (2024):**\n\n1. **Nifty 50 Index Fund** *(Best risk/reward)*\n   - Expected 12% CAGR long-term\n   - Start with ₹500/month SIP on Groww\n   - Expense ratio as low as 0.10%\n\n2. **PPF (Public Provident Fund)**\n   - 7.1% guaranteed, fully tax-free\n   - 15-year lock-in — perfect retirement base\n   - Open at any post office with ₹500/year\n\n3. **Recurring Deposit (RD)**\n   - 6.5-7% returns, zero risk\n   - Ideal for short goals under 2 years\n\n4. ❌ **Avoid:** Crypto, F&O, penny stocks as a beginner — 90% of retail traders lose money.\n\n📌 **Action:** Open Groww → search "UTI Nifty 50 Index Fund" → start ₹500 SIP. Done in 5 minutes!`,
  },
  {
    keywords: ['reduce food', 'food expenses', 'food budget', 'eating cheaper', 'swiggy', 'zomato'],
    answer: `Your ₹5,000/month food budget can be trimmed to **₹3,200** with these tactics:\n\n📉 **Where the money leaks:**\n| Habit | Monthly Cost | Optimized |\n|-------|-------------|----------|\n| Swiggy/Zomato (3x/week) | ₹2,400 | ₹800 (1x/week only) |\n| Café coffee (daily) | ₹900 | ₹300 (weekends only) |\n| Impulse snacks | ₹600 | ₹200 |\n| Mess/canteen | ₹1,100 | ₹1,100 (unchanged) |\n| **Total** | **₹5,000** | **₹2,400** |\n\n✅ **Savings: ₹1,800/month** → that's **₹21,600/year** you can invest!\n\n🍛 **Practical swap:** Eat mess breakfast + lunch on weekdays, allow yourself 1 Swiggy treat on weekends. You'll barely notice the change.`,
  },
  {
    keywords: ['mutual fund', 'what is mutual fund', 'mf meaning'],
    answer: `**Mutual Fund = pooled money from many investors**, managed by a professional fund manager who invests across 50-100+ stocks.\n\n📚 **Key types you should know:**\n| Type | Risk | Returns | Best For |\n|------|------|---------|----------|\n| Index Fund | Low | 11-13% | Long-term (5+ yr) |\n| ELSS | Medium | 12-15% | Tax saving under 80C |\n| Liquid Fund | Very Low | 5-6% | Emergency fund |\n| Sectoral | High | Varies | Experienced investors only |\n\n**Benefits over FD:**\n- FD gives ~7% (taxable). A good equity mutual fund delivers **12%+ over 10 years** — and ELSS saves you tax too.\n\n💡 **For a student:** Start with a **Nifty 50 Index Fund** on Groww. KYC with Aadhaar + PAN takes under 5 minutes and minimum investment is just ₹100!`,
  },
  {
    keywords: ['how much save', 'how much should i save', 'saving percentage', 'ideal savings'],
    answer: `The classic benchmark is the **20% savings rule**, but here's a realistic student breakdown:\n\n📊 **Savings Rate by Income:**\n| Monthly Income | Minimum | Ideal |\n|---------------|---------|-------|\n| < ₹8,000 | ₹500 (6%) | ₹1,000 (12%) |\n| ₹8,000–₹15,000 | ₹1,500 (15%) | ₹2,500 (20%) |\n| ₹15,000–₹25,000 | ₹3,000 (17%) | ₹5,000 (25%) |\n\n**Priority order for your money:**\n1. 🚨 Emergency fund first → ₹10,000 in a liquid fund (takes ~3 months)\n2. 🎯 Goal savings → phone, trip, course fees\n3. 📈 Wealth-building SIP → Nifty 50, minimum ₹500/month\n\n**The magic of starting early:** ₹1,000/month at age 22 at 12% CAGR = **₹35+ lakhs by retirement**. The same amount started at 32 = only ₹10 lakhs. Start today!`,
  },
  {
    keywords: ['budget', 'budgeting tips', 'plan my expenses', 'manage money'],
    answer: `Here's a FinWise budget template built for a **₹15,000/month** student income:\n\n📋 **Recommended Monthly Allocation:**\n| Category | Budget | Notes |\n|----------|--------|-------|\n| 🍛 Food | ₹3,500 | Mess + 1 takeout/week |\n| 🚌 Transport | ₹1,200 | Metro pass preferred |\n| 📱 Phone/Internet | ₹400 | Shared plan |\n| 🎬 Subscriptions | ₹300 | Shared Netflix etc. |\n| 📚 Books/Stationery | ₹500 | Variable |\n| 🎉 Social/Fun | ₹1,500 | Fixed fun money |\n| 💊 Health/Hygiene | ₹500 | Non-negotiable |\n| 🔒 Emergency Buffer | ₹600 | Never touch |\n| 💰 **Savings/SIP** | **₹3,000** | **Pay yourself FIRST** |\n\n⚡ **Power tip:** Auto-transfer ₹1,000 to savings the moment your pocket money arrives. Budget only what remains — this works better than willpower!`,
  },
  {
    keywords: ['index fund', 'what is index fund', 'nifty', 'nifty 50'],
    answer: `An **Index Fund** is Warren Buffett's top pick for regular investors — it copies a market index instead of trying to outperform it.\n\n📈 **Why Nifty 50 Index Fund for Students:**\n- Holds shares in **India's top 50 companies** (Reliance, TCS, HDFC, Infosys...)\n- Historical return: **~12% annually** over 15 years\n- Expense ratio: as low as **0.10%** (vs 1.5–2% for active funds)\n- Zero fund manager bias — the index holds you automatically\n\n**Best Nifty 50 Index Funds (2024):**\n| Fund | Expense Ratio | 5yr Return |\n|------|-------------|------------|\n| UTI Nifty 50 Index | 0.18% | 14.2% |\n| HDFC Index Fund | 0.20% | 13.9% |\n| Nippon India Nifty | 0.20% | 13.7% |\n\n🎯 **Action:** Open Groww → New SIP → Search "Nifty 50" → Set ₹500/month. Done in 5 minutes!`,
  },
  {
    keywords: ['start investing', 'how to invest', 'begin investing', 'first investment'],
    answer: `Welcome to your investing journey! Here's your exact step-by-step starter guide:\n\n**🟢 Step 1 — Build an Emergency Fund (Month 1–2)**\nSave ₹5,000–₹10,000 in a savings account first. This prevents panic-selling investments during emergencies.\n\n**🟡 Step 2 — Complete KYC (takes 5 minutes)**\nDownload **Groww** or **Zerodha** app → Upload Aadhaar + PAN → approved within 24 hours.\n\n**🟠 Step 3 — Start Your First SIP**\nChoose: **UTI Nifty 50 Index Fund** → set ₹500/month → date = same day your pocket money arrives.\n\n**🔴 Step 4 — Never Stop the SIP**\nDon't panic when markets fall — you're buying more units cheaply! Increase SIP by ₹500 every 6 months.\n\n📊 **What ₹500/month at 12% becomes:**\n| Years | Value |\n|-------|-------|\n| 5 | ₹41,000 |\n| 10 | ₹1.16 lakhs |\n| 20 | ₹4.99 lakhs |\n\n**The secret? Start today, not someday.** 🚀`,
  },
];

// ─────────────────────────────────────────────────────────────
//  DEMO MODE — Detailed 4-Week Saving Plan
// ─────────────────────────────────────────────────────────────

const DEMO_SAVING_PLAN = `## 🎯 Your Personalized 4-Week Saving Plan

Based on your spending profile — **₹5,000 on Food**, **₹1,500 on Transport**, **₹800 on Subscriptions** — here is your battle-tested roadmap to start building real wealth this month.

---

### 📅 Week 1 — Audit & Baseline (Target: Save ₹500)
**Goal:** Understand where every rupee disappears.
- ✅ Log **every** expense into FinWise for 7 days (even ₹10 chai)
- ✅ Identify your top 3 impulse categories
- ✅ Cancel 1 unused subscription immediately → saves **₹200–₹400**
- ✅ Cook at home for 3 dinners this week → saves **₹300**
- 🎯 **Week 1 Savings Target: ₹500**

---

### 📅 Week 2 — Cut the Fat (Target: Save ₹800)
**Goal:** Attack the two biggest wasteful categories.
- ✅ Replace 2 Swiggy/Zomato orders with college mess → saves **₹400**
- ✅ Use metro/bus instead of Ola/Uber twice this week → saves **₹200**
- ✅ Share your **Netflix** with 2 friends → your share drops to **₹67/month** (from ₹200)
- ✅ Brew coffee at home on 4 mornings → saves **₹100**
- 🎯 **Week 2 Savings Target: ₹800**

---

### 📅 Week 3 — Automate Your Savings (SIP Day 🚀)
**Goal:** Make saving involuntary so willpower never runs out.
- ✅ Open **Groww** app → KYC with Aadhaar + PAN (5 minutes)
- ✅ Start a **₹500/month SIP** on UTI Nifty 50 Index Fund
- ✅ Auto-transfer ₹1,000 to a separate savings account on salary day
- ✅ Set 2 "no-spend" days this week → saves ~₹200
- 🎯 **Week 3 Target: ₹1,000 saved + SIP live**

---

### 📅 Week 4 — Optimize & Lock In (Target: Save ₹1,200)
**Goal:** Cement habits and review your first month.
- ✅ Check FinWise Analysis tab — compare actual vs planned
- ✅ Meal-prep Sunday dinners for the week → saves ₹600
- ✅ Downgrade your phone plan if data usage allows → saves ₹100–₹200
- ✅ Increase SIP to **₹1,000/month** if Week 1-3 felt comfortable
- 🎯 **Week 4 Savings Target: ₹1,200**

---

### 📊 Category-wise Optimized Budget

| Category | Current | Optimized | Monthly Savings |
|----------|---------|-----------|----------------|
| 🍛 Food | ₹5,000 | ₹3,200 | **₹1,800** |
| 🚌 Transport | ₹1,500 | ₹900 | **₹600** |
| 📱 Subscriptions | ₹800 | ₹267 | **₹533** |
| ☕ Café / Snacks | ₹600 | ₹200 | **₹400** |
| **Total** | **₹7,900** | **₹4,567** | **₹3,333** |

---

### 🏦 SIP Recommendation (via Groww or Zerodha Coin)

**Starter Portfolio for ₹1,500/month:**

| Fund | Monthly SIP | Why |
|------|------------|-----|
| UTI Nifty 50 Index Fund | ₹700 | Market-matching returns, lowest cost |
| Parag Parikh Flexi Cap | ₹500 | Diversified globally + India mix |
| Liquid Fund (Emergency) | ₹300 | Zero risk, instant redemption |

> 💡 **At 12% CAGR**, your ₹1,500/month SIP grows to **₹1.23 lakhs in 5 years** — entirely funded by the ₹3,333 you freed up by cutting Swiggy, splitting Netflix, and taking the metro.

---

**Start today → [Groww.in](https://groww.in) or [Zerodha Coin](https://coin.zerodha.com)** — KYC in 5 minutes, minimum SIP just ₹100. 🎉`;

// Helper: keyword-match user message → pre-programmed FinBot demo answer
const getDemoFinBotResponse = (message) => {
  const lower = message.toLowerCase();
  for (const item of DEMO_FINBOT_RESPONSES) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.answer;
    }
  }
  // Generic intelligent fallback
  return `As your FinWise AI advisor: based on spending ₹5,000 on food, ₹1,500 on transport, and ₹800 on subscriptions, you have roughly **₹3,000–₹4,000/month** in untapped savings potential. Start a ₹500 SIP on Groww today — even small amounts compound dramatically over time! What specific goal can I help you plan for? 🚀`;
};

// ─────────────────────────────────────────────────────────────
//  FEATURE FUNCTIONS
// ─────────────────────────────────────────────────────────────

export const generateSIPRecommendation = async (expenses, incomes, settings, goal) => {
  if (!KEY_SAVING) return DEMO_SAVING_PLAN;

  const prompt = `
    You are a professional financial advisor called FinWise AI.
    The user has a monthly limit of ${settings.monthlyBudget}.
    They have requested advice to reach the following goal: "${goal}".
    
    Total expenses logged: ${expenses.length}
    Total incomes logged: ${incomes.length}
    
    Based on standard SIP principles, please provide a concise, 3-paragraph recommendation on how they can save for this goal. Format your output in clean Markdown.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY_SAVING}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.warn('Saving Plan API failed — using demo response:', error.message);
    return DEMO_SAVING_PLAN;
  }
};

export const getCategoryTip = async (category) => {
  if (!KEY_ANALYSIS) return `Consider tracking your ${category} purchases closely!`;

  const prompt = `Give me exactly ONE short sentence (under 15 words) of financial advice on how to reduce spending in the "${category}" category. Be creative but extremely brief. No bolding or intro.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY_ANALYSIS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    const cat = category.toLowerCase();
    if (cat.includes('food')) return "Try eating at the college mess or local dhabas instead of spending ₹5,000 on Swiggy.";
    if (cat.includes('transport')) return "Get a student metro pass or share auto rides to cut your ₹1,500 travel costs.";
    if (cat.includes('subscription') || cat.includes('entertainment')) return "You're spending ₹800 on subscriptions — split that Netflix bill with your hostel mates!";
    if (cat.includes('shopping')) return "Delay non-essential purchases by 48 hours — impulse urges almost always pass.";
    return `Watch your ${category} spending closely this week — even ₹100/day adds up to ₹3,000/month!`;
  }
};

export const scanReceipt = async (base64Data, mimeType) => {
  if (!KEY_ANALYSIS) throw new Error("API Key missing");
  const cleanBase64 = base64Data.split(',')[1] || base64Data;

  const prompt = `
    You are a highly accurate receipt parsing AI. 
    Analyze this image of a receipt and extract three things:
    1. title: The best name to describe this store or purchase (string, max 3 words)
    2. amount: The final total price as a pure number (number)
    3. category: Choose exactly ONE of these categories: Food, Transport, Utilities, Entertainment, Shopping, Salary, Other.
    
    RETURN ONLY PURE JSON in this format with NO markdown wrapping or backticks:
    {"title": "McDonalds", "amount": 14.50, "category": "Food"}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY_ANALYSIS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mimeType || "image/jpeg", data: cleanBase64 } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const textOutput = data.candidates[0].content.parts[0].text;
    const jsonStr = textOutput.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.warn("Receipt Scanner failed — using demo data:", error.message);
    // Realistic Indian receipt fallback
    const demoReceipts = [
      { title: "Swiggy - Biryani", amount: 320, category: "Food" },
      { title: "Café Coffee Day", amount: 185, category: "Food" },
      { title: "Big Bazaar", amount: 1240, category: "Shopping" },
      { title: "Uber Cab", amount: 210, category: "Transport" },
    ];
    return demoReceipts[Math.floor(Math.random() * demoReceipts.length)];
  }
};

export const createFinBotChatSession = () => {
  if (!KEY_FINBOT) return null;

  let history = [
    { role: 'user', parts: [{ text: 'Hello, you are FinBot, an AI financial assistant built into the FinWise app. Keep your answers short, specific, and mention ₹ amounts where relevant.' }] },
    { role: 'model', parts: [{ text: 'Hello! I am FinBot, your personal financial assistant. Ask me anything about saving, investing, or budgeting! 💰' }] }
  ];

  return {
    sendMessage: async (messageText) => {
      history.push({ role: 'user', parts: [{ text: messageText }] });

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY_FINBOT}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: history })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const reply = data.candidates[0].content.parts[0].text;
        history.push({ role: 'model', parts: [{ text: reply }] });
        return { response: { text: () => reply } };
      } catch (error) {
        history.pop();
        // Demo mode — realistic keyword-matched response
        const reply = getDemoFinBotResponse(messageText);
        history.push({ role: 'model', parts: [{ text: reply }] });
        return { response: { text: () => reply } };
      }
    }
  };
};

export const generateTimeMachinePath = async (years, currentSavings, topCategory) => {
  if (!KEY_TIMEMACHINE) return null;

  const prompt = `
    You are an expert financial supercomputer projecting future wealth.
    The user is projecting ${years} years into the future.
    Currently, they save ₹${currentSavings} per month.
    Their highest spending category is "${topCategory}".
    
    Provide an optimized "FinWise Path" projection. Generate a JSON response with NO BACKTICKS or Markdown wrapping matching exactly this format:
    {
       "optimizedMonthlySavings": <number greater than ${currentSavings}>,
       "optimizedPortfolioValue": <calculated future value at 12% return for those savings over ${years} years>,
       "actionPlan": ["Cut back on ${topCategory} by 15%", "Refinance debt", "Automate SIP transfers"]
    }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY_TIMEMACHINE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const textOutput = data.candidates[0].content.parts[0].text;
    const jsonStr = textOutput.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.warn("Time Machine API failed — using demo fallback:", error.message);
    const optimizedSavings = Math.max(currentSavings * 1.25, 3500);
    return {
      optimizedMonthlySavings: optimizedSavings,
      optimizedPortfolioValue: -1, // Signal to calculate locally
      actionPlan: [
        `Cut ${topCategory || 'Food'} spend by 20% — redirect ₹${Math.round(currentSavings * 0.2)} to SIP.`,
        "Switch to metro/bus 3 days a week — saves ₹600/month.",
        "Split streaming subscriptions with 2 friends — saves ₹533/month."
      ]
    };
  }
};
