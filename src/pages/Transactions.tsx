
import { useState } from "react";
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TransactionItem } from "@/components/TransactionItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, ArrowUpDown } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";

const Transactions = () => {
  const { transactions, categories } = useBudget();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "amount-high" | "amount-low">("newest");
  
  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filterType !== "all" && transaction.type !== filterType) {
      return false;
    }
    
    // Filter by category
    if (filterCategory && transaction.category.id !== filterCategory) {
      return false;
    }
    
    // Search by description
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected order
    switch (sortOrder) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-high":
        return b.amount - a.amount;
      case "amount-low":
        return a.amount - b.amount;
      case "newest":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
  
  // Group transactions by date
  const groupedTransactions: Record<string, typeof filteredTransactions> = {};
  filteredTransactions.forEach(transaction => {
    const dateKey = new Date(transaction.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    
    groupedTransactions[dateKey].push(transaction);
  });
  
  const toggleTransactionForm = () => {
    setShowTransactionForm(!showTransactionForm);
  };
  
  return (
    <Layout title="Transactions">
      <div className="space-y-6">
        {/* Top actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-auto">
            <Button onClick={toggleTransactionForm} className="w-full md:w-auto">
              <PlusCircle size={16} className="mr-2" />
              Add Transaction
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-60">
              <Search size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search transactions"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={(value) => setFilterType(value as "all" | "income" | "expense")}>
              <SelectTrigger className="w-full md:w-32">
                <div className="flex items-center">
                  <Filter size={14} className="mr-2" />
                  <span>Type</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-36">
                <div className="flex items-center">
                  <Filter size={14} className="mr-2" />
                  <span>Category</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <ArrowUpDown size={14} className="mr-2" />
                  <span>Sort</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Transaction form */}
        {showTransactionForm && (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Add New Transaction</h3>
              <TransactionForm onComplete={() => setShowTransactionForm(false)} />
            </CardContent>
          </Card>
        )}
        
        {/* Transactions list */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {Object.keys(groupedTransactions).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedTransactions).map(([date, transactions]) => (
                  <div key={date}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">{date}</h3>
                    <div className="space-y-4">
                      {transactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
