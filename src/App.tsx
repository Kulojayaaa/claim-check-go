
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
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
              <ProtectedRoute>
                <NewClaimForm />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/leave" element={
              <ProtectedRoute>
                <LeavePage />
              </ProtectedRoute>
            } />
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
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/leave" element={
              <ProtectedRoute>
                <LeaveManagement />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
