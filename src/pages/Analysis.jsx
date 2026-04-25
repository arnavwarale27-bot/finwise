import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  CalendarDays, 
  ArrowDownCircle, 
  Percent,
  ArrowRight,
  Info
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

export default function Analysis() {
  const { expenses, incomes } = useFinance();
  const currentDate = new Date();
  
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const month = d.getMonth();

    const monthExpenses = expenses
      .filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const monthIncomes = incomes
      .filter(i => new Date(i.date).getMonth() === month && new Date(i.date).getFullYear() === year)
      .reduce((sum, i) => sum + Number(i.amount), 0);

    trendData.push({
      name: `${monthName} '${year.toString().slice(-2)}`,
      Income: monthIncomes,
      Expenses: monthExpenses,
      Savings: monthIncomes - monthExpenses
    });
  }

  const currentExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentDate.getMonth());
  const currentIncomes = incomes.filter(i => new Date(i.date).getMonth() === currentDate.getMonth());
  
  const totalCurrentExpenses = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalCurrentIncomes = currentIncomes.reduce((sum, i) => sum + Number(i.amount), 0);

  const dailyAverageSpend = totalCurrentExpenses / 30;

  const categoryTotals = {};
  currentExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  
  let biggestCategory = 'None';
  let highestCatSpend = 0;
  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > highestCatSpend) {
      highestCatSpend = amt;
      biggestCategory = cat;
    }
  }

  let savingsRate = 0;
  if (totalCurrentIncomes > 0) {
    savingsRate = ((totalCurrentIncomes - totalCurrentExpenses) / totalCurrentIncomes) * 100;
  }

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="font-bold text-white mb-2 text-sm">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <p className="text-xs font-bold text-slate-300">
                  {entry.name}: <span className="text-white font-black">{formatCurrency(entry.value)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
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
          Financial Intelligence
        </motion.h1>
        <motion.p variants={item} className="text-slate-400 font-medium">
          Detailed breakdown of your historical performance and categorical spending.
        </motion.p>
      </header>

      {/* Main Trend Chart */}
      <motion.div variants={item} className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-colors group-hover:bg-brand-500/10" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-500/20 rounded-xl text-brand-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">6-Month Trajectory</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expenses</span>
                </div>
              </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={11} 
                    fontWeight="bold"
                    tickLine={false} 
                    axisLine={false}
                    dy={15}
                />
                <YAxis 
                    stroke="#475569" 
                    fontSize={11} 
                    fontWeight="bold"
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `₹${val>=1000 ? (val/1000)+'k' : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 2, strokeDasharray: '4 4' }} />
                
                <Area 
                    type="monotone" 
                    dataKey="Income" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    animationDuration={2000}
                />
                <Area 
                    type="monotone" 
                    dataKey="Expenses" 
                    stroke="#f43f5e" 
                    strokeWidth={4} 
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalysisStat 
            title="Daily Velocity" 
            value={formatCurrency(dailyAverageSpend)} 
            icon={<CalendarDays className="w-5 h-5 text-indigo-400" />}
            subtitle="Calculated on 30-day average"
          />
          <AnalysisStat 
            title="Primary Outflow" 
            value={biggestCategory} 
            icon={<ArrowDownCircle className="w-5 h-5 text-rose-400" />}
            subtitle={highestCatSpend > 0 ? `${formatCurrency(highestCatSpend)} total spend` : "No data logged"}
          />
          <AnalysisStat 
            title="Savings Velocity" 
            value={`${savingsRate.toFixed(1)}%`} 
            icon={<Percent className="w-5 h-5 text-emerald-400" />}
            subtitle="Target is +20% for growth"
            trend={savingsRate > 20 ? 'Positive' : 'Warning'}
          />
      </motion.div>

      {/* Categorical Breakdown */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
          <div className="absolute top-0 left-0 w-full p-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <PieChartIcon className="w-5 h-5 text-brand-400" />
              Resource Allocation
            </h2>
          </div>

          {pieData.length === 0 ? (
            <div className="text-center p-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-bold">Log expenses to see distribution.</p>
            </div>
          ) : (
            <div className="relative w-full h-full pt-10">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={90}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Burn</span>
                <span className="font-black text-3xl text-white tracking-tighter">{formatCurrency(totalCurrentExpenses)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white px-2">Top Expenditure Streams</h3>
          {pieData.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 border border-white/5 h-64 flex items-center justify-center">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Waiting for data...</p>
            </div>
          ) : (
            pieData.map((entry, index) => (
              <motion.div 
                key={entry.name} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div>
                    <span className="font-bold text-slate-200 block text-sm">{entry.name}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {((entry.value / totalCurrentExpenses) * 100).toFixed(1)}% of total
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-white text-lg block">{formatCurrency(entry.value)}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnalysisStat({ title, value, icon, subtitle, trend }) {
  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="flex items-center gap-4 mb-4">
           <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
              {icon}
           </div>
           <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-0.5">{title}</span>
              <span className="text-2xl font-black text-white tracking-tight">{value}</span>
           </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{subtitle}</p>
          {trend && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              trend === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {trend}
            </span>
          )}
        </div>
    </div>
  );
}

