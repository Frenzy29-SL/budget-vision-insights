
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, ArrowDownRight, BarChart3, Wallet, PlusCircle,
  TrendingDown, TrendingUp
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TransactionForm from "@/components/TransactionForm";
import { TransactionItem } from "@/components/TransactionItem";

const Dashboard = () => {
  const { 
    transactions, 
    insights, 
    getIncomeVsExpense, 
    getMonthlyTrends,
    getDailySpendings,
    getExpensesByCategory,
    categories,
    profile
  } = useBudget();
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const { income, expense } = getIncomeVsExpense();
  const balance = income - expense;
  const monthlyTrends = getMonthlyTrends();
  const dailySpendings = getDailySpendings();
  const categoryExpenses = getExpensesByCategory();

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

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Financial summary */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Balance cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">Total Balance</div>
                  <div className="bg-budget-primary/10 p-2 rounded-full">
                    <Wallet size={20} className="text-budget-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Current funds</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">Income</div>
                  <div className="bg-budget-green/10 p-2 rounded-full">
                    <ArrowUpRight size={20} className="text-budget-green" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">${income.toFixed(2)}</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp size={14} className="mr-1" />
                    <span>+10% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground">Expenses</div>
                  <div className="bg-budget-red/10 p-2 rounded-full">
                    <ArrowDownRight size={20} className="text-budget-red" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">${expense.toFixed(2)}</div>
                  <div className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingDown size={14} className="mr-1" />
                    <span>+5% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart section */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="monthly">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Financial Overview</h3>
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
                      <Tooltip 
                        formatter={(value) => [`$${value}`, '']} 
                        labelFormatter={(label) => `${label}`}
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
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Spent']} 
                        labelFormatter={(label) => `${label}`}
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
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Recent transactions */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
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
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-budget-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold uppercase">{profile.type.charAt(0)}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium capitalize">{profile.type} Profile</h3>
                  <p className="text-sm text-muted-foreground capitalize">{profile.budgetingStyle} budget style</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Income:</span>
                    <span className="font-medium">${profile.income}</span>
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
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Financial Insights</h3>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className="p-3 border border-border rounded-lg hover:border-budget-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{insight.title}</h4>
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
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
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
