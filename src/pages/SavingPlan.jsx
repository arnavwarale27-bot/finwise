import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { generateSIPRecommendation } from '../utils/gemini';
import { Target, LoaderPinwheel, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-slate-100 mb-2 mt-4 md:mt-0">
          SIP Recommender
        </h1>
        <p className="text-sm text-slate-400">Powered by cutting-edge Gemini AI models.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-brand-500/20 h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
            <Target className="w-5 h-5 text-brand-400" />
            Define Your Goal
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">What are you saving for?</label>
              <textarea
                required
                rows="4"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-500/50 resize-none custom-scrollbar"
                placeholder="E.g., I want to buy a new laptop worth ₹80,000 in 6 months. I currently save roughly ₹10,000 a month."
                value={goal}
                onChange={e => setGoal(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><LoaderPinwheel className="w-5 h-5 animate-spin"/> Generating Plan...</>
              ) : (
                'Generate Expert Plan'
              )}
            </button>
          </form>
        </div>

        <div className="glass rounded-2xl p-6 border border-brand-500/20 min-h-[400px]">
           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-5 h-5 text-brand-400" />
            Your Action Plan
          </h2>
          
          <div className="prose prose-invert prose-brand max-w-none prose-p:leading-relaxed prose-p:text-slate-300">
            {!recommendation && !loading && (
              <div className="text-center py-20 text-slate-500">
                <p>Define a goal on the left and click "Generate" to receive an AI-tailored SIP action plan.</p>
              </div>
            )}
            
            {loading && (
               <div className="text-center py-20 text-brand-300 flex flex-col items-center gap-4">
                 <LoaderPinwheel className="w-8 h-8 animate-spin" />
                 <p className="animate-pulse">Consulting the FinWise intelligence...</p>
               </div>
            )}

            {recommendation && !loading && (
              <div dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n\n/g, '</p><p>').replace(/\*\*/g, '<strong>') }} className="space-y-4 text-sm whitespace-pre-line bg-slate-800/20 p-6 rounded-xl border border-slate-700/30" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
