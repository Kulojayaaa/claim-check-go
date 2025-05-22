
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import HomePage from "./pages/HomePage";
import ClaimsPage from "./pages/claims/ClaimsPage";
import NewClaimForm from "./pages/claims/NewClaimForm";
import AttendancePage from "./pages/attendance/AttendancePage";
import ReportsPage from "./pages/reports/ReportsPage";
import AttendanceReport from "./pages/reports/AttendanceReport";
import ClaimsReport from "./pages/reports/ClaimsReport";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeavePage from "./pages/leave/LeavePage";
import LeaveManagement from "./pages/admin/LeaveManagement";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard component
const ProtectedRoute = ({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) => {
  const { isAuthenticated, isAdmin } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// User route guard - prevents admins from accessing user-specific features
const UserOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAdmin } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* User routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/claims" element={
              <ProtectedRoute>
                <ClaimsPage />
              </ProtectedRoute>
            } />
            <Route path="/claims/new" element={
              <UserOnlyRoute>
                <NewClaimForm />
              </UserOnlyRoute>
            } />
            <Route path="/attendance" element={
              <UserOnlyRoute>
                <AttendancePage />
              </UserOnlyRoute>
            } />
            <Route path="/leave" element={
              <UserOnlyRoute>
                <LeavePage />
              </UserOnlyRoute>
            } />
            
            {/* Report routes - available to all authenticated users */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/reports/attendance" element={
              <ProtectedRoute>
                <AttendanceReport />
              </ProtectedRoute>
            } />
            <Route path="/reports/claims" element={
              <ProtectedRoute>
                <ClaimsReport />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/leave" element={
              <ProtectedRoute adminOnly={true}>
                <LeaveManagement />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
