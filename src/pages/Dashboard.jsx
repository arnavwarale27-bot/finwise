import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { calculateMoneyScore, predictNextMonthBudget, formatCurrency } from '../utils/finance';
import { getCategoryTip } from '../utils/gemini';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  Activity, 
  Target, 
  Settings2, 
  PencilLine,
  ArrowRight,
  Plus
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { expenses, incomes, settings, updateSettings } = useFinance();
  const currentDate = new Date();
  
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

  const allTransactions = [...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const [overspendCategory, setOverspendCategory] = useState(null);
  const [categoryTip, setCategoryTip] = useState('');

  useEffect(() => {
    if (monthlyExpenses === 0) return;
    
    const categoryTotals = {};
    monthlyExpensesList.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    let highestOverspend = null;
    let highestRatio = 0;

    for (const [cat, amt] of Object.entries(categoryTotals)) {
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
            getCategoryTip(highestOverspend).then(tip => setCategoryTip(tip));
        } else {
            setCategoryTip('');
        }
    }
  }, [monthlyExpensesList, monthlyExpenses]);

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
          monthsToGoal = -1; 
      }
      const historicalSaved = currentSavings > 0 ? currentSavings : 0;
      progressPercent = Math.min(100, (historicalSaved / settings.goalAmount) * 100);
  }

  const handleSaveGoal = (e) => {
      e.preventDefault();
      updateSettings({ goalName: goalForm.name, goalAmount: Number(goalForm.amount) });
      setIsEditingGoal(false);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 variants={item} className="text-4xl font-bold text-white mb-2 tracking-tight">
            Wealth Overview
          </motion.h1>
          <motion.p variants={item} className="text-slate-400 font-medium">
            Welcome back, Arnav. Your portfolio is looking <span className="text-emerald-400">healthy</span>.
          </motion.p>
        </div>
        <motion.div variants={item} className="flex gap-3">
          <button className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
            Download Report
          </button>
        </motion.div>
      </header>

      {/* Alert Banners */}
      {(genericOverspending || overspendCategory) && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {genericOverspending && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-[2rem] flex items-start gap-4 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-colors" />
              <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400 relative z-10">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-rose-200">Budget Limit Reached</h3>
                <p className="text-sm text-rose-400/80 font-medium mt-1">
                  You've utilized {spendingRatio.toFixed(0)}% of your monthly budget. Consider scaling back.
                </p>
              </div>
            </div>
          )}

          {overspendCategory && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-[2rem] flex items-start gap-4 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
              <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 relative z-10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-amber-200">AI Spending Insight</h3>
                <p className="text-sm text-amber-400/80 font-medium mt-1">
                   {categoryTip || `Heads up! Your ${overspendCategory} spending is higher than usual.`}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Balance" 
          value={formatCurrency(balance)} 
          icon={<Wallet className="w-5 h-5" />} 
          color="brand"
          trend="+12.5%"
        />
        <StatCard 
          title="Monthly Income" 
          value={formatCurrency(monthlyIncomes)} 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="emerald"
          trend="+4.2%"
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(monthlyExpenses)} 
          icon={<TrendingDown className="w-5 h-5" />} 
          color="rose"
          trend="-2.1%"
        />
        <ScoreCard scoreData={scoreData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Transactions */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <button className="text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-3">
            {allTransactions.length === 0 ? (
              <div className="glass rounded-[2rem] p-12 text-center border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium">No activity detected this month.</p>
              </div>
            ) : (
              allTransactions.map(t => (
                <div key={t.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{t.title}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {t.category} &bull; {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right Column: Goal & Forecast */}
        <motion.div variants={item} className="space-y-8">
          {/* Goal Tracker */}
          <div className="glass-card rounded-[2rem] p-7 border border-brand-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full blur-[60px] -mr-20 -mt-20" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white tracking-tight">Active Goal</h3>
              </div>
              {!isEditingGoal && !goalMissing && (
                <button onClick={() => setIsEditingGoal(true)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <PencilLine className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {isEditingGoal || goalMissing ? (
              <form onSubmit={handleSaveGoal} className="space-y-4 relative z-10">
                <input 
                  type="text" 
                  required placeholder="Goal Name (e.g. Tesla Model S)"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm font-medium text-white focus:border-brand-500/50 outline-none transition-all"
                  value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})}
                />
                <input 
                  type="number" 
                  required placeholder="Target Amount (₹)"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm font-medium text-white focus:border-brand-500/50 outline-none transition-all"
                  value={goalForm.amount} onChange={e => setGoalForm({...goalForm, amount: e.target.value})}
                />
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-brand-600/20">
                  Set Financial Goal
                </button>
              </form>
            ) : (
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Targeting</p>
                  <h4 className="text-2xl font-black text-white">{settings.goalName}</h4>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-brand-400">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                    <span>{formatCurrency(currentSavings)} saved</span>
                    <span>{formatCurrency(settings.goalAmount)} target</span>
                  </div>
                </div>
                
                <div className="p-4 bg-brand-500/5 rounded-2xl border border-brand-500/10">
                  <p className="text-sm font-semibold text-brand-200 leading-relaxed">
                    {monthsToGoal > 0 ? (
                      <>You're on track to hit this in <span className="text-white font-black">{monthsToGoal} months</span>!</>
                    ) : (
                      <>Increase your monthly savings to reach this goal faster.</>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Forecast */}
          <div className="glass-card rounded-[2rem] p-7 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white tracking-tight">Next Month Forecast</h3>
            </div>
            <p className="text-sm text-slate-400 font-medium mb-4 leading-relaxed">
              AI analysis of your 90-day spending velocity suggests a budget of:
            </p>
            <div className="text-3xl font-black text-white mb-2 tabular-nums">
              {predictedBudget > 0 ? formatCurrency(predictedBudget) : "Analyzing..."}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-tighter">Accurate</span>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">+5% contingency buffer included</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const colors = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/10',
  };

  return (
    <div className="glass-card rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between h-40">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
            trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-1">{title}</p>
        <h2 className="text-2xl font-black text-white tracking-tight truncate">{value}</h2>
      </div>
    </div>
  );
}

function ScoreCard({ scoreData }) {
  return (
    <div className="glass-card rounded-[2rem] p-6 border border-white/5 relative overflow-hidden h-40 flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2.5 bg-brand-500/20 rounded-xl text-brand-400">
          <Activity className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-white/5 text-slate-300`}>
          CREDIT
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-1">Health Score</p>
        <div className="flex items-end gap-2">
          <h2 className={`text-3xl font-black tracking-tight ${scoreData.color.replace('text-', 'text-')}`}>{scoreData.score}</h2>
          <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">/ 100 &bull; {scoreData.label}</span>
        </div>
      </div>
    </div>
  );
}

