
import { Transaction } from "@/types/budget";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { amount, category, date, description, type } = transaction;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  const isIncome = type === 'income';
  
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
          <span className="text-white text-xs">{category.name.charAt(0)}</span>
        </div>
        <div className="ml-3">
          <p className="font-medium">{description}</p>
          <p className="text-xs text-muted-foreground">{category.name} • {formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className={`font-medium ${isIncome ? 'text-budget-green' : 'text-budget-red'}`}>
          {isIncome ? '+' : '-'}${amount.toFixed(2)}
        </p>
        <div className={`ml-2 p-1 rounded-full ${isIncome ? 'bg-budget-green/10' : 'bg-budget-red/10'}`}>
          {isIncome 
            ? <ArrowUpRight size={16} className="text-budget-green" />
            : <ArrowDownRight size={16} className="text-budget-red" />
          }
        </div>
      </div>
    </div>
  );
};
