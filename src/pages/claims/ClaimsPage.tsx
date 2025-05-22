
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
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
import { Plus, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClaimsPage = () => {
  const { currentUser, isAdmin } = useUser();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get user claims or all claims if admin
  const userClaims = isAdmin 
    ? claims 
    : claims.filter(claim => claim.userId === currentUser?.id);
  
  // Filter by status
  const filteredClaims = userClaims.filter(claim => {
    if (filter === "all") return true;
    return claim.status === filter;
  });
  
  // Filter by search query
  const searchFilteredClaims = filteredClaims.filter(claim => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      claim.category.toLowerCase().includes(query) ||
      claim.description.toLowerCase().includes(query)
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
        <Button asChild className="bg-primary">
          <Link to="/claims/new">
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Link>
        </Button>
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
                {searchQuery ? "Try a different search query" : "Create your first claim to get started"}
              </p>
              {!searchQuery && (
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
              {searchFilteredClaims.map(claim => (
                <div key={claim.id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{claim.category}</h3>
                        <p className="text-sm text-gray-500">#{claim.id.slice(0, 6)}</p>
                      </div>
                      <p className="text-sm">{claim.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD"
                        }).format(claim.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {new Date(claim.date).toLocaleDateString()}
                        </p>
                        <div className="min-w-20 text-right">
                          <StatusBadge status={claim.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No claims found</h3>
              <p className="text-gray-500">
                {searchQuery ? "Try a different search query" : "Create your first claim to get started"}
              </p>
              {!searchQuery && (
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
