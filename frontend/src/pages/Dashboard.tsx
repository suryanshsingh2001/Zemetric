"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import axios from "axios"
import { MessageSquare, Calendar, AlertTriangle, Send } from "lucide-react"

import CONFIG from "../../config"

import Chart from "@/components/shared/Chart"
interface Stats {
  smsSentInLastMinute: number
  totalSmsSentToday: number
  violations: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    smsSentInLastMinute: 0,
    totalSmsSentToday: 0,
    violations: 0,
  })

  const [violations, setViolations] = useState<number>(0)

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}stats/usage`, {
        params: { phoneNumber: "8299381052" },
      })
      const data = response.data
      console.log(data)
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchViolations = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}stats/violations`)
      const data = response.data
      console.log(data)
      setViolations(data.violations.length)
    } catch (error) {
      console.error("Error fetching violations:", error)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchViolations()
  }, [])

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
          <Send className="mr-2 h-6 w-6" /> SMS Rate Limiter Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                SMS Sent (Last Minute)
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.smsSentInLastMinute >= 3 ? 'text-red-600' : ''}`}>
                {stats.smsSentInLastMinute}
              </div>
              <p className="text-xs text-muted-foreground">
                out of 3 allowed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                SMS Sent (Today)
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.totalSmsSentToday >= 10 ? 'text-red-600' : ''}`}>
                {stats.totalSmsSentToday}
              </div>
              <p className="text-xs text-muted-foreground">
                out of 10 allowed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rate Limit Violations
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{violations}</div>
              <p className="text-xs text-muted-foreground">In the last hour</p>
            </CardContent>
          </Card>
        </div>
        <Chart stats={stats} />
        <div className="mt-6">
          <Link to="/send-sms">
            <Button className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" /> Go to Send SMS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}