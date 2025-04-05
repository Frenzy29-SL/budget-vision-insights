import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useBudget } from "@/contexts/BudgetContext";
import { Card, CardContent } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, GraduationCap, Home, Save, ChevronRight,
  LifeBuoy, MonitorSmartphone, SlidersHorizontal, ShieldCheck
} from "lucide-react";
import { ProfileType } from "@/types/budget";
import EditableAmount from "@/components/EditableAmount";

const Settings = () => {
  const { profile, setProfileType, updateProfileIncome, isLoading } = useBudget();
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>("employee");
  
  // Update the selected profile when the actual profile loads
  useEffect(() => {
    if (profile) {
      setSelectedProfile(profile.type);
    }
  }, [profile]);
  
  const handleProfileChange = (type: ProfileType) => {
    setSelectedProfile(type);
    setProfileType(type);
  };

  const handleIncomeUpdate = (amount: number) => {
    updateProfileIncome(amount);
  };
  
  if (isLoading || !profile) {
    return (
      <Layout title="Settings">
        <div className="space-y-8">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">Profile Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
          </Card>
          <Skeleton className="h-80 w-full" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Settings">
      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-6">Profile Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className={`cursor-pointer border-2 transition-all ${
                  selectedProfile === 'employee' 
                    ? 'border-budget-primary shadow' 
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => handleProfileChange('employee')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    selectedProfile === 'employee' ? 'bg-budget-primary' : 'bg-muted'
                  }`}>
                    <Briefcase size={24} className={selectedProfile === 'employee' ? 'text-white' : 'text-muted-foreground'} />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Employee</h3>
                  <p className="text-sm text-muted-foreground">
                    For salaried professionals with regular income
                  </p>
                  
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm">
                      <span>Target Savings:</span>
                      <span>20-30%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Focus:</span>
                      <span>Career Growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 transition-all ${
                  selectedProfile === 'student' 
                    ? 'border-budget-primary shadow' 
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => handleProfileChange('student')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    selectedProfile === 'student' ? 'bg-budget-primary' : 'bg-muted'
                  }`}>
                    <GraduationCap size={24} className={selectedProfile === 'student' ? 'text-white' : 'text-muted-foreground'} />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Student</h3>
                  <p className="text-sm text-muted-foreground">
                    For students managing limited income and education expenses
                  </p>
                  
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm">
                      <span>Target Savings:</span>
                      <span>10-15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Focus:</span>
                      <span>Education</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 transition-all ${
                  selectedProfile === 'housewife' 
                    ? 'border-budget-primary shadow' 
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => handleProfileChange('housewife')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    selectedProfile === 'housewife' ? 'bg-budget-primary' : 'bg-muted'
                  }`}>
                    <Home size={24} className={selectedProfile === 'housewife' ? 'text-white' : 'text-muted-foreground'} />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Home Manager</h3>
                  <p className="text-sm text-muted-foreground">
                    For managing household expenses and family budgets
                  </p>
                  
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm">
                      <span>Target Savings:</span>
                      <span>15-25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Focus:</span>
                      <span>Household</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <Card className="shadow-sm h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-6">Budget Preferences</h3>
                
                <Tabs defaultValue="general">
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget-style">Budgeting Style</Label>
                      <RadioGroup defaultValue={profile.budgetingStyle} className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="conservative" id="conservative" />
                          <Label htmlFor="conservative">Conservative</Label>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Safe approach, focus on stability)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="moderate" />
                          <Label htmlFor="moderate">Moderate</Label>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Balanced approach, moderate risk)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aggressive" id="aggressive" />
                          <Label htmlFor="aggressive">Aggressive</Label>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Focus on growth, higher risk)
                          </span>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="cad">CAD ($)</SelectItem>
                            <SelectItem value="aud">AUD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="mdy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="monthly-income">Monthly Income</Label>
                      <div className="w-full">
                        <EditableAmount 
                          value={profile.income} 
                          onUpdate={handleIncomeUpdate}
                          prefix="$" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="savings-target">Monthly Savings Target</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input 
                          id="savings-target" 
                          type="number" 
                          className="pl-7" 
                          defaultValue={profile.savingsTarget}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Weekly Summary</h4>
                          <p className="text-sm text-muted-foreground">Receive weekly expense summary</p>
                        </div>
                        <div>
                          <input type="checkbox" id="weekly-summary" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Budget Alerts</h4>
                          <p className="text-sm text-muted-foreground">Get notified when approaching budget limits</p>
                        </div>
                        <div>
                          <input type="checkbox" id="budget-alerts" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Goal Progress</h4>
                          <p className="text-sm text-muted-foreground">Updates on savings goal milestones</p>
                        </div>
                        <div>
                          <input type="checkbox" id="goal-progress" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Unusual Spending</h4>
                          <p className="text-sm text-muted-foreground">Alerts for unusual spending patterns</p>
                        </div>
                        <div>
                          <input type="checkbox" id="unusual-spending" className="toggle" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Setup</Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Help & Support</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help Center
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MonitorSmartphone className="mr-2 h-4 w-4" />
                    Get Mobile App
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Advanced Settings
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Privacy Settings
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-budget-primary/10 border-budget-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Save className="h-10 w-10 text-budget-primary" />
                  <div className="ml-4">
                    <h3 className="font-medium">Backup Your Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your financial information safe
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
