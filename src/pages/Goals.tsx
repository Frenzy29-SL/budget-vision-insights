
import { useState } from "react";
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusCircle, Calendar, Target } from "lucide-react";
import { Goal } from "@/types/budget";
import { DialogClose } from "@radix-ui/react-dialog";

const Goals = () => {
  const { goals, addGoal, updateGoal, projectSavings } = useBudget();
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    priority: "medium" as "low" | "medium" | "high"
  });
  
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || isNaN(Number(newGoal.targetAmount))) {
      return;
    }
    
    addGoal({
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: newGoal.currentAmount ? Number(newGoal.currentAmount) : 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : null,
      priority: newGoal.priority
    });
    
    // Reset form
    setNewGoal({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      priority: "medium"
    });
  };
  
  const handleContribute = (goal: Goal, amount: number) => {
    if (isNaN(amount) || amount <= 0) return;
    
    updateGoal({
      ...goal,
      currentAmount: goal.currentAmount + amount
    });
  };
  
  // Calculate time to reach each goal based on projected savings
  const calculateTimeToReachGoal = (goal: Goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthlySavings = projectSavings(1);
    
    if (monthlySavings <= 0) return "N/A";
    
    const months = Math.ceil(remaining / monthlySavings);
    
    if (months <= 1) return "< 1 month";
    if (months < 12) return `${months} months`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };
  
  return (
    <Layout title="Savings Goals">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Track your progress towards important financial goals.
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle size={16} className="mr-2" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
                <DialogDescription>
                  Set a target and track your progress towards your financial objectives.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input 
                    id="goal-name" 
                    placeholder="e.g., Emergency Fund, Vacation, New Car" 
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-amount">Target Amount ($)</Label>
                    <Input 
                      id="target-amount" 
                      type="number" 
                      min="1" 
                      placeholder="5000" 
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-amount">Current Amount ($)</Label>
                    <Input 
                      id="current-amount" 
                      type="number" 
                      min="0" 
                      placeholder="0" 
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Target Date (Optional)</Label>
                    <Input 
                      id="deadline" 
                      type="date" 
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newGoal.priority}
                      onValueChange={(value) => setNewGoal({...newGoal, priority: value as "low" | "medium" | "high"})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddGoal}>Create Goal</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="shadow-sm card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full 
                        ${goal.priority === 'high' ? 'bg-budget-red/10' : 
                          goal.priority === 'medium' ? 'bg-budget-orange/10' : 'bg-budget-blue/10'}`}>
                        <Target size={20} className={`
                          ${goal.priority === 'high' ? 'text-budget-red' : 
                            goal.priority === 'medium' ? 'text-budget-orange' : 'text-budget-blue'}`} 
                        />
                      </div>
                      <h3 className="ml-3 text-lg font-medium">{goal.name}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium
                      ${goal.priority === 'high' ? 'bg-budget-red/10 text-budget-red' : 
                        goal.priority === 'medium' ? 'bg-budget-orange/10 text-budget-orange' : 
                          'bg-budget-blue/10 text-budget-blue'}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">
                        ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.currentAmount / goal.targetAmount) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${(goal.targetAmount - goal.currentAmount).toFixed(2)} remaining
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    {goal.deadline ? (
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-1 text-muted-foreground" />
                        <span>Due by {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-1 text-muted-foreground" />
                        <span>No deadline set</span>
                      </div>
                    )}
                    <div className="text-sm">
                      Est. time to reach: <span className="font-medium">{calculateTimeToReachGoal(goal)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">View Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{goal.name}</DialogTitle>
                          <DialogDescription>Goal details and contribution options</DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Target Amount</h4>
                              <p className="text-2xl font-bold">${goal.targetAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Current Progress</h4>
                              <p className="text-2xl font-bold">${goal.currentAmount.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <Progress 
                            value={(goal.currentAmount / goal.targetAmount) * 100} 
                            className="h-2"
                          />
                          
                          <div className="bg-muted p-4 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Contribution Calculator</h4>
                            <p className="text-xs text-muted-foreground mb-4">
                              How long will it take to reach your goal?
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current estimate:</span>
                              <span className="font-medium">{calculateTimeToReachGoal(goal)}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Make a Contribution</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {[50, 100, 200].map(amount => (
                                <Button 
                                  key={amount}
                                  variant="outline" 
                                  onClick={() => handleContribute(goal, amount)}
                                >
                                  ${amount}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Add Funds</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contribute to {goal.name}</DialogTitle>
                          <DialogDescription>
                            Add funds to get closer to your savings goal.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="flex justify-between items-center">
                            <span>Current balance:</span>
                            <span className="font-medium">${goal.currentAmount.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span>Target amount:</span>
                            <span className="font-medium">${goal.targetAmount.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span>Remaining:</span>
                            <span className="font-medium">${(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="contribution-50">Add $50</Label>
                              <Button
                                id="contribution-50"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleContribute(goal, 50)}
                              >
                                + $50
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contribution-100">Add $100</Label>
                              <Button
                                id="contribution-100"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleContribute(goal, 100)}
                              >
                                + $100
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="contribution-250">Add $250</Label>
                              <Button
                                id="contribution-250"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleContribute(goal, 250)}
                              >
                                + $250
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="contribution-500">Add $500</Label>
                              <Button
                                id="contribution-500"
                                variant="outline"
                                className="w-full"
                                onClick={() => handleContribute(goal, 500)}
                              >
                                + $500
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" asChild>
                            <DialogClose>Cancel</DialogClose>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <Target size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Savings Goals Yet</h3>
              <p className="text-center text-muted-foreground mb-6">
                Create your first savings goal to start tracking your progress.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle size={16} className="mr-2" />
                    Add Your First Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>{/* Same content as above */}</DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Goals;
