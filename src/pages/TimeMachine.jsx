import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { Rocket, Sparkles, Clock, Target, Wallet } from 'lucide-react';

export default function TimeMachine() {
    const { expenses, incomes, settings } = useFinance();
    const [years, setYears] = useState(1);

    // Current Math Baseline
    const currentDate = new Date();
    const currentMonthExpenses = expenses
        .filter(e => new Date(e.date).getMonth() === currentDate.getMonth())
        .reduce((sum, e) => sum + Number(e.amount), 0);
        
    const currentMonthIncomes = incomes
        .filter(i => new Date(i.date).getMonth() === currentDate.getMonth())
        .reduce((sum, i) => sum + Number(i.amount), 0);
        
    const currentMonthlySavings = Math.max(0, currentMonthIncomes - currentMonthExpenses);

    // Future Math
    const projectedSavings = currentMonthlySavings * 12 * years;
    
    // Goal Math
    const goalAmount = Number(settings?.goalAmount) || 0;
    const goalName = settings?.goalName || 'Your Goal';
    
    const goalProgressPercent = goalAmount > 0 ? Math.min((projectedSavings / goalAmount) * 100, 100) : 100;
    const remainingPercent = Math.max(0, 100 - goalProgressPercent);

    return (
        <div className="relative min-h-[calc(100vh-80px)] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-4 md:p-8 flex items-center justify-center">
            
            {/* Animated Space Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="stars-bg"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-12 pb-10">
                
                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 border border-indigo-500/20">
                        <Rocket className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-brand-300 bg-clip-text text-transparent pb-1">
                        Time Machine
                    </h1>
                    <p className="text-lg text-indigo-200/70 font-light flex justify-center items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Fast forward your savings
                    </p>
                </header>

                {/* Time Slider */}
                <div className="glass p-6 rounded-3xl border border-indigo-500/30 text-center shadow-[0_0_30px_-5px_rgba(99,102,241,0.1)]">
                    <h3 className="text-sm font-medium text-indigo-300 mb-6 uppercase tracking-widest">Select Future Horizon</h3>
                    <div className="flex justify-between items-center relative z-10">
                        {[1, 3, 5, 10].map(y => (
                            <button 
                                key={y}
                                onClick={() => setYears(y)}
                                className={`flex-1 mx-2 py-3 rounded-xl transition-all duration-300 font-semibold text-sm md:text-lg ${
                                    years === y 
                                        ? 'bg-indigo-500 shadow-[0_0_20px_0_rgba(99,102,241,0.5)] text-white scale-105' 
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {y} {y === 1 ? 'Year' : 'Years'}
                            </button>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-slate-400">
                        <Clock className="w-4 h-4 inline mr-1 -mt-1"/>
                        In {years} {years === 1 ? 'Year' : 'Years'}, your savings will be:
                    </p>
                    
                    {/* Big Metric Display */}
                    <div className="mt-6 pt-6 border-t border-slate-800/50">
                        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                            <span className="text-slate-400 text-sm block mb-2 flex items-center justify-center gap-2">
                                <Wallet className="w-4 h-4 text-emerald-400" /> Projected Total Savings
                            </span>
                            <span className="text-5xl font-bold bg-gradient-to-br from-emerald-300 to-teal-500 bg-clip-text text-transparent">
                                {formatCurrency(projectedSavings)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Goal Tracker Module */}
                <div className="glass p-8 rounded-3xl border border-brand-500/20 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-indigo-500" />
                    
                    <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
                        <Target className="w-5 h-5 text-brand-400" /> Goal Completion: {goalName}
                    </h3>

                    {/* Progress Bar */}
                    <div className="h-4 bg-slate-800/70 rounded-full overflow-hidden border border-slate-700/50 mb-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <div 
                            className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 transition-all duration-1000 ease-in-out relative"
                            style={{ width: `${goalProgressPercent}%` }}
                        >
                            {/* Inner glare effect for progress bar */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium mb-8">
                        <span className="text-brand-300">{goalProgressPercent.toFixed(1)}% Achieved</span>
                        <span className="text-slate-400 text-xs">Target: {formatCurrency(goalAmount)}</span>
                    </div>

                    {/* Remaining Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-center">
                            <span className="block text-slate-400 text-xs mb-1 uppercase tracking-wider">Goal Reached</span>
                            <span className="text-xl font-bold text-slate-200">{formatCurrency(Math.min(projectedSavings, goalAmount))}</span>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-rose-500/20 text-center">
                            <span className="block text-rose-400/80 text-xs mb-1 uppercase tracking-wider">Remaining Deficit</span>
                            <span className="text-xl font-bold text-rose-400">{remainingPercent.toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    {goalProgressPercent >= 100 && (
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                            <p className="text-emerald-400 text-sm font-medium">
                                🎉 Congratulations! At this rate, you will fully cover the cost of "{goalName}" within the selected timeframe!
                            </p>
                        </div>
                    )}
                </div>

            </div>
            
            <style jsx>{`
                .stars-bg {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0,0,0,0)),
                        radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0));
                    background-repeat: repeat;
                    background-size: 200px 200px;
                    opacity: 0.15;
                    animation: twinkle 5s infinite;
                }
                @keyframes twinkle {
                    0% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.1; }
                }
            `}</style>
        </div>
    );
}
