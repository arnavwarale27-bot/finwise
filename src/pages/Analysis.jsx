import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/finance';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { PieChart as PieChartIcon, TrendingUp, CalendarDays, ArrowDownCircle, Percent } from 'lucide-react';

export default function Analysis() {
  const { expenses, incomes } = useFinance();
  const currentDate = new Date();
  
  // -----------------------------------------------------
  // 1. Calculate 6-Month Trend Data
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // 2. Calculate Current Month KPIs
  // -----------------------------------------------------
  const currentExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentDate.getMonth());
  const currentIncomes = incomes.filter(i => new Date(i.date).getMonth() === currentDate.getMonth());
  
  const totalCurrentExpenses = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalCurrentIncomes = currentIncomes.reduce((sum, i) => sum + Number(i.amount), 0);

  // Daily Average Spend (Divisor fixed at 30 as requested)
  const dailyAverageSpend = totalCurrentExpenses / 30;

  // Biggest Category
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

  // Savings Rate Calculation
  let savingsRate = 0;
  if (totalCurrentIncomes > 0) {
    savingsRate = ((totalCurrentIncomes - totalCurrentExpenses) / totalCurrentIncomes) * 100;
  }

  // Check if we actually have data to graph this month for the pie
  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#64748b'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl drop-shadow-2xl">
          <p className="font-semibold text-slate-200 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-light text-slate-100 mb-2 mt-4 md:mt-0">
          Financial Analysis
        </h1>
        <p className="text-sm text-slate-400">Dive deep into your historical trends and categorical spending.</p>
      </header>

      {/* 3-Line Trend Chart Section */}
      <div className="glass p-6 rounded-3xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold text-slate-200">6-Month Trend Overview</h2>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                />
                <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `₹${val>=1000 ? (val/1000)+'k' : val}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', color: '#cbd5e1' }} />
                
                <Line 
                    type="monotone" 
                    dataKey="Income" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 0, fill: "#10b981" }} 
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="Expenses" 
                    stroke="#f43f5e" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 0, fill: "#f43f5e" }} 
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="Savings" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 0, fill: "#6366f1" }} 
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Stats Row Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                 <CalendarDays className="w-4 h-4" />
                 <span className="text-sm font-medium">Daily Average Spend</span>
              </div>
              <span className="text-2xl font-bold text-slate-100">{formatCurrency(dailyAverageSpend)}</span>
              <p className="text-xs text-slate-500 mt-1">Based on fixed 30-day divisor.</p>
          </div>

          <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                 <ArrowDownCircle className="w-4 h-4" />
                 <span className="text-sm font-medium">Biggest Category (This Month)</span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-100">{biggestCategory}</span>
                  {highestCatSpend > 0 && (
                      <span className="text-sm font-semibold text-rose-400">{formatCurrency(highestCatSpend)}</span>
                  )}
              </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                 <Percent className="w-4 h-4" />
                 <span className="text-sm font-medium">Savings Rate</span>
              </div>
              <span className={`text-2xl font-bold ${savingsRate > 20 ? 'text-emerald-400' : savingsRate > 0 ? 'text-brand-400' : 'text-rose-400'}`}>
                 {savingsRate.toFixed(1)}%
              </span>
              <p className="text-xs text-slate-500 mt-1">Target is usually +20%.</p>
          </div>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="glass rounded-3xl p-6 border border-slate-800 max-w-3xl mx-auto shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-200">
            <PieChartIcon className="w-5 h-5 text-brand-400" />
            Top Spends
          </h2>
        </div>

        {pieData.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No expenses logged for this month yet.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="h-64 w-64 md:h-80 md:w-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-slate-400">Total</span>
                <span className="font-semibold text-xl text-slate-200">{formatCurrency(totalCurrentExpenses)}</span>
              </div>
            </div>

            <div className="space-y-4 flex-1 w-full max-w-sm">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="bg-slate-800/30 p-3 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium text-slate-300">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">
                      {((entry.value / totalCurrentExpenses) * 100).toFixed(1)}%
                    </span>
                    <span className="font-semibold text-slate-100">{formatCurrency(entry.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
