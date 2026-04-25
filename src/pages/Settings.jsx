import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  CreditCard,
  Target,
  Wallet,
  Trash2,
  Save,
  CheckCircle2
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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function Settings() {
  const { settings, updateSettings, clearAllData } = useFinance();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to erase all financial data? This cannot be undone.")) {
      clearAllData();
      alert("Data cleared successfully.");
      window.location.reload();
    }
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
          System Preferences
        </motion.h1>
        <motion.p variants={item} className="text-slate-400 font-medium">
          Configure your financial parameters and security protocols.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Tabs (Visual only for now) */}
        <motion.div variants={item} className="lg:col-span-1 space-y-3">
          {[
            { icon: User, label: 'Profile' },
            { icon: SettingsIcon, label: 'Configuration', active: true },
            { icon: Bell, label: 'Notifications' },
            { icon: Shield, label: 'Security' },
            { icon: Database, label: 'Data Management' },
          ].map((tab, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border transition-all cursor-pointer ${
                tab.active 
                  ? 'bg-brand-600/10 border-brand-500/20 text-brand-400' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
            </div>
          ))}

          <div className="pt-6">
            <button 
              onClick={handleClearData}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border border-rose-500/10 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all group"
            >
              <Trash2 className="w-5 h-5 group-hover:shake" />
              <span className="text-sm font-bold uppercase tracking-widest">Wipe All Data</span>
            </button>
          </div>
        </motion.div>

        {/* Settings Form */}
        <motion.div variants={item} className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/5 space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="space-y-8 relative z-10">
              <section className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-brand-500/20 rounded-xl text-brand-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  Financial Baseline
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Monthly Budget Target</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                      <input 
                        type="number"
                        value={formData.monthlyBudget}
                        onChange={e => setFormData({ ...formData, monthlyBudget: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Primary Currency</label>
                    <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300 focus:border-brand-500/50 outline-none transition-all appearance-none">
                      <option>INR (₹) - Indian Rupee</option>
                      <option>USD ($) - US Dollar</option>
                      <option>EUR (€) - Euro</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <Target className="w-5 h-5" />
                  </div>
                  Active Objective
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Objective Label</label>
                    <input 
                      type="text"
                      value={formData.goalName}
                      onChange={e => setFormData({ ...formData, goalName: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all"
                      placeholder="e.g. Dream Vacation"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Target Amount</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                      <input 
                        type="number"
                        value={formData.goalAmount}
                        onChange={e => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold text-white focus:border-brand-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="pt-10 flex items-center justify-between relative z-10 border-t border-white/5">
              <div className="flex items-center gap-3">
                {isSaved && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Changes Applied
                  </motion.div>
                )}
              </div>
              <button 
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-brand-600/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
              >
                <Save className="w-5 h-5" />
                Commit Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
