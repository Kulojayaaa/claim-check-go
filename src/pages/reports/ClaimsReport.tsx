
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { claims, claimCategories } from "@/services/mockData";
import StatusBadge from "@/components/StatusBadge";
import { useUser } from "@/contexts/UserContext";
import { BarChart, ChevronLeft, Download, FileText, Search } from "lucide-react";

const ClaimsReport = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useUser();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter claims based on user role
  const userClaims = isAdmin 
    ? claims 
    : claims.filter(claim => claim.userId === currentUser?.id);
  
  // Filter by date range
  const dateFilteredClaims = userClaims.filter(claim => {
    const claimDate = new Date(claim.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return claimDate >= start && claimDate <= end;
    } else if (start) {
      return claimDate >= start;
    } else if (end) {
      return claimDate <= end;
    }
    
    return true;
  });
  
  // Filter by category
  const categoryFilteredClaims = category === "all"
    ? dateFilteredClaims
    : dateFilteredClaims.filter(claim => claim.category === category);
  
  // Filter by status
  const statusFilteredClaims = status === "all"
    ? categoryFilteredClaims
    : categoryFilteredClaims.filter(claim => claim.status === status);
  
  // Filter by search
  const filteredClaims = searchQuery
    ? statusFilteredClaims.filter(claim => 
        claim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : statusFilteredClaims;
  
  // Calculate totals
  const totalAmount = filteredClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = filteredClaims
    .filter(claim => claim.status === "approved")
    .reduce((sum, claim) => sum + claim.amount, 0);
  const pendingAmount = filteredClaims
    .filter(claim => claim.status === "pending")
    .reduce((sum, claim) => sum + claim.amount, 0);
  
  // Calculate by category
  const categoryTotals = filteredClaims.reduce((acc, claim) => {
    acc[claim.category] = (acc[claim.category] || 0) + claim.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <Layout title="Claims Report">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/reports")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your claims report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {claimCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{filteredClaims.length}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {filteredClaims.filter(c => c.status === "approved").length}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(approvedAmount)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-status-success/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-status-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {filteredClaims.filter(c => c.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(pendingAmount)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-status-warning/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-status-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                {Object.keys(categoryTotals).length > 0 ? (
                  <div className="w-full space-y-3">
                    {Object.entries(categoryTotals).map(([cat, amount]) => (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{cat}</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-primary rounded-full h-2.5" 
                            style={{ width: `${(amount / totalAmount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Claims by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center">
                {filteredClaims.length > 0 ? (
                  <div className="w-full space-y-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Status</span>
                      <span>Count</span>
                    </div>
                    
                    <div className="space-y-3">
                      {["approved", "pending", "rejected"].map(stat => {
                        const count = filteredClaims.filter(c => c.status === stat).length;
                        return (
                          <div key={stat} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{stat}</span>
                              <span>{count}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div 
                                className={`rounded-full h-2.5 ${
                                  stat === "approved" ? "bg-status-success" :
                                  stat === "pending" ? "bg-status-warning" :
                                  "bg-status-error"
                                }`}
                                style={{ width: `${(count / filteredClaims.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-sm font-medium">{filteredClaims.length}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>No data to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Claims List</CardTitle>
            <CardDescription>
              Showing {filteredClaims.length} claims
              {startDate && endDate ? ` from ${startDate} to ${endDate}` : 
               startDate ? ` from ${startDate}` : 
               endDate ? ` until ${endDate}` : 
               ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredClaims.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {isAdmin && <TableHead>Employee</TableHead>}
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map(claim => (
                      <TableRow key={claim.id}>
                        <TableCell>
                          {new Date(claim.date).toLocaleDateString()}
                        </TableCell>
                        {isAdmin && <TableCell>{claim.userName}</TableCell>}
                        <TableCell>{claim.category}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {claim.description}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(claim.amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={claim.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No claims found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClaimsReport;
