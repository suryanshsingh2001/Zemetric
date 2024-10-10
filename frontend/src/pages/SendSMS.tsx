import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import CONFIG from "../config";
import { mapResponse } from "@/lib/utils";
import { MessageType } from "types";
import { showToast } from "@/lib/toast";
import { SMSFormData, smsFormSchema } from "@/zod";

export default function SendSMS() {
  const [response, setResponse] = useState<MessageType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<SMSFormData>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      phoneNumber: "8299381052",
      message: "",
    },
  });

  const messageLength = form.watch("message")?.length || 0;

  const onSubmit = async (data: SMSFormData) => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const response = await axios.post(`${CONFIG.BASE_URL}sms/send`, {
        phoneNumber: data.phoneNumber,
        message: data.message,
      });

      setResponse(mapResponse(response));
      setSuccess(true);
      showToast("Success", "Message sent successfully to " + data.phoneNumber);


      form.reset();
    } catch (error) {
      console.error("Error sending SMS:", error);
      setError(true);
      showToast(
        "Error",
        (error as any).response?.data?.message || "An error occurred."
      );

      setResponse(mapResponse((error as any).response));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-7xl">
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormDescription>
                        Phone Number will be readonly and pre-filled
                      </FormDescription>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Message
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message here"
                          {...field}
                          rows={4}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    "Send SMS"
                  )}
                </Button>
              </form>
            </Form>
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
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Message sent successfully to {form.watch("phoneNumber")}.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {response?.data?.message || "An error occurred."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
