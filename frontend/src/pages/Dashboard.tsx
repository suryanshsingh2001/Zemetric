"use client";

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
 
} from "lucide-react";

import CONFIG from "../config";

import Chart from "@/components/shared/Chart";

interface Stats {
  smsSentInLastMinute: number;
  totalSmsSentToday: number;
  violations: number;
}

interface UserProfile {
  name: string;
  phoneNumber: string;
}

const userProfile: UserProfile = {
  name: "John Doe",
  phoneNumber: "8299381052",
};
export default function Dashboard() {

  console.log(CONFIG.BASE_URL, "CONFIG.BASE_URL");
  const [stats, setStats] = useState<Stats>({
    smsSentInLastMinute: 0,
    totalSmsSentToday: 0,
    violations: 0,
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
      console.log(data , "data");
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
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
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
          <Card>
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
        <div className="grid grid-cols-1 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>SMS Usage Over Time</CardTitle>
            </CardHeader>
            <CardContent className="">
              <Chart stats={stats} />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/send-sms">
              <Send className="mr-2 h-4 w-4" /> Go to Send SMS
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
