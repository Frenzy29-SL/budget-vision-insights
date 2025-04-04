
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Receipt, PieChart, Target, Settings, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBudget } from "@/contexts/BudgetContext";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const { profile } = useBudget();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: Receipt },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Goals", path: "/goals", icon: Target },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar w-full md:w-64 flex-shrink-0 border-r border-sidebar-border",
          "md:flex md:flex-col md:sticky md:top-0 md:h-screen",
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center px-2 py-4">
            <div className="w-10 h-10 rounded-full bg-budget-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="ml-3 text-xl font-bold text-budget-primary">BudgetVision</span>
          </div>
          
          <Separator className="my-4" />
          
          {profile ? (
            <div className="mt-2 mb-4">
              <div className="px-4 py-2 bg-sidebar-accent rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm uppercase">{profile.type.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">{profile.type} Profile</span>
                    <span className="text-xs text-muted-foreground capitalize">{profile.budgetingStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 mb-4">
              <div className="px-4 py-2 bg-sidebar-accent rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">...</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Loading profile...</span>
                    <span className="text-xs text-muted-foreground">Please wait</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <nav className="space-y-1 mt-4 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
                    "transition-colors duration-200",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {profile ? (
            <div className="mt-auto p-4 bg-sidebar-accent rounded-lg">
              <h3 className="font-medium text-sm">Monthly Savings Goal</h3>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-sidebar-border h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-budget-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((profile.savingsTarget / (profile.income * 0.2)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs">${profile.savingsTarget}</span>
              </div>
            </div>
          ) : (
            <div className="mt-auto p-4 bg-sidebar-accent rounded-lg">
              <h3 className="font-medium text-sm">Monthly Savings Goal</h3>
              <div className="mt-2 flex items-center">
                <div className="flex-1 bg-sidebar-border h-2 rounded-full overflow-hidden">
                  <div className="bg-budget-primary h-2 rounded-full w-0"></div>
                </div>
                <span className="ml-2 text-xs">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
