
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceRecords, attendanceStatusOptions } from "@/services/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useUser } from "@/contexts/UserContext";
import { BarChart, ChevronLeft, Download, Calendar, Search } from "lucide-react";

const AttendanceReport = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useUser();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter records based on user role
  const userAttendance = isAdmin 
    ? attendanceRecords 
    : attendanceRecords.filter(record => record.userId === currentUser?.id);
  
  // Filter by date range
  const dateFilteredRecords = userAttendance.filter(record => {
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return recordDate >= start && recordDate <= end;
    } else if (start) {
      return recordDate >= start;
    } else if (end) {
      return recordDate <= end;
    }
    
    return true;
  });
  
  // Filter by status
  const statusFilteredRecords = status === "all"
    ? dateFilteredRecords
    : dateFilteredRecords.filter(record => record.status === status);
  
  // Filter by search
  const filteredRecords = searchQuery
    ? statusFilteredRecords.filter(record => 
        record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (record.location && record.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : statusFilteredRecords;
  
  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === "present").length;
  const lateCount = filteredRecords.filter(r => r.status === "late").length;
  const absentCount = filteredRecords.filter(r => r.status === "absent").length;
  const leaveCount = filteredRecords.filter(r => r.status === "on-leave").length;
  const sickCount = filteredRecords.filter(r => r.status === "sick").length;
  
  const attendanceRate = totalRecords > 0 
    ? ((presentCount + lateCount) / totalRecords) * 100 
    : 0;

  return (
    <Layout title="Attendance Report">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your attendance report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {attendanceStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search attendance..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{totalRecords}</p>
                  <p className="text-sm text-gray-500">
                    Recorded attendance days
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{presentCount}</p>
                  <p className="text-sm text-gray-500">
                    Including {lateCount} late arrivals
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-status-success/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-status-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{Math.round(attendanceRate)}%</p>
                  <p className="text-sm text-gray-500">
                    Overall attendance rate
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-100">
                  <div 
                    className="bg-primary h-full"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                {totalRecords > 0 ? (
                  <div className="w-full space-y-4">
                    <div className="space-y-3">
                      {[
                        { status: "present", count: presentCount, color: "bg-status-success" },
                        { status: "late", count: lateCount, color: "bg-status-warning" },
                        { status: "absent", count: absentCount, color: "bg-status-error" },
                        { status: "on-leave", count: leaveCount, color: "bg-blue-400" },
                        { status: "sick", count: sickCount, color: "bg-orange-400" }
                      ].map(item => (
                        <div key={item.status} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{item.status.replace("-", " ")}</span>
                            <span>{item.count}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className={`${item.color} rounded-full h-2.5`}
                              style={{ width: `${(item.count / totalRecords) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Days</span>
                        <span className="text-sm font-medium">{totalRecords}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Check-in Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                {filteredRecords.filter(r => r.checkInTime).length > 0 ? (
                  <div className="w-full">
                    <div className="relative h-40 border-b border-l">
                      {/* Time scale */}
                      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <span>7:00</span>
                        <span>8:00</span>
                        <span>9:00</span>
                        <span>10:00</span>
                      </div>
                      
                      {/* Chart bars */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end h-full">
                        {filteredRecords
                          .filter(r => r.checkInTime)
                          .slice(0, 7)
                          .map((record, index) => {
                            const time = record.checkInTime || "08:00";
                            const [hours, minutes] = time.split(":").map(Number);
                            const totalMinutes = (hours * 60) + minutes;
                            // Calculate height - base of 7:00 AM (420 mins) to 10:00 AM (600 mins)
                            const heightPercent = Math.min(100, Math.max(0, 
                              ((totalMinutes - 420) / (600 - 420)) * 100
                            ));
                            
                            return (
                              <div 
                                key={record.id}
                                className="mx-1 flex-1 relative group"
                                style={{ height: `${heightPercent}%` }}
                              >
                                <div 
                                  className={`w-full ${
                                    record.status === "late" ? "bg-status-warning" : "bg-primary"
                                  } rounded-t-sm`}
                                  style={{ height: "100%" }}
                                />
                                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                  {record.userName}: {record.checkInTime}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-sm mr-2" />
                        <span className="text-xs">On Time</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-status-warning rounded-sm mr-2" />
                        <span className="text-xs">Late</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No check-in data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance List</CardTitle>
            <CardDescription>
              Showing {filteredRecords.length} attendance records
              {startDate && endDate ? ` from ${startDate} to ${endDate}` : 
               startDate ? ` from ${startDate}` : 
               endDate ? ` until ${endDate}` : 
               ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecords.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {isAdmin && <TableHead>Employee</TableHead>}
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        {isAdmin && <TableCell>{record.userName}</TableCell>}
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                        <TableCell>{record.checkInTime || "-"}</TableCell>
                        <TableCell>{record.checkOutTime || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.location?.address || "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No attendance records found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceReport;
