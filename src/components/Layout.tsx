
import React, { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Home,
  BarChart,
  User,
  Users,
  Menu,
  X,
  BadgeIndianRupee,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
  title: string;
  requireAuth?: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, currentPath, onClick }: NavItemProps) => {
  const isActive = currentPath === to || currentPath.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-white" 
          : "hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Layout = ({ children, title, requireAuth = true }: LayoutProps) => {
  const { currentUser, isAdmin, toggleUserRole, logout } = useUser();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system."
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - increased width from w-64 to w-72 */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary">Project Site App</h1>
            <p className="text-sm text-gray-500 mt-1">Claims & Attendance</p>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavItem 
              to="/" 
              icon={<Home size={20} />} 
              label="Dashboard" 
              currentPath={location.pathname}
              onClick={closeSidebarOnMobile}
            />
            <NavItem 
              to="/claims" 
              icon={<FileText size={20} />} 
              label="Claims" 
              currentPath={location.pathname}
              onClick={closeSidebarOnMobile}
            />
            <NavItem 
              to="/attendance" 
              icon={<Calendar size={20} />} 
              label="Attendance" 
              currentPath={location.pathname}
              onClick={closeSidebarOnMobile}
            />
            <NavItem 
              to="/leave" 
              icon={<BadgeIndianRupee size={20} />} 
              label="Leave" 
              currentPath={location.pathname}
              onClick={closeSidebarOnMobile}
            />
            <NavItem 
              to="/reports" 
              icon={<BarChart size={20} />} 
              label="Reports" 
              currentPath={location.pathname}
              onClick={closeSidebarOnMobile}
            />
            {isAdmin && (
              <NavItem 
                to="/admin" 
                icon={<Users size={20} />} 
                label="Admin" 
                currentPath={location.pathname}
                onClick={closeSidebarOnMobile}
              />
            )}
            {isAdmin && (
              <NavItem 
                to="/admin/leave" 
                icon={<Calendar size={20} />} 
                label="Leave Management" 
                currentPath={location.pathname}
                onClick={closeSidebarOnMobile}
              />
            )}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-600 hover:text-primary"
              onClick={toggleUserRole}
            >
              <User className="mr-2 h-4 w-4" />
              Switch to {isAdmin ? "User" : "Admin"} Role
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-600 hover:text-status-error hover:border-status-error"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - adjusted margin left to match new sidebar width */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        sidebarOpen ? (isMobile ? "ml-0" : "ml-72") : "ml-0"
      )}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
