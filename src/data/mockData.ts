
import { Transaction, Category, Budget, Goal, Profile, FinancialInsight } from "../types/budget";
import { 
  Briefcase, GraduationCap, Home, ShoppingBag, Utensils, 
  Car, Pill, Film, Music, Plane, Smartphone, Gift, Coffee,
  BookOpen, DollarSign, Zap, CreditCard, Landmark
} from "lucide-react";

// Helper to generate random dates within a range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Fixed categories
export const categories: Category[] = [
  // Income categories
  { id: "salary", name: "Salary", color: "bg-budget-green", type: "income", icon: "Briefcase" },
  { id: "freelance", name: "Freelance", color: "bg-budget-blue", type: "income", icon: "Code" },
  { id: "investments", name: "Investments", color: "bg-budget-purple", type: "income", icon: "TrendingUp" },
  { id: "gifts", name: "Gifts", color: "bg-budget-yellow", type: "income", icon: "Gift" },
  { id: "other_income", name: "Other", color: "bg-budget-gray", type: "income", icon: "DollarSign" },
  
  // Expense categories
  { id: "housing", name: "Housing", color: "bg-budget-red", type: "expense", icon: "Home" },
  { id: "food", name: "Food", color: "bg-budget-orange", type: "expense", icon: "Utensils" },
  { id: "transport", name: "Transport", color: "bg-budget-blue", type: "expense", icon: "Car" },
  { id: "healthcare", name: "Healthcare", color: "bg-budget-green", type: "expense", icon: "Pill" },
  { id: "entertainment", name: "Entertainment", color: "bg-budget-purple", type: "expense", icon: "Film" },
  { id: "shopping", name: "Shopping", color: "bg-budget-yellow", type: "expense", icon: "ShoppingBag" },
  { id: "education", name: "Education", color: "bg-budget-blue", type: "expense", icon: "BookOpen" },
  { id: "utilities", name: "Utilities", color: "bg-budget-red", type: "expense", icon: "Zap" },
  { id: "subscriptions", name: "Subscriptions", color: "bg-budget-purple", type: "expense", icon: "CreditCard" },
  { id: "misc", name: "Miscellaneous", color: "bg-budget-gray", type: "expense", icon: "Package" },
];

// Generate mock transactions for the last 60 days
const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setDate(today.getDate() - 60);
  
  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.7; // 30% are income transactions
    const typeCategories = categories.filter(cat => cat.type === (isIncome ? 'income' : 'expense'));
    const category = typeCategories[Math.floor(Math.random() * typeCategories.length)];
    
    // Generate a reasonable amount based on the category
    let amount;
    if (isIncome) {
      if (category.id === 'salary') {
        amount = 2000 + Math.random() * 3000; // $2000-$5000
      } else {
        amount = 50 + Math.random() * 950; // $50-$1000
      }
    } else {
      switch (category.id) {
        case 'housing':
          amount = 500 + Math.random() * 1500; // $500-$2000
          break;
        case 'food':
          amount = 10 + Math.random() * 90; // $10-$100
          break;
        default:
          amount = 5 + Math.random() * 195; // $5-$200
      }
    }
    
    transactions.push({
      id: `trans-${i}`,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      category,
      date: getRandomDate(twoMonthsAgo, today),
      description: `${isIncome ? 'Received' : 'Paid for'} ${category.name.toLowerCase()}`,
      type: isIncome ? 'income' : 'expense'
    });
  }
  
  // Sort by date, newest first
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Generate mock budgets
const generateBudgets = (): Budget[] => {
  return categories
    .filter(cat => cat.type === 'expense')
    .map(category => ({
      id: `budget-${category.id}`,
      categoryId: category.id,
      amount: Math.round((100 + Math.random() * 900) * 100) / 100, // $100-$1000
      period: 'monthly' as const,
      current: Math.round((50 + Math.random() * 500) * 100) / 100, // $50-$550
    }));
};

// Generate mock savings goals
const generateGoals = (): Goal[] => {
  const goals: Goal[] = [
    {
      id: 'goal-1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2500,
      deadline: new Date(new Date().getFullYear(), 11, 31), // End of current year
      priority: 'high' as const,
    },
    {
      id: 'goal-2',
      name: 'Vacation',
      targetAmount: 2000,
      currentAmount: 800,
      deadline: new Date(new Date().getFullYear(), 5, 30), // Mid-year
      priority: 'medium' as const,
    },
    {
      id: 'goal-3',
      name: 'New Laptop',
      targetAmount: 1200,
      currentAmount: 300,
      deadline: null,
      priority: 'low' as const,
    }
  ];
  
  return goals;
};

// Profile templates
export const profileTemplates: Record<string, Profile> = {
  employee: {
    type: 'employee',
    income: 4000,
    savingsTarget: 1000,
    budgetingStyle: 'moderate',
    categories: categories,
  },
  student: {
    type: 'student',
    income: 1200,
    savingsTarget: 200,
    budgetingStyle: 'conservative',
    categories: categories.filter(cat => 
      ['food', 'transport', 'education', 'entertainment', 'misc'].includes(cat.id) || cat.type === 'income'
    ),
  },
  housewife: {
    type: 'housewife',
    income: 2500,
    savingsTarget: 500,
    budgetingStyle: 'moderate',
    categories: categories.filter(cat => 
      !['freelance', 'investments'].includes(cat.id)
    ),
  }
};

// Generate financial insights
const generateInsights = (): FinancialInsight[] => {
  return [
    {
      id: 'insight-1',
      title: 'Reduce Food Expenses',
      description: 'You spend 20% more on food than the average user. Consider meal planning to reduce costs.',
      impactScore: 75,
      type: 'spending',
    },
    {
      id: 'insight-2',
      title: 'Savings Potential',
      description: 'Based on your income, you could increase monthly savings by $300 without significant lifestyle changes.',
      impactScore: 85,
      type: 'saving',
    },
    {
      id: 'insight-3',
      title: 'Subscription Audit',
      description: 'You have 5 active subscriptions totaling $45/month. Review if all are necessary.',
      impactScore: 60,
      type: 'spending',
    },
    {
      id: 'insight-4',
      title: 'Income Growth',
      description: 'Adding a side income source could increase your savings rate by 40%.',
      impactScore: 90,
      type: 'income',
    },
  ];
};

// Export mock data
export const mockData = {
  transactions: generateTransactions(60),
  budgets: generateBudgets(),
  goals: generateGoals(),
  insights: generateInsights(),
  currentProfile: {...profileTemplates.employee}
};
