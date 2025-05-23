
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "@/components/ui/date-range-picker";
import { claims } from "@/services/mockData";
import StatusBadge from "@/components/StatusBadge";
import StatsCard from "@/components/StatsCard";
import { useUser } from "@/contexts/UserContext";
import { FileBarChart, FileDown, Filter, Search } from "lucide-react";

const ClaimsReport = () => {
  const { isAdmin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  // Filter claims based on search, status, and date
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    
    const matchesDate = !dateRange || !dateRange.from || !dateRange.to || 
      (new Date(claim.date) >= dateRange.from && new Date(claim.date) <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = filteredClaims
    .filter(claim => claim.status === "approved")
    .reduce((sum, claim) => sum + claim.amount, 0);
  const pendingAmount = filteredClaims
    .filter(claim => claim.status === "pending")
    .reduce((sum, claim) => sum + claim.amount, 0);

  const exportToCsv = () => {
    // Implementation would go here in a real app
    console.log("Export to CSV clicked");
  };

  return (
    <Layout title="Claims Report">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard 
            title="Total Claims" 
            value={totalAmount} 
            description={`${filteredClaims.length} claims`}
            icon={<FileBarChart className="h-5 w-5" />}
            isCurrency={true}
          />
          <StatsCard 
            title="Approved Claims" 
            value={approvedAmount} 
            description={`${filteredClaims.filter(c => c.status === "approved").length} claims`}
            icon={<FileBarChart className="h-5 w-5" />}
            color="green"
            isCurrency={true}
          />
          <StatsCard 
            title="Pending Claims" 
            value={pendingAmount} 
            description={`${filteredClaims.filter(c => c.status === "pending").length} claims`}
            icon={<FileBarChart className="h-5 w-5" />}
            color="amber"
            isCurrency={true}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Claims Report</CardTitle>
                <CardDescription>View and filter expense claims</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={exportToCsv}>
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <DateRange 
                  value={dateRange} 
                  onValueChange={setDateRange} 
                />
              </div>
            </div>

            {/* Claims Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No claims found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClaims.map(claim => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>{claim.userId}</TableCell>
                        <TableCell>{claim.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{claim.amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={claim.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClaimsReport;
