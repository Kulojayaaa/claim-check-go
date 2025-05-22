
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { claims, attendanceRecords } from "@/services/mockData";
import ClaimCard from "@/components/ClaimCard";
import AttendanceCard from "@/components/AttendanceCard";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import UserManagementModal from "@/components/UserManagementModal";
import { 
  Search, 
  Check, 
  X, 
  User, 
  Users as UsersIcon, 
  FileText, 
  Calendar,
  Bell,
  UserPlus,
  Trash2
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { isAdmin, users, addUser, deleteUser, toggleUserActive } = useUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Redirect if not admin (would normally be handled by protected routes)
  if (!isAdmin) {
    return (
      <Layout title="Access Denied">
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <div className="bg-status-error/10 p-8 rounded-full mb-4">
            <X className="h-16 w-16 text-status-error" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-500 max-w-md">
            You don't have permission to access the admin dashboard. Please contact your administrator.
          </p>
        </div>
      </Layout>
    );
  }
  
  // Get pending items for approval
  const pendingClaims = claims.filter(claim => claim.status === "pending");
  
  // Get recent attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  
  // Filter users by search query
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  // Handle claim approval
  const handleApprove = (id: string) => {
    toast({
      title: "Claim Approved",
      description: "The claim has been successfully approved.",
    });
  };
  
  // Handle claim rejection
  const handleReject = (id: string) => {
    toast({
      title: "Claim Rejected",
      description: "The claim has been rejected.",
    });
  };

  // Handle user deletion
  const confirmDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteUser = () => {
    if (deleteUserId) {
      deleteUser(deleteUserId);
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      });
      setDeleteUserId(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Handle toggle user active status
  const handleToggleUserActive = (userId: string) => {
    toggleUserActive(userId);
    toast({
      title: "User Status Updated",
      description: "The user's active status has been updated.",
    });
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{users.length}</p>
                <UsersIcon className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{pendingClaims.length}</p>
                <FileText className="h-8 w-8 text-accent opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{todayAttendance.length}</p>
                <Calendar className="h-8 w-8 text-secondary opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">7</p>
                <Bell className="h-8 w-8 text-yellow-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="attendance">Today's Attendance</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Add, edit, and manage system users
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsAddUserModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Leave Balance</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                {user.name.charAt(0)}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{user.location}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" 
                                ? "bg-primary/10 text-primary" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive !== false 
                                ? "bg-status-success/10 text-status-success" 
                                : "bg-status-error/10 text-status-error"
                            }`}>
                              {user.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.leaveBalance ?? 0} days (Used: {user.leaveTaken ?? 0})
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleUserActive(user.id)}
                              >
                                {user.isActive !== false ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-status-error border-status-error hover:bg-status-error hover:text-white"
                                onClick={() => confirmDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Review and manage pending expense claims
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingClaims.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingClaims.map(claim => (
                      <ClaimCard 
                        key={claim.id} 
                        claim={claim}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 mx-auto text-status-success mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-gray-500">
                      There are no pending claims requiring your approval.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>
                  Monitor today's attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayAttendance.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todayAttendance.map(record => (
                      <AttendanceCard key={record.id} record={record} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">No attendance records yet</h3>
                    <p className="text-gray-500">
                      There are no attendance records for today.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-primary" onClick={() => setIsAddUserModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button className="w-full justify-start bg-secondary">
                <Bell className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
              <Button className="w-full justify-start bg-accent">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 pb-3 border-b">
                  <div className="bg-status-warning/20 rounded-full p-2 h-fit">
                    <Bell className="h-4 w-4 text-status-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Low attendance alert</p>
                    <p className="text-sm text-gray-500">Attendance rate below 80% for Site C</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pb-3 border-b">
                  <div className="bg-status-success/20 rounded-full p-2 h-fit">
                    <FileText className="h-4 w-4 text-status-success" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly reports ready</p>
                    <p className="text-sm text-gray-500">May 2025 reports are available for review</p>
                    <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-status-error/20 rounded-full p-2 h-fit">
                    <X className="h-4 w-4 text-status-error" />
                  </div>
                  <div>
                    <p className="font-medium">System maintenance</p>
                    <p className="text-sm text-gray-500">Scheduled maintenance on May 25, 2025</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add User Modal */}
        <UserManagementModal 
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSave={addUser}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                Deleting a user will remove all their data from the system.
              </AlertDescription>
            </Alert>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
