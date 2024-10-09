
import { Button } from "@/components/ui/button"
import { Send, User, Moon, Sun } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "../layout/theme-provider"

interface UserProfile {
  name: string
  phoneNumber: string
}

interface HeaderProps {
  userProfile: UserProfile
}


const userProfile : UserProfile = {
  name: "John Doe",
  phoneNumber: "8299381052",
}

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-card shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Send className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">SMS Rate Limiter</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Profile</h4>
                    <p className="text-sm text-muted-foreground">Your account details</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm">Name:</span>
                      <span className="col-span-2 font-medium">{userProfile.name}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <span className="text-sm">Phone:</span>
                      <span className="col-span-2 font-medium">{userProfile.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  )
}