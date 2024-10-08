import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"; // Add Loader for loading state
import { Link } from "react-router-dom";
import axios from "axios";
import CONFIG from "../../config";

export default function SendSMS() {
  const [phoneNumber, setPhoneNumber] = useState("8299381052");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(false); // Track error status
  const [success, setSuccess] = useState(false); // Track success status

  const sendSMS = async () => {
    setLoading(true); // Start loading
    setError(false); // Reset error
    setSuccess(false); // Reset success
    setResponse(""); // Clear previous response
    try {
      const response = await axios.post(`${CONFIG.BASE_URL}sms/send`, {
        phoneNumber,
        message,
      });
      const data = response.data;
      setResponse(JSON.stringify(data, null, 2));
      setSuccess(true); // Mark success
    } catch (error) {
      console.error("Error sending SMS:", error);
      setError(true); // Mark error
      setResponse(JSON.stringify((error as any).response.data, null, 2));
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto space-y-6">
        {" "}
        {/* More space and width for larger layout */}
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
                  readOnly
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
              <Button onClick={sendSMS} disabled={loading}>
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
        {success && (
          <Alert className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Message sent successfully.</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-red-100 text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an issue sending the SMS.
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {response || "No response yet"}
            </pre>
          </CardContent>
        </Card>
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
