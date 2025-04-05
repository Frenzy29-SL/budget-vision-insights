
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBudget } from "@/contexts/BudgetContext";
import { toast } from "@/hooks/use-toast";

interface TransactionFormProps {
  onComplete: () => void;
}

const TransactionForm = ({ onComplete }: TransactionFormProps) => {
  const { categories, addTransaction } = useBudget();
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    addTransaction({
      amount: Number(amount),
      category,
      date: new Date(),
      description: description || `${type === 'income' ? 'Received' : 'Spent on'} ${category.name}`,
      type
    });
    
    // Reset form
    setAmount("");
    setDescription("");
    setCategoryId("");
    
    toast({
      title: "Transaction added",
      description: "Your transaction has been added successfully.",
    });
    
    onComplete();
  };
  
  // Filter categories by the selected type
  const filteredCategories = categories.filter(cat => cat.type === type);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select 
            value={type} 
            onValueChange={(value) => setType(value as 'income' | 'expense')}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input 
              id="amount" 
              type="number" 
              min="0.01" 
              step="0.01" 
              placeholder="0.00" 
              className="pl-7"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={categoryId} 
            onValueChange={setCategoryId}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <SelectItem 
                    key={category.id || `category-${category.name}`} 
                    value={category.id || `category-${category.name}`}
                  >
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-categories-available">No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input 
            id="description" 
            placeholder="Enter description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          Add Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
