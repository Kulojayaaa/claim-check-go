
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { claims, attendanceRecords } from "@/services/mockData";
import ClaimCard from "@/components/ClaimCard";
import AttendanceCard from "@/components/AttendanceCard";
import StatsCard from "@/components/StatsCard";
import { Calendar, FileText, BarChart, Plus } from "lucide-react";

const HomePage = () => {
  const { currentUser, isAdmin } = useUser();
  
  // Filter claims for the current user (if not admin)
  const userClaims = isAdmin 
    ? claims
    : claims.filter(claim => claim.userId === currentUser?.id);
  
  // Filter attendance records for the current user (if not admin)
  const userAttendance = isAdmin
    ? attendanceRecords
    : attendanceRecords.filter(record => record.userId === currentUser?.id);
  
  // Get only pending claims for quick approval (for admin)
  const pendingClaims = claims.filter(claim => claim.status === "pending");
  
  // Get today's attendance records
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  
  // Calculate some stats
  const totalClaims = userClaims.length;
  const approvedClaims = userClaims.filter(claim => claim.status === "approved").length;
  const pendingClaimsCount = userClaims.filter(claim => claim.status === "pending").length;
  
  const totalAttendanceDays = userAttendance.length;
  const presentDays = userAttendance.filter(record => record.status === "present").length;
  const attendanceRate = totalAttendanceDays > 0 
    ? Math.round((presentDays / totalAttendanceDays) * 100) 
    : 0;

  return (
    <Layout title="Dashboard">
      <div className="grid gap-6">
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Claims"
            value={totalClaims}
            description="All time claims submitted"
            icon={<FileText />}
          />
          <StatsCard
            title="Approved Claims"
            value={`${approvedClaims}/${totalClaims}`}
            description={`${Math.round((approvedClaims / totalClaims) * 100) || 0}% approval rate`}
            icon={<FileText />}
          />
          <StatsCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            description={`${presentDays} out of ${totalAttendanceDays} days`}
            icon={<Calendar />}
          />
          <StatsCard
            title="Pending Claims"
            value={pendingClaimsCount}
            description="Awaiting approval"
            icon={<FileText />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start bg-primary">
                <Link to="/claims/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Claim
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-secondary">
                <Link to="/attendance">
                  <Calendar className="mr-2 h-4 w-4" />
                  Record Attendance
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-accent">
                <Link to="/reports">
                  <BarChart className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Claims</CardTitle>
                <CardDescription>Your latest submitted claims</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/claims">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {userClaims.slice(0, 2).map(claim => (
                <ClaimCard key={claim.id} claim={claim} />
              ))}
              {userClaims.length === 0 && (
                <p className="text-center text-gray-500 py-4">No claims found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Attendance section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Attendance</CardTitle>
                <CardDescription>Your latest attendance records</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/attendance">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {userAttendance.slice(0, 2).map(record => (
                <AttendanceCard key={record.id} record={record} />
              ))}
              {userAttendance.length === 0 && (
                <p className="text-center text-gray-500 py-4">No attendance records found</p>
              )}
            </CardContent>
          </Card>

          {/* Admin section - only shown to admins */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Overview</CardTitle>
                <CardDescription>Quick admin actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Pending Approvals</h4>
                    <p className="text-sm text-gray-500">{pendingClaims.length} claims waiting</p>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/admin">Review</Link>
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Today's Attendance</h4>
                    <p className="text-sm text-gray-500">{todayAttendance.length} records</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/reports/attendance">View</Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin">Go to Admin Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
