
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, X, Calendar, BadgeIndianRupee } from "lucide-react";
import LeaveRequestCard from "@/components/LeaveRequestCard";
import { leaveRequests, leaveBalances, users } from "@/services/mockData";

const LeaveManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter pending leave requests
  const pendingRequests = leaveRequests.filter(
    request => request.status === "pending"
  );
  
  // Filter users by search
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  // Approve leave request
  const handleApproveLeave = (id: string) => {
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully."
    });
  };
  
  // Reject leave request
  const handleRejectLeave = (id: string) => {
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected."
    });
  };
  
  // Update leave balance
  const handleUpdateBalance = (userId: string) => {
    toast({
      title: "Leave Balance Updated",
      description: "The employee's leave balance has been updated successfully."
    });
  };

  return (
    <Layout title="Leave Management">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
                <div className="h-8 w-8 rounded-full bg-status-warning/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-status-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">
                  {leaveRequests.filter(r => r.status === "approved").length}
                </p>
                <div className="h-8 w-8 rounded-full bg-status-success/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-status-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Employees on Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">3</p>
                <Calendar className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Approvals</CardTitle>
            <CardDescription>
              Review and manage pending leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map(request => (
                  <LeaveRequestCard
                    key={request.id}
                    leaveRequest={request}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Check className="h-12 w-12 mx-auto text-status-success mb-4" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-gray-500">
                  There are no pending leave requests requiring your approval.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Leave Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Leave Balances</CardTitle>
            <CardDescription>
              Manage employee leave allowances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Annual</TableHead>
                    <TableHead>Sick</TableHead>
                    <TableHead>Personal</TableHead>
                    <TableHead>Total Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => {
                    const balance = leaveBalances.find(b => b.userId === user.id) || {
                      annual: 0,
                      sick: 0,
                      personal: 0,
                      compensatory: 0,
                      total: 0,
                      used: 0
                    };
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{balance.annual}</TableCell>
                        <TableCell>{balance.sick}</TableCell>
                        <TableCell>{balance.personal}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary">
                            {balance.total - balance.used} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateBalance(user.id)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LeaveManagement;
