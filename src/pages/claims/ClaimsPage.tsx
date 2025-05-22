
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { claims } from "@/services/mockData";
import ClaimCard from "@/components/ClaimCard";
import { useUser } from "@/contexts/UserContext";
import { Plus, Search, FileText, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// List of expense categories
const expenseCategories = [
  "Staff welfare",
  "Fuel",
  "Printer & Stationery",
  "Postage & Courier",
  "EB & water Bill",
  "Room Rent & Hotel Bill",
  "Travel & DA",
  "Medical",
  "Mobile Recharge",
  "Safety Shoe",
  "Repairs & Maintenance",
  "Bike & Car - Service & Maintenance",
  "Material Purchase",
  "Transport & Labour",
  "Loading & Unloading",
  "Promotion & Other",
  "Miscellaneous"
];

const ClaimsPage = () => {
  const { currentUser, isAdmin } = useUser();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Get user claims or all claims if admin
  const userClaims = isAdmin 
    ? claims 
    : claims.filter(claim => claim.userId === currentUser?.id);
  
  // Filter by status
  const statusFilteredClaims = userClaims.filter(claim => {
    if (filter === "all") return true;
    return claim.status === filter;
  });
  
  // Filter by category
  const categoryFilteredClaims = statusFilteredClaims.filter(claim => {
    if (categoryFilter === "all") return true;
    return claim.category === categoryFilter;
  });
  
  // Filter by search query
  const searchFilteredClaims = categoryFilteredClaims.filter(claim => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      claim.category.toLowerCase().includes(query) ||
      claim.description.toLowerCase().includes(query) ||
      (claim.project && claim.project.toLowerCase().includes(query))
    );
  });

  const handleApprove = (id: string) => {
    toast({
      title: "Claim Approved",
      description: "The claim has been successfully approved.",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Claim Rejected",
      description: "The claim has been rejected.",
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout title="Claims">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Claims</h1>
          <p className="text-gray-500">
            {isAdmin ? "Manage all expense claims" : "Submit and track your expense claims"}
          </p>
        </div>
        {!isAdmin && (
          <Button asChild className="bg-primary">
            <Link to="/claims/new">
              <Plus className="mr-2 h-4 w-4" />
              New Claim
            </Link>
          </Button>
        )}
      </div>

      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search claims..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {expenseCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          {/* Grid View */}
          {searchFilteredClaims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchFilteredClaims.map(claim => (
                <ClaimCard 
                  key={claim.id} 
                  claim={claim} 
                  onApprove={isAdmin ? handleApprove : undefined}
                  onReject={isAdmin ? handleReject : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No claims found</h3>
              <p className="text-gray-500">
                {searchQuery || categoryFilter !== "all" ? "Try a different search query or filter" : "Create your first claim to get started"}
              </p>
              {!isAdmin && !searchQuery && categoryFilter === "all" && (
                <Button asChild className="mt-4">
                  <Link to="/claims/new">Create Claim</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {/* List View */}
          {searchFilteredClaims.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      {isAdmin && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      {isAdmin && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchFilteredClaims.map(claim => (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(claim.date).toLocaleDateString()}</td>
                        {isAdmin && <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.userName}</td>}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.project || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {formatCurrency(claim.amount).replace('₹', '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={claim.status} />
                        </td>
                        {isAdmin && claim.status === "pending" && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-status-success border-status-success hover:bg-status-success hover:text-white"
                                onClick={() => handleApprove(claim.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-status-error border-status-error hover:bg-status-error hover:text-white"
                                onClick={() => handleReject(claim.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        )}
                        {isAdmin && claim.status !== "pending" && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            -
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No claims found</h3>
              <p className="text-gray-500">
                {searchQuery || categoryFilter !== "all" ? "Try a different search query or filter" : "Create your first claim to get started"}
              </p>
              {!isAdmin && !searchQuery && categoryFilter === "all" && (
                <Button asChild className="mt-4">
                  <Link to="/claims/new">Create Claim</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ClaimsPage;
