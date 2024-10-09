import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Log {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

interface LogListProps {
  logs: Log[];
}

export function LogsPage({ logs }: LogListProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Recent system activity logs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Serial No.</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell className="text-right">
                      {new Date(log.timestamp).toLocaleString()}
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
