import { useTheme } from "~/utils/ThemeContext";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-md text-[#1E9BB9] hover:bg-[#1E9BB9]/20 transition-colors duration-200"
    >
      {theme === "light" ? (
        <Icon name="moon-linear" className="h-6 w-6" />
      ) : (
        <Icon name="sun-linear" className="h-6 w-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 