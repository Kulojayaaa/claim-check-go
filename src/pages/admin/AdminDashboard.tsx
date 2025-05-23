
// Import necessary components and libraries
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { users } from "@/services/mockData";
import { Users, FileText, CalendarDays, Settings, User, Plus, BarChart3, Briefcase } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import StatsCard from "@/components/StatsCard";
import ProjectManagement from "@/components/ProjectManagement";

// Mock projects data since it's not exported from mockData
const projects = [
  { id: 1, name: "Project A", status: "active" },
  { id: 2, name: "Project B", status: "active" },
  { id: 3, name: "Project C", status: "inactive" },
  { id: 4, name: "Project D", status: "active" },
  { id: 5, name: "Head Office", status: "active" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    // In a real app, this would call an API to save the password
    console.log(`Password reset for ${selectedUser.name} to: ${newPassword}`);
    setShowPasswordModal(false);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="grid gap-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Users" 
            value={users.length} 
            description="Active system users" 
            icon={<Users className="h-5 w-5" />}
            color="blue"
          />
          <StatsCard 
            title="Pending Claims" 
            value={12} 
            description="Awaiting approval" 
            icon={<FileText className="h-5 w-5" />}
            color="amber"
            isCurrency={true}
          />
          <StatsCard 
            title="Leave Requests" 
            value={5} 
            description="Requiring review" 
            icon={<CalendarDays className="h-5 w-5" />}
            color="green"
          />
          <StatsCard 
            title="Projects" 
            value={projects.length} 
            description="Active projects" 
            icon={<Settings className="h-5 w-5" />}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col" onClick={() => navigate("/admin/users")}>
              <User className="h-8 w-8 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" onClick={() => navigate("/reports")}>
              <BarChart3 className="h-8 w-8 mb-2" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" onClick={() => navigate("/admin/projects")}>
              <Briefcase className="h-8 w-8 mb-2" />
              <span>Manage Projects</span>
            </Button>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit or remove system users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <div className="relative w-64">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role === "admin" ? "Admin" : "User"}</TableCell>
                          <TableCell>{user.password}</TableCell>
                          <TableCell>
                            <StatusBadge status={user.role === "admin" ? "approved" : "pending"} />
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                            >
                              Reset Password
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log("Edit user:", user.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Reset Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePassword} disabled={!newPassword.trim()}>
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
