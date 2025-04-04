
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const Analytics = () => {
  const { 
    getExpensesByCategory, 
    getMonthlyTrends, 
    getDailySpendings,
    categories,
    projectSavings
  } = useBudget();
  
  const [timeRange, setTimeRange] = useState<"3m" | "6m" | "1y">("6m");
  const [savingsProjection, setSavingsProjection] = useState<"6m" | "1y" | "5y">("1y");
  
  const monthlyTrends = getMonthlyTrends();
  const dailySpendings = getDailySpendings();
  const categoryExpenses = getExpensesByCategory();
  
  // Format category expenses for pie chart
  const pieData = Object.keys(categoryExpenses).map(catId => {
    const category = categories.find(c => c.id === catId);
    return {
      name: category?.name || 'Other',
      value: categoryExpenses[catId],
      color: category?.color.replace('bg-', '') || 'budget-gray'
    };
  }).sort((a, b) => b.value - a.value);
  
  // Prepare savings projection data
  const generateSavingsProjection = () => {
    const months = savingsProjection === "6m" ? 6 : savingsProjection === "1y" ? 12 : 60;
    const data = [];
    const monthlySaving = projectSavings(1);
    
    for (let i = 0; i < months; i++) {
      data.push({
        month: i + 1,
        savings: Math.round(monthlySaving * (i + 1))
      });
    }
    return data;
  };
  
  // Top spending categories ranking
  const topSpendingCategories = pieData.slice(0, 5).map((item, index) => ({
    ...item,
    rank: index + 1
  }));
  
  // Calculate total income and expenses
  const totalIncome = monthlyTrends.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyTrends.reduce((sum, month) => sum + month.expense, 0);
  
  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  const COLORS = [
    '#9b87f5', '#7E69AB', '#60a5fa', '#4ade80', '#f87171', 
    '#facc15', '#fb923c', '#8E9196', '#6E59A5', '#D6BCFA'
  ];
  
  return (
    <Layout title="Analytics & Insights">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Expense Trends</h3>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, '']} 
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4ade80" stackId="a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses" fill="#f87171" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">Expense Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Top Spending Categories</h3>
              <div className="space-y-4">
                {topSpendingCategories.map((category) => (
                  <div key={category.name} className="flex items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted text-xs font-medium">
                      {category.rank}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="font-medium">${category.value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-budget-primary h-2 rounded-full" 
                          style={{ width: `${(category.value / pieData[0].value) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Daily Spending Pattern</h3>
              <div className="h-64">
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
                      dot={{ fill: '#9b87f5', r: 3 }}
                      activeDot={{ fill: '#7E69AB', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Savings Projection</h3>
                <Select value={savingsProjection} onValueChange={(value) => setSavingsProjection(value as any)}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6m">6 Mo</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="5y">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateSavingsProjection()}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Savings']} 
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#4ade80" 
                      fill="#4ade80" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-6">Financial Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Savings Rate</span>
                  <div className={savingsRate >= 20 ? "text-budget-green" : "text-budget-orange"}>
                    {savingsRate >= 20 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {savingsRate >= 20 
                    ? "Excellent! You're saving well above average."
                    : "Consider increasing your savings rate to at least 20%."}
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Income to Expense Ratio</span>
                  <div className={totalIncome > totalExpenses * 1.5 ? "text-budget-green" : "text-budget-orange"}>
                    {totalIncome > totalExpenses * 1.5 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {totalIncome > 0 ? (totalIncome / totalExpenses).toFixed(2) : "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalIncome > totalExpenses * 1.5
                    ? "Strong ratio indicates good financial health."
                    : "Try to increase this ratio for better financial security."}
                </p>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Monthly Savings</span>
                  <div className="text-budget-primary">
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average monthly amount available for savings or investments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
