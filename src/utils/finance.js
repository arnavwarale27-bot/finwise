export const calculateMoneyScore = (expenses, incomes, budget) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const monthlyIncomes = incomes
    .filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, i) => sum + Number(i.amount), 0);
  
  // Calculate a score out of 100
  // Safe zone: Expenses < 50% of Income/Budget -> 90-100 score
  // Warning zone: Expenses 80% of Income/Budget -> 50-70 score
  // Danger zone: Expenses > Budget/Income -> < 40 score
  
  const targetLimit = monthlyIncomes > 0 ? monthlyIncomes : budget;
  
  if (targetLimit === 0) return { score: 50, label: 'Neutral', color: 'text-yellow-500' };

  const ratio = monthlyExpenses / targetLimit;
  
  let score = 100 - (ratio * 100);
  score = Math.max(0, Math.min(100, score)); // clamp 0-100
  score = Math.round(score);

  if (score >= 80) return { score, label: 'Excellent', color: 'text-emerald-500' };
  if (score >= 50) return { score, label: 'Fair', color: 'text-yellow-500' };
  return { score, label: 'Critical', color: 'text-red-500' };
};

export const predictNextMonthBudget = (expenses) => {
  // Simple heuristic: Average of last 3 months expenses + 5% inflation/buffer
  if (expenses.length === 0) return 0;

  const now = new Date();
  let totalLast3Months = 0;
  
  // Very simplified prediction logic
  const validExpenses = expenses.filter(e => {
    const diffTime = Math.abs(now - new Date(e.date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 90;
  });

  if (validExpenses.length === 0) return 0;

  totalLast3Months = validExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const averageMonthly = totalLast3Months / 3;
  return Math.round(averageMonthly * 1.05); // Add 5% buffer
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
