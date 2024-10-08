import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [stats, setStats] = useState({
    lastMinute: 0,
    today: 0,
    violations: 0
  })

  const sendSMS = async () => {
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      fetchStats()
    } catch (error) {
      setResponse('Error sending SMS')
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SMS Rate Limiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Send SMS</CardTitle>
            <CardDescription>Send an SMS message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  placeholder="Enter message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button onClick={sendSMS}>Send SMS</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-2 rounded">{response}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>SMS usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>SMS sent in the last minute: {stats.lastMinute}</p>
            <p>Total SMS sent today: {stats.today}</p>
            <p>Rate limit violations in the last hour: {stats.violations}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}