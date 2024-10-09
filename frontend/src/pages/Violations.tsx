import React from "react";
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
import CONFIG from "../../config";
import axios from "axios";
import { getTimeStamp } from "@/lib/utils";

export default function ViolationPage() {
  const [violations, setViolations] = React.useState([]);

  const fetchViolations = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}stats/violations`);
      const data = response.data;
      console.log(data, "data");
      setViolations(data.violations);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };

  React.useEffect(() => {
    fetchViolations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Rate Limit Violations</CardTitle>
            <CardDescription>
              A list of recent rate limit violations in past 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Serial No.</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {
                  // Show a message if there are no violations
                  violations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No violations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    violations?.map((violation, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{violation}</TableCell>
                        <TableCell className="text-right">
                          {getTimeStamp(violation).formattedDate}
                        </TableCell>
                      </TableRow>
                    ))
                  )
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
