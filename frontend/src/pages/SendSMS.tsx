import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import CONFIG from "../../config"
import { mapResponse } from "@/lib/utils"
import { MessageType } from "types"
import { showToast } from "@/lib/toast"

export default function SendSMS() {
  const [phoneNumber, setPhoneNumber] = useState("8299381052")
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState<MessageType>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const sendSMS = async () => {
    setLoading(true)
    setError(false)
    setSuccess(false)
    try {
      const response = await axios.post(`${CONFIG.BASE_URL}sms/send`, {
        phoneNumber,
        message,
      })

      setResponse(mapResponse(response))
      setSuccess(true)
      showToast("Success", "Message sent successfully to " + phoneNumber)
    } catch (error) {
      console.error("Error sending SMS:", error)
      setError(true)
      showToast(
        "Error",
        (error as any).response?.data?.message || "An error occurred."
      )

      setResponse(mapResponse((error as any).response))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SMS Console</h1>
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Send SMS</CardTitle>
            <CardDescription>Compose and send your message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  readOnly
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={sendSMS} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending...
                  </>
                ) : (
                  "Send SMS"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response details</CardDescription>
          </CardHeader>
          <CardContent>
            {response ? (
              <pre className="bg-secondary p-4 rounded-md text-sm overflow-x-auto">
                <p>Status: {response.status}</p>
                <p>Data: {JSON.stringify(response.data, null, 2)}</p>
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No response yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {success && (
        <Alert variant="default">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Message sent successfully to {phoneNumber}.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {response?.data?.message || "An error occurred."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}