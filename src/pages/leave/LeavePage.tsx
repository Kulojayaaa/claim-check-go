
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, BadgeIndianRupee, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import { leaveRequests, leaveTypes, leaveBalances } from "@/services/mockData";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LeavePage = () => {
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // New leave request form states
  const [leaveType, setLeaveType] = useState(leaveTypes[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get user's leave balance
  const userLeaveBalance = leaveBalances.find(balance => 
    balance.userId === currentUser?.id
  ) || leaveBalances[0]; // Fallback to first user for demo
  
  // Filter leave requests
  const userLeaveRequests = isAdmin 
    ? leaveRequests 
    : leaveRequests.filter(request => request.userId === currentUser?.id);
  
  // Filter by search query
  const searchFiltered = searchQuery
    ? userLeaveRequests.filter(request =>
        request.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : userLeaveRequests;
  
  // Filter by status
  const statusFiltered = statusFilter === "all"
    ? searchFiltered
    : searchFiltered.filter(request => request.status === statusFilter);
  
  // Filter by type
  const filteredLeaveRequests = typeFilter === "all"
    ? statusFiltered
    : statusFiltered.filter(request => request.leaveType === typeFilter);
  
  // Handle approve request
  const handleApproveRequest = (id: string) => {
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully.",
    });
  };
  
  // Handle reject request
  const handleRejectRequest = (id: string) => {
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected.",
    });
  };
  
  // Handle new leave request submission
  const handleSubmitLeaveRequest = () => {
    if (!startDate || !endDate || !reason) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
    
    setLeaveType(leaveTypes[0]);
    setStartDate("");
    setEndDate("");
    setReason("");
    setDialogOpen(false);
  };

  return (
    <Layout title="Leave Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Available Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">
                  {userLeaveBalance.total - userLeaveBalance.used}
                </p>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                of {userLeaveBalance.total} days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Annual Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {userLeaveBalance.annual}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 rounded-full h-2" 
                  style={{ width: `${(userLeaveBalance.annual / userLeaveBalance.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Sick Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {userLeaveBalance.sick}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 rounded-full h-2" 
                  style={{ width: `${(userLeaveBalance.sick / userLeaveBalance.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Personal Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {userLeaveBalance.personal}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 rounded-full h-2" 
                  style={{ width: `${(userLeaveBalance.personal / userLeaveBalance.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Leave Management Tabs */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Leave Requests</h2>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitLeaveRequest}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leave requests..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {leaveTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Leave Requests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeaveRequests.length > 0 ? (
            filteredLeaveRequests.map(request => (
              <LeaveRequestCard
                key={request.id}
                leaveRequest={request}
                onApprove={isAdmin ? handleApproveRequest : undefined}
                onReject={isAdmin ? handleRejectRequest : undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No leave requests found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Submit a new leave request to get started"}
              </p>
              
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LeavePage;
