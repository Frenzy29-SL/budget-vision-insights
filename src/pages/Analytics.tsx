import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBudget } from '@/contexts/BudgetContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const { 
    getExpensesByCategory, 
    getIncomeVsExpense, 
    getMonthlyTrends,
    getDailySpendings,
    projectSavings
  } = useBudget();

  const expensesByCategory = getExpensesByCategory();
  const incomeVsExpense = getIncomeVsExpense();
  const monthlyTrends = getMonthlyTrends();
  const dailySpendings = getDailySpendings();
  const projectedSavings = projectSavings(6);

  // Transform data for pie chart
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <Layout title="Analytics">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${incomeVsExpense.income.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${incomeVsExpense.expense.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +10.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Savings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(incomeVsExpense.income - incomeVsExpense.expense).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {incomeVsExpense.income > incomeVsExpense.expense 
                  ? `${((incomeVsExpense.income - incomeVsExpense.expense) / incomeVsExpense.income * 100).toFixed(1)}% of income`
                  : 'Negative savings'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Comparison of your income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Income', amount: incomeVsExpense.income },
                      { name: 'Expenses', amount: incomeVsExpense.expense }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: any) => {
                        if (typeof value === 'number') {
                          return [`$${value.toFixed(2)}`, ''];
                        }
                        return [`${value}`, ''];
                      }} 
                    />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>
                  Breakdown of your spending by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: any) => {
                        if (typeof value === 'number') {
                          return [`$${value.toFixed(2)}`, ''];
                        }
                        return [`${value}`, ''];
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Your income and expenses over the past months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`$${value.toFixed(2)}`, ''];
                      }
                      return [`${value}`, ''];
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Trends</CardTitle>
              <CardDescription>
                Your income over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`$${value.toFixed(2)}`, ''];
                      }
                      return [`${value}`, ''];
                    }} 
                  />
                  <Area type="monotone" dataKey="income" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>
                Your spending patterns by day
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailySpendings}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`$${value.toFixed(2)}`, ''];
                      }
                      return [`${value}`, ''];
                    }} 
                  />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Breakdown of your expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: any) => {
                        if (typeof value === 'number') {
                          return [`$${value.toFixed(2)}`, ''];
                        }
                        return [`${value}`, ''];
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
                <CardDescription>
                  Your highest spending categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(expensesByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([category, amount], index) => (
                      <div key={category} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{category}</div>
                          <div className="h-2 w-full bg-muted rounded-full mt-1">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${(amount / Object.values(expensesByCategory).reduce((a, b) => a + b, 0)) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2 text-sm font-medium">${amount.toFixed(2)}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Projection</CardTitle>
              <CardDescription>
                Projected savings over the next 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium">Projected savings</p>
                  <h3 className="text-2xl font-bold">${projectedSavings.toFixed(2)}</h3>
                </div>
                <div className="flex items-center">
                  {projectedSavings > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={projectedSavings > 0 ? "text-green-500" : "text-red-500"}>
                    {projectedSavings > 0 ? "Growing" : "Declining"}
                  </span>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart
                  data={Array.from({ length: 6 }, (_, i) => ({
                    month: `Month ${i + 1}`,
                    savings: projectedSavings / 6 * (i + 1)
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`$${value.toFixed(2)}`, ''];
                      }
                      return [`${value}`, ''];
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses Trend</CardTitle>
              <CardDescription>
                Comparison over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`$${value.toFixed(2)}`, ''];
                      }
                      return [`${value}`, ''];
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Analytics;
