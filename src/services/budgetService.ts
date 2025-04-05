
import { mockData, profileTemplates, categories } from "../data/mockData";
import { Transaction, Category, Budget, Goal, FinancialInsight, ProfileType, Profile } from "../types/budget";

class BudgetService {
  private data = { ...mockData };

  // Transaction methods
  getAllTransactions(): Transaction[] {
    return this.data.transactions;
  }

  getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
    return this.data.transactions.filter(t => t.type === type);
  }

  getTransactionsByCategory(categoryId: string): Transaction[] {
    return this.data.transactions.filter(t => t.category.id === categoryId);
  }

  getTransactionsByDateRange(start: Date, end: Date): Transaction[] {
    return this.data.transactions.filter(t => 
      t.date >= start && t.date <= end
    );
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = {
      ...transaction,
      id: `trans-${Date.now()}`
    };
    this.data.transactions = [newTransaction, ...this.data.transactions];
    return newTransaction;
  }

  updateTransaction(transactionId: string, amount: number): Transaction | null {
    const index = this.data.transactions.findIndex(t => t.id === transactionId);
    if (index >= 0) {
      this.data.transactions[index] = {
        ...this.data.transactions[index],
        amount
      };
      return this.data.transactions[index];
    }
    return null;
  }

  // Budget methods
  getAllBudgets(): Budget[] {
    return this.data.budgets;
  }

  getBudgetByCategory(categoryId: string): Budget | undefined {
    return this.data.budgets.find(b => b.categoryId === categoryId);
  }

  updateBudget(budget: Budget): Budget {
    const index = this.data.budgets.findIndex(b => b.id === budget.id);
    if (index >= 0) {
      this.data.budgets[index] = budget;
    }
    return budget;
  }

  // Goal methods
  getAllGoals(): Goal[] {
    return this.data.goals;
  }

  updateGoal(goal: Goal): Goal {
    const index = this.data.goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      this.data.goals[index] = goal;
    }
    return goal;
  }

  addGoal(goal: Omit<Goal, 'id'>): Goal {
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    this.data.goals.push(newGoal);
    return newGoal;
  }

  // Profile methods
  getCurrentProfile(): Profile {
    return this.data.currentProfile;
  }

  setProfileType(type: ProfileType): Profile {
    this.data.currentProfile = { ...profileTemplates[type] };
    return this.data.currentProfile;
  }

  updateProfileIncome(amount: number): Profile {
    if (this.data.currentProfile) {
      this.data.currentProfile = {
        ...this.data.currentProfile,
        income: amount
      };
    }
    return this.data.currentProfile;
  }

  // Category methods
  getAllCategories(): Category[] {
    return categories;
  }

  getCategoriesByType(type: 'income' | 'expense'): Category[] {
    return categories.filter(c => c.type === type);
  }

  // Insight methods
  getAllInsights(): FinancialInsight[] {
    return this.data.insights;
  }

  // Analytics methods
  getExpensesByCategory(): Record<string, number> {
    const result: Record<string, number> = {};
    this.getTransactionsByType('expense').forEach(t => {
      const { id } = t.category;
      if (!result[id]) result[id] = 0;
      result[id] += t.amount;
    });
    return result;
  }

  getIncomeVsExpense(): { income: number; expense: number } {
    const income = this.getTransactionsByType('income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = this.getTransactionsByType('expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  }

  getMonthlyTrends(): Array<{ month: string; income: number; expense: number }> {
    const now = new Date();
    const result: Array<{ month: string; income: number; expense: number }> = [];
    
    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthlyTransactions = this.getTransactionsByDateRange(month, monthEnd);
      const income = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        month: month.toLocaleString('default', { month: 'short' }),
        income,
        expense
      });
    }
    
    return result;
  }

  getDailySpendings(): Array<{ date: string; amount: number }> {
    const now = new Date();
    const result: Array<{ date: string; amount: number }> = [];
    
    // Get data for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const dailyTransactions = this.getTransactionsByDateRange(date, nextDate);
      const expense = dailyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        date: date.toLocaleString('default', { day: '2-digit', month: 'short' }),
        amount: expense
      });
    }
    
    return result;
  }

  // Savings projection
  projectSavings(months: number): number {
    const { income, expense } = this.getIncomeVsExpense();
    const monthlySavings = (income - expense) / 2; // Assuming 2 months of data
    return monthlySavings * months;
  }
}

export const budgetService = new BudgetService();
