
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate("/");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="animate-pulse">
        <p className="text-xl text-budget-primary font-semibold">Loading BudgetVision...</p>
      </div>
    </div>
  );
};

export default Index;
