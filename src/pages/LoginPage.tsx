
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { BadgeIndianRupee } from "lucide-react";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const { login, currentUser } = useUser();

  // If already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    setTimeout(() => {
      const success = login(userId, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid user ID or password",
          variant: "destructive",
        });
      }
      
      setIsLoggingIn(false);
    }, 700); // Simulate network delay
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <BadgeIndianRupee className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Project Site App</h1>
          <p className="text-gray-500">Claims & Attendance Management</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your user ID and password to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input 
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo credentials:</p>
          <p>Admin: User ID <span className="font-semibold">Admin</span>, Password <span className="font-semibold">Password</span></p>
          <p>User: User ID <span className="font-semibold">User1</span>, Password <span className="font-semibold">Password1</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
