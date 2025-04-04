
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { budgetService } from '../services/budgetService';
import { 
  Transaction, Category, Budget, Goal, FinancialInsight, ProfileType, Profile
} from '../types/budget';
import { useToast } from "@/components/ui/use-toast";

interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  insights: FinancialInsight[];
  categories: Category[];
  profile: Profile | null;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  setProfileType: (type: ProfileType) => void;
  getExpensesByCategory: () => Record<string, number>;
  getIncomeVsExpense: () => { income: number; expense: number };
  getMonthlyTrends: () => Array<{ month: string; income: number; expense: number }>;
  getDailySpendings: () => Array<{ date: string; amount: number }>;
  projectSavings: (months: number) => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial data
    setTransactions(budgetService.getAllTransactions());
    setBudgets(budgetService.getAllBudgets());
    setGoals(budgetService.getAllGoals());
    setInsights(budgetService.getAllInsights());
    setCategories(budgetService.getAllCategories());
    setProfile(budgetService.getCurrentProfile());
    setIsLoading(false);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = budgetService.addTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      toast({
        title: "Transaction added",
        description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount.toFixed(2)} recorded.`,
      });
    } catch (error) {
      toast({
        title: "Error adding transaction",
        description: "There was a problem adding your transaction.",
        variant: "destructive"
      });
    }
  };

  const updateBudget = (budget: Budget) => {
    try {
      budgetService.updateBudget(budget);
      setBudgets(prev => prev.map(b => b.id === budget.id ? budget : b));
      toast({
        title: "Budget updated",
        description: `Your budget for ${budget.categoryId} has been updated.`
      });
    } catch (error) {
      toast({
        title: "Error updating budget",
        description: "There was a problem updating your budget.",
        variant: "destructive"
      });
    }
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    try {
      const newGoal = budgetService.addGoal(goal);
      setGoals(prev => [...prev, newGoal]);
      toast({
        title: "Savings goal added",
        description: `New goal "${goal.name}" has been created.`
      });
    } catch (error) {
      toast({
        title: "Error adding goal",
        description: "There was a problem adding your goal.",
        variant: "destructive"
      });
    }
  };

  const updateGoal = (goal: Goal) => {
    try {
      budgetService.updateGoal(goal);
      setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
      toast({
        title: "Goal updated",
        description: `Your goal "${goal.name}" has been updated.`
      });
    } catch (error) {
      toast({
        title: "Error updating goal",
        description: "There was a problem updating your goal.",
        variant: "destructive"
      });
    }
  };

  const setProfileType = (type: ProfileType) => {
    try {
      const newProfile = budgetService.setProfileType(type);
      setProfile(newProfile);
      toast({
        title: "Profile changed",
        description: `Your profile has been updated to ${type}.`
      });
    } catch (error) {
      toast({
        title: "Error changing profile",
        description: "There was a problem changing your profile.",
        variant: "destructive"
      });
    }
  };

  const getExpensesByCategory = () => budgetService.getExpensesByCategory();
  const getIncomeVsExpense = () => budgetService.getIncomeVsExpense();
  const getMonthlyTrends = () => budgetService.getMonthlyTrends();
  const getDailySpendings = () => budgetService.getDailySpendings();
  const projectSavings = (months: number) => budgetService.projectSavings(months);

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        insights,
        categories,
        profile,
        isLoading,
        addTransaction,
        updateBudget,
        addGoal,
        updateGoal,
        setProfileType,
        getExpensesByCategory,
        getIncomeVsExpense,
        getMonthlyTrends,
        getDailySpendings,
        projectSavings
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
