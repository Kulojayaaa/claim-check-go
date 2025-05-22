
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { AttendanceRecord } from "@/services/mockData";
import { Calendar, Clock, Map, FileText, Briefcase } from "lucide-react";

interface AttendanceCardProps {
  record: AttendanceRecord;
}

const AttendanceCard = ({ record }: AttendanceCardProps) => {
  const { userName, date, status, checkInTime, checkOutTime, location, notes, project } = record;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{userName}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {project && (
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
            <span>{project}</span>
          </div>
        )}
        
        {(checkInTime || checkOutTime) && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              {checkInTime && <span>Check-in: <strong>{checkInTime}</strong></span>}
              {checkInTime && checkOutTime && <span className="mx-2">•</span>}
              {checkOutTime && <span>Check-out: <strong>{checkOutTime}</strong></span>}
            </div>
          </div>
        )}
        
        {location && (
          <div className="flex items-center text-sm">
            <Map className="h-4 w-4 mr-2 text-gray-500" />
            <span>{location.address}</span>
          </div>
        )}
        
        {notes && (
          <div className="flex items-start text-sm">
            <FileText className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
            <span>{notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
