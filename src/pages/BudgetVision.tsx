
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileType } from "@/types/budget";
import { useBudget } from "@/contexts/BudgetContext";
import { Briefcase, GraduationCap, Home, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BudgetVision = () => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const { setProfileType } = useBudget();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedProfile) {
      toast({
        title: "Please select a profile",
        description: "You must select a profile to continue",
        variant: "destructive",
      });
      return;
    }

    setProfileType(selectedProfile);
    toast({
      title: "Profile Selected",
      description: `Your budget will be optimized for ${selectedProfile}`,
    });
    navigate("/");
  };

  const profileOptions: { type: ProfileType; icon: React.ReactNode; title: string; description: string }[] = [
    {
      type: "employee",
      icon: <Briefcase className="h-6 w-6" />,
      title: "Employee",
      description: "Optimize for regular income with focus on savings and investments"
    },
    {
      type: "student",
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Student",
      description: "Budget for limited income, education expenses, and student lifestyle"
    },
    {
      type: "housewife",
      icon: <Home className="h-6 w-6" />,
      title: "Housewife",
      description: "Manage household expenses and family budget efficiently"
    },
    {
      type: "other",
      icon: <Users className="h-6 w-6" />,
      title: "Other",
      description: "Custom budgeting solution for your unique financial situation"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Choose Your Budget Profile</h1>
        <p className="mb-10 text-center text-muted-foreground">
          Select the profile that best matches your financial situation to get personalized budget recommendations.
        </p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profileOptions.map((profile) => (
            <Card 
              key={profile.type}
              className={`cursor-pointer transition-all ${
                selectedProfile === profile.type ? "border-primary ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedProfile(profile.type)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    selectedProfile === profile.type ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {profile.icon}
                  </div>
                  <CardTitle>{profile.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{profile.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <Button 
            size="lg"
            onClick={handleContinue}
            disabled={!selectedProfile}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetVision;
