
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      // Claim statuses
      case "approved":
        return "bg-status-success text-white";
      case "rejected":
        return "bg-status-error text-white";
      case "pending":
        return "bg-status-warning text-black";
      
      // Attendance statuses
      case "present":
      case "weekly-present":
      case "holiday-present":
      case "half-day-present":
        return "bg-status-success text-white";
      case "leave":
      case "half-day-leave":
        return "bg-status-error text-white";
      case "weekly-off":
      case "holiday-off":
        return "bg-gray-400 text-white";
      case "comp-off":
        return "bg-blue-400 text-white";
      case "late":
        return "bg-status-warning text-black";
      
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <Badge className={cn(getStatusStyles(), "font-medium capitalize", className)}>
      {status.replace(/-/g, " ")}
    </Badge>
  );
};

export default StatusBadge;
