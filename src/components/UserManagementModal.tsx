
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/contexts/UserContext";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, "isActive">) => void;
}

const UserManagementModal = ({ isOpen, onClose, onSave }: UserManagementModalProps) => {
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [leaveBalance, setLeaveBalance] = useState("20");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !name || !email || !password || !department || !location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      id: userId,
      name,
      email,
      role,
      password,
      department,
      location,
      leaveBalance: parseInt(leaveBalance, 10),
      leaveTaken: 0
    });
    
    // Reset form
    setUserId("");
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setDepartment("");
    setLocation("");
    setLeaveBalance("20");
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with appropriate permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter unique user ID"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: "admin" | "user") => setRole(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Enter department"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="leaveBalance">Leave Balance</Label>
              <Input
                id="leaveBalance"
                type="number"
                value={leaveBalance}
                onChange={(e) => setLeaveBalance(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementModal;
