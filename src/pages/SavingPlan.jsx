import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { generateSIPRecommendation } from '../utils/gemini';
import { Target, LoaderPinwheel, CheckCircle2, Sparkles, BrainCircuit, Rocket } from 'lucide-react';

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

export default function SavingPlan() {
  const { expenses, incomes, settings } = useFinance();
  const [goal, setGoal] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal) return;

    setLoading(true);
    const result = await generateSIPRecommendation(expenses, incomes, settings, goal);
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-10"
    >
      <header>
        <motion.h1 variants={item} className="text-4xl font-bold text-white mb-2 tracking-tight">
          SIP Intelligence
        </motion.h1>
        <motion.p variants={item} className="text-slate-400 font-medium">
          Strategic investment planning powered by <span className="text-brand-400">Gemini Neural Models</span>.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div variants={item} className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-brand-500/10 transition-colors" />
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white relative z-10">
              <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                <Target className="w-5 h-5" />
              </div>
              Define Your Objective
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Goal Description</label>
                <textarea
                  required
                  rows="5"
                  className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all resize-none placeholder:text-slate-700"
                  placeholder="E.g., I want to buy a new Macbook Pro M3 worth ₹2.5L in 12 months. I can allocate ₹15k monthly."
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-brand-600/10 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? (
                  <><LoaderPinwheel className="w-5 h-5 animate-spin"/> Processing...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Strategy</>
                )}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Neural Forecasting</h4>
                <p className="text-[11px] font-medium text-slate-500">AI considers inflation, market volatility, and your risk profile.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-[2.5rem] p-8 border border-white/5 min-h-[500px] relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -ml-48 -mt-48" />
           
           <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white relative z-10">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            Neural Action Plan
          </h2>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!recommendation && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                    <BrainCircuit className="w-10 h-10 text-slate-700" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.15em] text-xs max-w-xs leading-relaxed">
                    Awaiting objective parameters to initialize strategy generation.
                  </p>
                </motion.div>
              )}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center gap-6"
                >
                  <div className="relative">
                    <LoaderPinwheel className="w-12 h-12 text-brand-400 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-brand-400/20 rounded-full animate-pulse" />
                  </div>
                  <p className="text-brand-300 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
                    Consulting FinWise Intelligence Matrix...
                  </p>
                </motion.div>
              )}

              {recommendation && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-sm leading-relaxed"
                >
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: recommendation
                        .replace(/\n\n/g, '</div><div className="mb-4">')
                        .replace(/\*\*/g, '<strong>')
                        .replace(/^- (.*)/gm, '<li className="ml-4 list-disc">$1</li>')
                    }} 
                    className="bg-white/5 p-8 rounded-[2rem] border border-white/5 text-slate-300 font-medium"
                  />
                  <div className="flex justify-center">
                    <button className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Save Strategy to Dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

