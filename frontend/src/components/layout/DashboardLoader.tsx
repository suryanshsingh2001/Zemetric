import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, AlertTriangle, RefreshCcw } from "lucide-react"

export default function DashboardSkeletonLoader() {
  return (
    <div className="animate-pulse">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-9 bg-muted rounded w-64 mb-2"></div>
          <div className="h-5 bg-muted rounded w-96"></div>
        </div>
        <div className="flex justify-end gap-4 mb-6">
          <div className="w-32 h-10 bg-secondary rounded"></div>
          <div className="w-32 h-10 bg-primary rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[MessageSquare, Calendar, AlertTriangle].map((Icon, index) => (
            <Card key={index} className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-5 bg-muted rounded w-32"></div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
                {index === 2 && (
                  <div className="mt-4 h-8 bg-secondary rounded w-full"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <div className="h-6 bg-muted rounded w-48"></div>
              </CardTitle>
              <Button variant="secondary" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                <div className="h-4 bg-muted rounded w-16"></div>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}