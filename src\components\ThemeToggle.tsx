import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  return (
    <Button variant="ghost" size="icon" aria-label="Dark theme enabled">
      <Moon className="h-4 w-4" />
    </Button>
  );
};
