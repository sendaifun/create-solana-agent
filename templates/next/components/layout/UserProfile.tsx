import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  isExpanded: boolean;
}

export const UserProfile = ({ isExpanded }: UserProfileProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-md",
        "transition-all duration-200 ease-out",
        isExpanded || window.innerWidth < 768
          ? ["gap-3 p-2.5", "hover:bg-muted/50"]
          : ["justify-center p-2.5", "hover:bg-muted/50"],
      )}
    >
      <div className="min-w-10 min-h-10 rounded-full bg-muted/80 flex items-center justify-center text-[15px] font-medium text-foreground">
        SA
      </div>
      {(isExpanded || (!isExpanded && window.innerWidth < 768)) && (
        <>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-medium text-foreground truncate">DEFAI AGENT</div>
            <div className="text-[13px] text-muted-foreground">Pro</div>
          </div>
          <Button variant="ghostNoBackground" size="icon" onClick={toggleTheme} className="hover:bg-muted/50">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </>
      )}
    </div>
  );
};
