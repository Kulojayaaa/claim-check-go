
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { LeaveRequest } from "@/services/mockData";
import { useUser } from "@/contexts/UserContext";
import { Check, X, Calendar } from "lucide-react";

interface LeaveRequestCardProps {
  leaveRequest: LeaveRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const LeaveRequestCard = ({ leaveRequest, onApprove, onReject }: LeaveRequestCardProps) => {
  const { isAdmin } = useUser();
  const { id, userId, userName, leaveType, startDate, endDate, reason, status } = leaveRequest;

  const formattedStartDate = new Date(startDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{leaveType}</CardTitle>
            <p className="text-sm text-gray-500">{userName}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center mb-2">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <p className="text-sm">
            {formattedStartDate} to {formattedEndDate} ({diffDays} {diffDays === 1 ? 'day' : 'days'})
          </p>
        </div>
        <p className="text-gray-700 mt-2">{reason}</p>
      </CardContent>
      
      {isAdmin && status === "pending" && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-status-success text-status-success hover:bg-status-success hover:text-white"
            onClick={() => onApprove && onApprove(id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-status-error text-status-error hover:bg-status-error hover:text-white"
            onClick={() => onReject && onReject(id)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LeaveRequestCard;
