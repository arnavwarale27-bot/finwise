import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { Rocket, Sparkles, Clock, Target, Wallet, ArrowRight } from 'lucide-react';

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

export default function TimeMachine() {
    const { expenses, incomes, settings } = useFinance();
    const [years, setYears] = useState(1);

    const currentDate = new Date();
    const currentMonthExpenses = expenses
        .filter(e => new Date(e.date).getMonth() === currentDate.getMonth())
        .reduce((sum, e) => sum + Number(e.amount), 0);
        
    const currentMonthIncomes = incomes
        .filter(i => new Date(i.date).getMonth() === currentDate.getMonth())
        .reduce((sum, i) => sum + Number(i.amount), 0);
        
    const currentMonthlySavings = Math.max(0, currentMonthIncomes - currentMonthExpenses);
    const projectedSavings = currentMonthlySavings * 12 * years;
    
    const goalAmount = Number(settings?.goalAmount) || 0;
    const goalName = settings?.goalName || 'Portfolio Objective';
    
    const goalProgressPercent = goalAmount > 0 ? Math.min((projectedSavings / goalAmount) * 100, 100) : 100;

    return (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative min-h-[calc(100vh-140px)] rounded-[3rem] overflow-hidden bg-[#020617] border border-white/5 shadow-2xl p-8 md:p-16 flex items-center justify-center"
        >
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
                
                {/* Animated Stars */}
                <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-white rounded-full"
                      initial={{ 
                        opacity: Math.random(),
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%"
                      }}
                      animate={{ 
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-12">
                {/* Header */}
                <header className="text-center space-y-6">
                    <motion.div 
                      variants={item}
                      className="inline-flex items-center justify-center p-4 bg-brand-500/10 rounded-[2rem] mb-2 border border-brand-500/20 shadow-2xl shadow-brand-500/10"
                    >
                        <Rocket className="w-10 h-10 text-brand-400 animate-float" />
                    </motion.div>
                    <div className="space-y-2">
                      <motion.h1 
                        variants={item}
                        className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tighter"
                      >
                          Temporal Horizon
                      </motion.h1>
                      <motion.p variants={item} className="text-lg text-slate-500 font-bold uppercase tracking-[0.3em] flex justify-center items-center gap-3">
                          <Sparkles className="w-4 h-4 text-brand-400" /> Projected Velocity
                      </motion.p>
                    </div>
                </header>

                {/* Horizon Selector */}
                <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border border-white/5 text-center shadow-2xl relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-500/10 transition-colors" />
                    
                    <h3 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.25em]">Initialize Future Horizon</h3>
                    <div className="flex justify-between items-center gap-3 relative z-10">
                        {[1, 3, 5, 10].map(y => (
                            <button 
                                key={y}
                                onClick={() => setYears(y)}
                                className={`flex-1 py-4 rounded-2xl transition-all duration-500 font-black text-xs md:text-sm uppercase tracking-widest ${
                                    years === y 
                                        ? 'bg-brand-600 shadow-xl shadow-brand-600/30 text-white scale-105' 
                                        : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                {y} {y === 1 ? 'Year' : 'Years'}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-10 pt-10 border-t border-white/5 relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                           <Clock className="w-3.5 h-3.5" /> Estimated Portfolio Value
                        </p>
                        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                            <AnimatePresence mode="wait">
                              <motion.span 
                                key={years}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-5xl md:text-6xl font-black text-white tracking-tighter block mb-2 tabular-nums"
                              >
                                  {formatCurrency(projectedSavings)}
                              </motion.span>
                            </AnimatePresence>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                              Based on current monthly surplus of {formatCurrency(currentMonthlySavings)}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Strategic Alignment */}
                <motion.div variants={item} className="glass-card p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-600" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <h3 className="text-lg font-bold text-white flex items-center gap-3">
                          <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                            <Target className="w-5 h-5" />
                          </div>
                          Objective Alignment
                      </h3>
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{goalName}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8 relative z-10">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-brand-400">{goalProgressPercent.toFixed(1)}%</span>
                      </div>
                      <div className="h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${goalProgressPercent}%` }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-brand-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                          />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                        <span>Initialized</span>
                        <span>{formatCurrency(goalAmount)} Target</span>
                      </div>
                    </div>

                    <div className="p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10 flex items-center justify-between relative z-10 group/btn cursor-pointer hover:bg-brand-500/10 transition-all">
                        <p className="text-sm font-bold text-brand-200 leading-relaxed max-w-[80%]">
                            {goalProgressPercent >= 100 
                              ? `Neural models confirm the target "${goalName}" will be successfully acquired.`
                              : `Current trajectory requires additional optimization to realize this objective.`
                            }
                        </p>
                        <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400 group-hover/btn:translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

