
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { claims, attendanceRecords } from "@/services/mockData";
import { BarChart, Calendar, FileText, ChevronRight } from "lucide-react";

const ReportsPage = () => {
  const { currentUser, isAdmin } = useUser();
  
  // Filter data based on user role
  const userClaims = isAdmin 
    ? claims 
    : claims.filter(claim => claim.userId === currentUser?.id);
  
  const userAttendance = isAdmin
    ? attendanceRecords
    : attendanceRecords.filter(record => record.userId === currentUser?.id);
  
  // Calculate claim stats
  const totalClaimAmount = userClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const pendingClaimAmount = userClaims
    .filter(claim => claim.status === "pending")
    .reduce((sum, claim) => sum + claim.amount, 0);
  const approvedClaimAmount = userClaims
    .filter(claim => claim.status === "approved")
    .reduce((sum, claim) => sum + claim.amount, 0);
  
  // Calculate attendance stats
  const totalDays = userAttendance.length;
  const presentDays = userAttendance.filter(record => record.status === "present").length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return (
    <Layout title="Reports">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-gray-500">View and analyze expenses and attendance data</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Claims Report Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Claims Report</CardTitle>
                  <CardDescription>Expense claims analysis</CardDescription>
                </div>
                <div className="bg-primary/10 rounded-full p-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Claims</p>
                    <p className="text-2xl font-bold">{userClaims.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(totalClaimAmount)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-xl font-semibold text-status-warning">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(pendingClaimAmount)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-xl font-semibold text-status-success">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(approvedClaimAmount)}
                    </p>
                  </div>
                </div>
                
                {/* Simple chart visualization */}
                <div className="pt-2">
                  <div className="h-16 flex items-end gap-1">
                    {/* Simplified bar chart visualization */}
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-primary/80 rounded-t"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          opacity: 0.6 + (Math.random() * 0.4)
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/reports/claims" className="flex items-center justify-between">
                  <span>View Detailed Claims Report</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Attendance Report Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Attendance Report</CardTitle>
                  <CardDescription>Attendance and time tracking analysis</CardDescription>
                </div>
                <div className="bg-secondary/10 rounded-full p-2 text-secondary">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Days Tracked</p>
                    <p className="text-2xl font-bold">{totalDays}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                    <p className="text-2xl font-bold">{Math.round(attendanceRate)}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-xl font-semibold text-status-success">
                      {presentDays}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Late</p>
                    <p className="text-xl font-semibold text-status-warning">
                      {userAttendance.filter(record => record.status === "late").length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-xl font-semibold text-status-error">
                      {userAttendance.filter(record => record.status === "absent").length}
                    </p>
                  </div>
                </div>
                
                {/* Simple chart visualization */}
                <div className="pt-2">
                  <div className="flex gap-1 h-16">
                    {/* Simplified attendance visualization */}
                    <div 
                      className="bg-status-success rounded"
                      style={{ 
                        width: `${(presentDays / totalDays) * 100}%`,
                        minWidth: totalDays > 0 ? '10%' : '0'
                      }}
                    />
                    <div 
                      className="bg-status-warning rounded"
                      style={{ 
                        width: `${(userAttendance.filter(record => record.status === "late").length / totalDays) * 100}%`,
                        minWidth: totalDays > 0 ? '5%' : '0'
                      }}
                    />
                    <div 
                      className="bg-blue-400 rounded"
                      style={{ 
                        width: `${(userAttendance.filter(record => record.status === "on-leave").length / totalDays) * 100}%`,
                        minWidth: totalDays > 0 ? '5%' : '0'
                      }}
                    />
                    <div 
                      className="bg-status-error rounded"
                      style={{ 
                        width: `${(userAttendance.filter(record => record.status === "absent").length / totalDays) * 100}%`,
                        minWidth: totalDays > 0 ? '5%' : '0'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-status-success mr-1" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-status-error mr-1" />
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/reports/attendance" className="flex items-center justify-between">
                  <span>View Detailed Attendance Report</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* More Reports Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Performance</CardTitle>
              <CardDescription>Compare attendance and claims</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center">
              <BarChart className="h-16 w-16 text-gray-300" />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Coming Soon</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Expenses</CardTitle>
              <CardDescription>Expenses by project and category</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center">
              <BarChart className="h-16 w-16 text-gray-300" />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Coming Soon</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Analysis</CardTitle>
              <CardDescription>Attendance by location</CardDescription>
            </CardHeader>
            <CardContent className="h-40 flex items-center justify-center">
              <BarChart className="h-16 w-16 text-gray-300" />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Coming Soon</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
