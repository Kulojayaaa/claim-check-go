
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
        return "bg-status-success text-white";
      case "absent":
        return "bg-status-error text-white";
      case "late":
        return "bg-status-warning text-black";
      case "on-leave":
        return "bg-blue-400 text-white";
      case "sick":
        return "bg-orange-400 text-white";
      
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <Badge className={cn(getStatusStyles(), "font-medium capitalize", className)}>
      {status.replace("-", " ")}
    </Badge>
  );
};

export default StatusBadge;
