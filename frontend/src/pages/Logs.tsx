import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

import CONFIG from "../config";

interface Log {
  level: string;
  message: string;
  timestamp: number;
  response: any;  
}



export function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}logs`);
      console.log("Logs:", response.data);
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl  flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              System Logs
            </CardTitle>
            <CardDescription>Recent system activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="">Timestamp</TableHead>
                  <TableHead className="">Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.level}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell className="text-right">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-left">
                      {JSON.stringify(log.response) || "No Response"}{" "}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
