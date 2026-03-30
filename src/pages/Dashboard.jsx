import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateMoneyScore, predictNextMonthBudget, formatCurrency } from '../utils/finance';
import { getCategoryTip } from '../utils/gemini';
import { Wallet, TrendingDown, TrendingUp, AlertCircle, Sparkles, Activity, Target, Settings2, PencilLine } from 'lucide-react';

export default function Dashboard() {
  const { expenses, incomes, settings, updateSettings } = useFinance();
  const currentDate = new Date();
  
  // Calculate basic stats for current month
  const monthlyExpensesList = expenses.filter(e => new Date(e.date).getMonth() === currentDate.getMonth());
  const monthlyExpenses = monthlyExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);
    
  const monthlyIncomes = incomes
    .filter(i => new Date(i.date).getMonth() === currentDate.getMonth())
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const balance = monthlyIncomes - monthlyExpenses;
  const budget = settings.monthlyBudget || 0;
  
  const scoreData = calculateMoneyScore(expenses, incomes, budget);
  const predictedBudget = predictNextMonthBudget(expenses);
  const spendingRatio = budget > 0 ? (monthlyExpenses / budget) * 100 : 0;
  const genericOverspending = spendingRatio >= 80;

  // Recent transactions
  const allTransactions = [...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // --- Category Overspend Logic ---
  const [overspendCategory, setOverspendCategory] = useState(null);
  const [categoryTip, setCategoryTip] = useState('');

  useEffect(() => {
    if (monthlyExpenses === 0) return;
    
    // Group by category
    const categoryTotals = {};
    monthlyExpensesList.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    let highestOverspend = null;
    let highestRatio = 0;

    for (const [cat, amt] of Object.entries(categoryTotals)) {
        // Skip essential fixed costs if you want, but for hackathon strict 40%
        if (cat === "Rent" || cat === "Housing") continue; 
        
        const ratio = amt / monthlyExpenses;
        if (ratio >= 0.4 && ratio > highestRatio) {
           highestRatio = ratio;
           highestOverspend = cat;
        }
    }

    if (highestOverspend !== overspendCategory) {
        setOverspendCategory(highestOverspend);
        if (highestOverspend) {
            setCategoryTip('Analyzing your spending limit...');
            // Fetch tip from Gemini
            getCategoryTip(highestOverspend).then(tip => setCategoryTip(tip));
        } else {
            setCategoryTip('');
        }
    }
  }, [monthlyExpensesList, monthlyExpenses]);

  // --- Goal Tracker Logic ---
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: settings.goalName || '', amount: settings.goalAmount || '' });
  
  const currentSavings = Math.max(0, balance);
  const goalMissing = !settings.goalName || !settings.goalAmount;
  
  let monthsToGoal = 0;
  let progressPercent = 0;
  if (!goalMissing) {
      if (currentSavings > 0) {
          monthsToGoal = Math.ceil(settings.goalAmount / currentSavings);
      } else {
          monthsToGoal = -1; // Never at current rate
      }
      // Simple mock historical progress calculation (assuming 1 past month of equal savings)
      const historicalSaved = currentSavings > 0 ? currentSavings : 0;
      progressPercent = Math.min(100, (historicalSaved / settings.goalAmount) * 100);
  }

  const handleSaveGoal = (e) => {
      e.preventDefault();
      updateSettings({ goalName: goalForm.name, goalAmount: Number(goalForm.amount) });
      setIsEditingGoal(false);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-slate-100 mb-2 mt-4 md:mt-0">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">Here's a summary of your financial health.</p>
      </header>

      {/* Alert Banners */}
      <div className="space-y-3">
        {genericOverspending && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-300">Budget Warning</h3>
              <p className="text-sm opacity-90">You have used {spendingRatio.toFixed(0)}% of your overall monthly budget.</p>
            </div>
          </div>
        )}

        {overspendCategory && (
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md relative overflow-hidden">
            <Sparkles className="absolute -right-4 -top-4 w-20 h-20 text-orange-500/10" />
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="relative z-10">
              <h3 className="font-medium text-orange-300">
                ⚠️ You are overspending on {overspendCategory}!
              </h3>
              <p className="text-sm opacity-90 mt-1">
                More than 40% of your expenses went to this category. <br/>
                <span className="font-semibold text-brand-300 flex items-center gap-1 mt-2">
                   <Sparkles className="w-4 h-4" /> AI Tip: {categoryTip}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-1 shadow-xl">
        <Card title="Current Balance" value={formatCurrency(balance)} icon={<Wallet className="text-brand-400" />} />
        <Card title="Monthly Income" value={formatCurrency(monthlyIncomes)} icon={<TrendingUp className="text-emerald-400" />} />
        <Card title="Monthly Expenses" value={formatCurrency(monthlyExpenses)} icon={<TrendingDown className="text-red-400" />} />
        
        {/* Money Score Card */}
        <div className="glass rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-sm text-slate-400 font-medium">Money Score</span>
            <Activity className="w-5 h-5 text-brand-400" />
          </div>
          <div className="relative z-10 flex items-end gap-3">
             <h2 className={`text-4xl font-semibold ${scoreData.color}`}>{scoreData.score}</h2>
             <span className="text-sm text-slate-400 mb-1">/ 100 ({scoreData.label})</span>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border-4 border-brand-500/20 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goals & AI Side Panel */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Goal Tracker */}
            <div className="glass rounded-2xl p-6 border border-brand-500/30 shadow-lg shadow-brand-500/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-brand-400">
                        <Target className="w-5 h-5" />
                        <h3 className="font-semibold text-slate-200">My Goal</h3>
                    </div>
                    {!isEditingGoal && (
                        <button onClick={() => setIsEditingGoal(true)} className="text-slate-500 hover:text-slate-300">
                            <PencilLine className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isEditingGoal || goalMissing ? (
                    <form onSubmit={handleSaveGoal} className="space-y-4">
                        <div>
                            <input 
                                type="text" 
                                required placeholder="Goal Name (e.g. Vacation)"
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200"
                                value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <input 
                                type="number" 
                                required placeholder="Target Amount (₹)"
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200"
                                value={goalForm.amount} onChange={e => setGoalForm({...goalForm, amount: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2 rounded-xl text-sm transition-colors">
                            Save Goal Tracker
                        </button>
                    </form>
                ) : (
                    <div>
                        <h4 className="text-2xl font-semibold text-slate-100 mb-1">{settings.goalName}</h4>
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-slate-400">Target: {formatCurrency(settings.goalAmount)}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-900 rounded-full h-3 mb-2 border border-slate-800 overflow-hidden relative">
                            <div 
                                className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        
                        <div className="mt-4 p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
                            {monthsToGoal > 0 ? (
                                <p className="text-center text-sm text-brand-200">
                                    Based on your current savings, you will reach this goal in <strong>{monthsToGoal} months</strong>!
                                </p>
                            ) : (
                                <p className="text-center text-sm text-slate-400">
                                    You need positive monthly savings to project this goal!
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Budget Predictor */}
            <div className="glass rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-slate-200">AI Budget Forecast</h3>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                    Based on your 90-day trajectory, you will need:
                </p>
                <div className="text-3xl font-light text-slate-200 mb-1">
                    {predictedBudget > 0 ? formatCurrency(predictedBudget) : "Needs Data"}
                </div>
                <p className="text-xs text-slate-500">+5% Buffer factored in.</p>
            </div>
        </div>

        {/* Recent Transactions list */}
        <div className="glass rounded-2xl p-6 lg:col-span-2 shadow-xl border border-slate-800/50">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-200">Recent Transactions</h3>
          </div>
          
          <div className="space-y-4">
            {allTransactions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No transactions found for this month.</p>
            ) : (
              allTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{t.title}</p>
                      <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()} &bull; {t.category}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="glass rounded-2xl p-5 border border-transparent transition-colors duration-300 relative overflow-hidden bg-slate-800/20">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-slate-100 truncate relative z-10">{value}</h2>
    </div>
  );
}
