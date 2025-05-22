
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Claim } from "@/services/mockData";
import { useUser } from "@/contexts/UserContext";
import { FileText, Check, X, IndianRupee } from "lucide-react";

interface ClaimCardProps {
  claim: Claim;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const ClaimCard = ({ claim, onApprove, onReject }: ClaimCardProps) => {
  const { isAdmin } = useUser();
  const { id, userName, category, amount, description, date, status, receiptUrl, project } = claim;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{category}</CardTitle>
            <p className="text-sm text-gray-500">{userName} • {formattedDate}</p>
            {project && <p className="text-sm text-gray-600">Project: {project}</p>}
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="font-semibold text-lg flex items-center">
          <IndianRupee className="h-4 w-4 mr-1" />
          {formattedAmount}
        </p>
        <p className="text-gray-700 mt-2">{description}</p>
        
        {receiptUrl && (
          <div className="mt-3">
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              View Receipt
            </Button>
          </div>
        )}
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

export default ClaimCard;
