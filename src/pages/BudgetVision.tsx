
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Briefcase, GraduationCap, Home } from "lucide-react";
import { ProfileType } from "@/types/budget";

const BudgetVision = () => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const navigate = useNavigate();

  const handleProfileSelection = (profile: ProfileType) => {
    setSelectedProfile(profile);
  };

  const handleContinue = () => {
    if (!selectedProfile) {
      toast({
        title: "Selection Required",
        description: "Please select a profile to continue",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you might want to save this selection to context or storage
    toast({
      title: "Profile Selected",
      description: `You've selected the ${selectedProfile} profile`,
    });

    // Navigate to dashboard
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Choose Your Profile</CardTitle>
          <CardDescription>
            Select a profile that best matches your financial situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ProfileCard
              title="Employee"
              description="Regular income, focused on savings and investments"
              icon={<Briefcase className="h-8 w-8" />}
              isSelected={selectedProfile === "employee"}
              onClick={() => handleProfileSelection("employee")}
            />
            
            <ProfileCard
              title="Student"
              description="Managing limited resources and student expenses"
              icon={<GraduationCap className="h-8 w-8" />}
              isSelected={selectedProfile === "student"}
              onClick={() => handleProfileSelection("student")}
            />
            
            <ProfileCard
              title="Housewife"
              description="Managing household budget and family expenses"
              icon={<Home className="h-8 w-8" />}
              isSelected={selectedProfile === "housewife"}
              onClick={() => handleProfileSelection("housewife")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleContinue} size="lg">
            Continue to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface ProfileCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const ProfileCard = ({ title, description, icon, isSelected, onClick }: ProfileCardProps) => {
  return (
    <div
      className={`flex cursor-pointer flex-col items-center rounded-lg border p-6 transition-all hover:shadow-md ${
        isSelected ? "border-[#D946EF] bg-[#E5DEFF]" : "border-border bg-white"
      }`}
      onClick={onClick}
    >
      <div className={`mb-4 rounded-full p-3 ${isSelected ? "bg-[#D946EF]/20 text-[#D946EF]" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-center text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default BudgetVision;
