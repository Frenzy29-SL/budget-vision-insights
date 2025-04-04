
export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: Date;
  description: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  current: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  priority: 'low' | 'medium' | 'high';
}

export type ProfileType = 'employee' | 'student' | 'housewife';

export interface Profile {
  type: ProfileType;
  income: number;
  savingsTarget: number;
  budgetingStyle: 'conservative' | 'moderate' | 'aggressive';
  categories: Category[];
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  impactScore: number; // 1-100
  type: 'saving' | 'spending' | 'income';
}
