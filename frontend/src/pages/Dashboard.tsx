import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MessageSquare,
  Calendar,
  AlertTriangle,
  Send,
  FileText,
  ExternalLink,
} from "lucide-react";

import CONFIG from "../config";
import Chart from "@/components/shared/Chart";
import { UserProfile, Stats } from "types";

const userProfile: UserProfile = {
  name: "John Doe",
  phoneNumber: "8299381052",
};

export default function Dashboard() {
  console.log(CONFIG.BASE_URL, "CONFIG.BASE_URL");
  const [stats, setStats] = useState<Stats>({
    smsSentInLastMinute: 0,
    totalSmsSentToday: 0,
  });

  const [violations, setViolations] = useState<number>(0);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}stats/usage`, {
        params: { phoneNumber: userProfile.phoneNumber },
      });
      const data = response.data;
      console.log(data);
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchViolations = async () => {
    try {
      const response = await axios.get(`${CONFIG.BASE_URL}stats/violations`);
      const data = response.data;
      console.log(data, "data");
      setViolations(data.violations.length);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchViolations();
  }, []);

  return (
    <div className="">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your SMS dashboard
          </p>
        </div>

        {/* Action buttons at the top */}
        <div className="flex justify-end gap-4 mb-6">
          <Button variant="secondary" asChild>
            <Link to="/logs">
              <FileText className="mr-2 h-4 w-4" /> View Logs
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/send-sms">
              <Send className="mr-2 h-4 w-4" /> Send SMS
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                SMS Sent (Last Minute)
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.smsSentInLastMinute >= 3 ? "text-destructive" : ""
                }`}
              >
                {stats.smsSentInLastMinute}
              </div>
              <p className="text-xs text-muted-foreground">out of 3 allowed</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                SMS Sent (Today)
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  stats.totalSmsSentToday >= 10 ? "text-destructive" : ""
                }`}
              >
                {stats.totalSmsSentToday}
              </div>
              <p className="text-xs text-muted-foreground">out of 10 allowed</p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rate Limit Violations
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{violations}</div>
                <p className="text-xs text-muted-foreground">
                  In the last hour
                </p>
              </div>
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link to="/violations">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  View Violations
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SMS Usage Over Time</CardTitle>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/logs">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Logs
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="">
              <Chart stats={stats} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
