
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { attendanceRecords, attendanceStatusOptions } from "@/services/mockData";
import AttendanceCard from "@/components/AttendanceCard";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Clock, Map, Check, Calendar as CalendarIcon } from "lucide-react";

const AttendancePage = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState("present");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState<{lat: number; lng: number; address: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  
  // Filter attendance records for current user
  const userAttendance = attendanceRecords.filter(record => 
    record.userId === currentUser?.id
  );

  // Format date for comparison
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Get today's attendance record
  const today = formatDate(new Date());
  const todayRecord = userAttendance.find(record => record.date === today);
  
  // Check if already checked in today
  const hasCheckedIn = !!todayRecord;
  
  // Get records for selected date
  const selectedDateStr = selectedDate ? formatDate(selectedDate) : '';
  const selectedDateRecords = userAttendance.filter(record => record.date === selectedDateStr);
  
  // Get location
  const getLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate address lookup
          setTimeout(() => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: "123 Construction Site, Building A"
            });
            setIsLoading(false);
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Handle check-in
  const handleCheckIn = () => {
    setIsCheckingIn(true);
    
    // Validate
    if (!status) {
      toast({
        title: "Status Required",
        description: "Please select an attendance status.",
        variant: "destructive"
      });
      setIsCheckingIn(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Attendance Recorded",
        description: `You've successfully checked in as ${status}.`,
      });
      setIsCheckingIn(false);
      // Refresh page to show the new record
      window.location.reload();
    }, 1000);
  };

  // Get location when component mounts
  useEffect(() => {
    if (!location && !isLoading) {
      getLocation();
    }
  }, []);

  return (
    <Layout title="Attendance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's check-in card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                {hasCheckedIn 
                  ? "You've already recorded your attendance for today" 
                  : "Record your attendance for today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasCheckedIn ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium">Attendance recorded</p>
                      <p className="text-sm text-gray-500">
                        You've checked in as <span className="capitalize font-medium">{todayRecord?.status}</span> at {todayRecord?.checkInTime || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {todayRecord && (
                    <AttendanceCard record={todayRecord} />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {attendanceStatusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Time</label>
                      <div className="flex items-center border rounded-md p-2.5 bg-gray-50">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex items-center border rounded-md p-2.5 bg-gray-50">
                      <Map className="h-4 w-4 text-gray-500 mr-2" />
                      {isLoading ? (
                        <span>Detecting location...</span>
                      ) : location ? (
                        <span>{location.address}</span>
                      ) : (
                        <Button variant="outline" size="sm" onClick={getLocation}>
                          Detect Location
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <Textarea 
                      placeholder="Add any additional notes about your attendance"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!hasCheckedIn && (
                <Button 
                  className="w-full" 
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                >
                  {isCheckingIn ? "Recording Attendance..." : "Check In Now"}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Attendance history */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <div className="space-y-4">
                    {userAttendance.length > 0 ? (
                      userAttendance.slice(0, 5).map(record => (
                        <AttendanceCard key={record.id} record={record} />
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No attendance records found</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar">
                  <div className="flex flex-col items-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border mb-4"
                    />
                    
                    <div className="w-full mt-4">
                      <h3 className="font-medium mb-2">
                        Records for {selectedDate?.toLocaleDateString() || "selected date"}
                      </h3>
                      {selectedDateRecords.length > 0 ? (
                        selectedDateRecords.map(record => (
                          <AttendanceCard key={record.id} record={record} />
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No records for this date</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Present Days</span>
                  <span className="font-medium">
                    {userAttendance.filter(r => r.status === "present").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Late Days</span>
                  <span className="font-medium">
                    {userAttendance.filter(r => r.status === "late").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Absent Days</span>
                  <span className="font-medium">
                    {userAttendance.filter(r => r.status === "absent").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Leave Days</span>
                  <span className="font-medium">
                    {userAttendance.filter(r => r.status === "on-leave" || r.status === "sick").length}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Attendance Rate</span>
                    <span className="font-medium">
                      {userAttendance.length > 0 
                        ? Math.round(
                            (userAttendance.filter(r => r.status === "present").length / 
                            userAttendance.length) * 100
                          )
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceStatusOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      option.value === "present" ? "bg-status-success" :
                      option.value === "absent" ? "bg-status-error" :
                      option.value === "late" ? "bg-status-warning" :
                      option.value === "on-leave" ? "bg-blue-400" :
                      "bg-orange-400"
                    }`} />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                View Attendance Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;
