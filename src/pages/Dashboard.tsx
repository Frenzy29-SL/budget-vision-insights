
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, ArrowDownRight, BarChart3, Wallet, PlusCircle,
  TrendingDown, TrendingUp, Target
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TransactionForm from "@/components/TransactionForm";
import { TransactionItem } from "@/components/TransactionItem";
import EditableAmount from "@/components/EditableAmount";

const Dashboard = () => {
  const { 
    transactions, 
    insights, 
    getIncomeVsExpense, 
    getMonthlyTrends,
    getDailySpendings,
    getExpensesByCategory,
    categories,
    profile,
    updateProfileIncome,
    updateTransaction
  } = useBudget();
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const { income, expense } = getIncomeVsExpense();
  const balance = income - expense;
  const monthlyTrends = getMonthlyTrends();
  const dailySpendings = getDailySpendings();
  const categoryExpenses = getExpensesByCategory();

  const handleUpdateIncome = (newAmount: number) => {
    if (profile) {
      updateProfileIncome(newAmount);
    }
  };

  const handleUpdateBalance = (newAmount: number) => {
    // To update balance, we need to create a new transaction that adjusts the balance
    // We find the first income transaction and update it to achieve the desired balance
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    
    if (incomeTransactions.length > 0) {
      const firstIncomeTransaction = incomeTransactions[0];
      // Calculate the difference needed to make the balance equal to newAmount
      const currentBalance = income - expense;
      const difference = newAmount - currentBalance;
      
      // Update the transaction amount
      const newTransactionAmount = firstIncomeTransaction.amount + difference;
      if (newTransactionAmount >= 0) {
        updateTransaction(firstIncomeTransaction.id, newTransactionAmount);
      }
    }
  };

  // Handle potential null profile
  if (!profile) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <p>Loading profile data...</p>
        </div>
      </Layout>
    );
  }

  const pieData = Object.keys(categoryExpenses).map(catId => {
    const category = categories.find(c => c.id === catId);
    return {
      name: category?.name || 'Other',
      value: categoryExpenses[catId],
      color: category?.color.replace('bg-', '') || 'budget-gray'
    };
  });

  const toggleTransactionForm = () => {
    setShowTransactionForm(!showTransactionForm);
  };

  const COLORS = [
    '#9b87f5', '#7E69AB', '#60a5fa', '#4ade80', '#f87171', 
    '#facc15', '#fb923c', '#8E9196', '#6E59A5', '#D6BCFA'
  ];

  // Custom formatters for Recharts tooltips
  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Financial summary */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Balance cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-purple-100 shadow-sm hover:shadow-md transition-shadow border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-purple-800">Total Balance</div>
                  <div className="bg-budget-primary/10 p-2 rounded-full">
                    <Wallet size={20} className="text-budget-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <EditableAmount 
                    value={balance} 
                    onUpdate={handleUpdateBalance} 
                    className="text-purple-900"
                  />
                  <div className="text-xs text-purple-700 mt-1">Current funds</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-100 shadow-sm hover:shadow-md transition-shadow border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-purple-800">Income</div>
                  <div className="bg-budget-green/10 p-2 rounded-full">
                    <ArrowUpRight size={20} className="text-budget-green" />
                  </div>
                </div>
                <div className="mt-2">
                  <EditableAmount 
                    value={income} 
                    onUpdate={(newAmount) => {
                      // Find an income transaction to update
                      const incomeTransactions = transactions.filter(t => t.type === 'income');
                      if (incomeTransactions.length > 0) {
                        const totalCurrentIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
                        const difference = newAmount - totalCurrentIncome;
                        updateTransaction(incomeTransactions[0].id, incomeTransactions[0].amount + difference);
                      }
                    }}
                    className="text-purple-900" 
                  />
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+10% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-100 shadow-sm hover:shadow-md transition-shadow border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-purple-800">Expenses</div>
                  <div className="bg-budget-red/10 p-2 rounded-full">
                    <ArrowDownRight size={20} className="text-budget-red" />
                  </div>
                </div>
                <div className="mt-2">
                  <EditableAmount 
                    value={expense} 
                    onUpdate={(newAmount) => {
                      // Find an expense transaction to update
                      const expenseTransactions = transactions.filter(t => t.type === 'expense');
                      if (expenseTransactions.length > 0) {
                        const totalCurrentExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
                        const difference = newAmount - totalCurrentExpense;
                        updateTransaction(expenseTransactions[0].id, expenseTransactions[0].amount + difference);
                      }
                    }}
                    className="text-purple-900" 
                  />
                  <div className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingDown size={14} className="mr-1" />
                    <span>+5% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart section */}
          <Card className="bg-purple-50 shadow-sm border-purple-200">
            <CardContent className="p-6">
              <Tabs defaultValue="monthly">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-purple-900">Financial Overview</h3>
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="category">By Category</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="monthly" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: any) => [formatTooltipValue(value), '']} 
                        labelFormatter={(label: any) => `${label}`}
                      />
                      <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="daily" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailySpendings}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: any) => [formatTooltipValue(value), 'Spent']} 
                        labelFormatter={(label: any) => `${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ fill: '#9b87f5', r: 4 }}
                        activeDot={{ fill: '#7E69AB', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="category" className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}: {name: string, percent: number}) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: any) => [formatTooltipValue(value), '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Recent transactions */}
          <Card className="bg-purple-50 shadow-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-900">Recent Transactions</h3>
                <Button variant="outline" size="sm" onClick={toggleTransactionForm}>
                  <PlusCircle size={16} className="mr-2" />
                  Add New
                </Button>
              </div>
              
              {showTransactionForm && (
                <div className="mb-6 p-4 border border-border rounded-lg">
                  <TransactionForm onComplete={() => setShowTransactionForm(false)} />
                </div>
              )}
              
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
              
              {transactions.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/transactions">View All Transactions</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Insights and goals */}
        <div className="space-y-6">
          {/* Profile card */}
          <Card className="bg-purple-50 shadow-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-budget-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold uppercase">{profile.type.charAt(0)}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium capitalize text-purple-900">{profile.type} Profile</h3>
                  <p className="text-sm text-muted-foreground capitalize">{profile.budgetingStyle} budget style</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Income:</span>
                    <EditableAmount 
                      value={profile.income} 
                      onUpdate={handleUpdateIncome} 
                      className="text-sm font-medium" 
                    />
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Savings Target:</span>
                    <span className="font-medium">${profile.savingsTarget}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Savings Rate:</span>
                    <span className="font-medium">
                      {((profile.savingsTarget / profile.income) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Insights */}
          <Card className="bg-purple-50 shadow-sm border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-purple-900 mb-4">Financial Insights</h3>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className="p-3 border border-purple-200 bg-white rounded-lg hover:border-budget-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-purple-900">{insight.title}</h4>
                      <div 
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          insight.type === 'saving' ? 'bg-budget-green/10 text-budget-green' :
                          insight.type === 'income' ? 'bg-budget-blue/10 text-budget-blue' :
                          'bg-budget-orange/10 text-budget-orange'
                        }`}
                      >
                        {insight.type}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Impact</span>
                        <span>{insight.impactScore}/100</span>
                      </div>
                      <Progress value={insight.impactScore} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="bg-purple-50 shadow-sm border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-purple-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button className="justify-start" variant="outline" asChild>
                  <a href="/transactions">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </a>
                </Button>
                <Button className="justify-start" variant="outline" asChild>
                  <a href="/goals">
                    <Target className="mr-2 h-4 w-4" />
                    Set Goals
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
