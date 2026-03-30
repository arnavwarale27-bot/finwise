import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finwise_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('finwise_incomes');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('finwise_settings');
    return saved ? JSON.parse(saved) : { 
      monthlyBudget: 50000,
      goalName: "New iPhone",
      goalAmount: 80000 
    };
  });

  useEffect(() => {
    localStorage.setItem('finwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('finwise_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('finwise_settings', JSON.stringify(settings));
  }, [settings]);

  const addExpense = (expense) => {
    setExpenses(prev => [{...expense, id: Date.now().toString(), type: 'expense'}, ...prev]);
  };

  const removeExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addIncome = (income) => {
    setIncomes(prev => [{...income, id: Date.now().toString(), type: 'income'}, ...prev]);
  };

  const removeIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };
  
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearAllData = () => {
    setExpenses([]);
    setIncomes([]);
    localStorage.clear();
  };

  const contextValue = {
    expenses,
    incomes,
    settings,
    addExpense,
    removeExpense,
    addIncome,
    removeIncome,
    updateSettings,
    clearAllData
  };

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
