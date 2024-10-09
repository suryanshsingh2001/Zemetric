import { Button } from "@/components/ui/button";
import { Send, User, Moon, Sun, Github } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "../layout/theme-provider";
import { UserProfile } from "types";
import CONFIG from "@/config";

const userProfile: UserProfile = {
  name: "John Doe",
  phoneNumber: "8299381052",
};

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-gradient-to-r from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <div>
              <a href="/">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                SMS Rate Limiter
              </h1>
              </a>
              
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={() => window.open(`${CONFIG.GITHUB_URL}`, '_blank')}
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-primary/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Your account details
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-medium">Name:</span>
                      <span className="col-span-2">
                        {userProfile.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="col-span-2">
                        {userProfile.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}