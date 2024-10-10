
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, ArrowUpDown, RefreshCw, } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import CONFIG from "../config"

import { Log, SortOrder } from "types"


export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filterType, setFilterType] = useState<"all" | "info" | "error">("all")
  const [isLoading, setIsLoading] = useState(false)

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}logs`)
      console.log("Logs:", response.data)
      setLogs(response.data)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const sortedAndFilteredLogs = logs
    .filter(log => {
      if (filterType === "all") return true
      return log.level.toLowerCase() === filterType
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc")
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  System Logs
                </CardTitle>
                <CardDescription>Recent system activity logs</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={filterType}
                  onValueChange={(value: "all" | "info" | "error") => 
                    setFilterType(value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Logs</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {sortOrder === "desc" ? "Latest First" : "Oldest First"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLogs}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  {sortedAndFilteredLogs.length === 0 
                    ? "No logs found" 
                    : `Showing ${sortedAndFilteredLogs.length} ${filterType} logs`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                    <TableHead>Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.level.toLowerCase() === "error" 
                              ? "bg-red-100 text-red-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.level}
                        </span>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell className="text-right">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                              View Response
                            </AccordionTrigger>
                            <AccordionContent>
                              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                                <code>{JSON.stringify(log.response, null, 2) || "No Response"}</code>
                              </pre>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}