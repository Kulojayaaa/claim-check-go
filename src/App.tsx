
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/claims/new" element={<NewClaimForm />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/attendance" element={<AttendanceReport />} />
            <Route path="/reports/claims" element={<ClaimsReport />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/leave" element={<LeaveManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
