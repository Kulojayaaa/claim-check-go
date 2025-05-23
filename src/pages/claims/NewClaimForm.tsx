
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, Plus, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Expense item type
type ExpenseItem = {
  id: string;
  date: string;
  projectId: string;
  category: string;
  amount: string;
  description: string;
  receipt?: File | null;
  receiptName?: string;
};

// Mock projects and categories
const projects = ["Project A", "Project B", "Project C", "Head Office"];
const categories = ["Travel", "Meals", "Accommodation", "Office Supplies", "Other"];

const NewClaimForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      category: "",
      amount: "",
      description: "",
      receipt: null,
      receiptName: "",
    },
  ]);

  const addExpenseItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      category: "",
      amount: "",
      description: "",
      receipt: null,
      receiptName: "",
    };
    setExpenseItems([...expenseItems, newItem]);
  };

  const removeExpenseItem = (id: string) => {
    if (expenseItems.length <= 1) {
      toast({
        title: "Cannot Remove Item",
        description: "You must have at least one expense item in your claim.",
        variant: "destructive",
      });
      return;
    }
    
    setExpenseItems(expenseItems.filter((item) => item.id !== id));
  };

  const updateExpenseItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setExpenseItems(
      expenseItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleReceiptUpload = (id: string, file: File | null) => {
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type (only images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG, PNG, and PDF files are allowed",
          variant: "destructive",
        });
        return;
      }
      
      updateExpenseItem(id, 'receipt', file);
      updateExpenseItem(id, 'receiptName', file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your claim",
        variant: "destructive",
      });
      return;
    }

    // Check all expense items have required fields
    const missingFields = expenseItems.some(
      item => !item.date || !item.projectId || !item.category || !item.amount || !item.description
    );

    if (missingFields) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields for each expense item",
        variant: "destructive",
      });
      return;
    }

    // Calculate total claim amount
    const totalAmount = expenseItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    // Submit claim (in a real app, this would be an API call)
    console.log("Submitting claim:", {
      title,
      description,
      totalAmount,
      items: expenseItems,
    });

    toast({
      title: "Claim submitted",
      description: `Your claim for ₹${totalAmount.toLocaleString('en-IN')} has been submitted for approval`,
    });

    // Navigate back to claims list
    navigate("/claims");
  };

  const calculateTotal = () => {
    return expenseItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
  };

  return (
    <Layout title="New Claim">
      <div className="max-w-7xl mx-auto"> {/* Increased max width even further */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>New Expense Claim</CardTitle>
                <CardDescription>Submit a new expense claim for reimbursement</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Claim Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Claim Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for this claim"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter any additional details about this claim"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Expense Items Table */}
              <div className="rounded-md border overflow-hidden">
                <Table className="min-w-full">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[160px]">Date</TableHead> {/* Increased width */}
                      <TableHead className="w-[200px]">Project</TableHead> {/* Increased width */}
                      <TableHead className="w-[220px]">Category</TableHead> {/* Increased width */}
                      <TableHead className="w-[180px]">Amount (₹)</TableHead> {/* Increased width */}
                      <TableHead className="min-w-[280px]">Description</TableHead> {/* Set minimum width */}
                      <TableHead className="w-[150px]">Receipt</TableHead> {/* Increased width */}
                      <TableHead className="w-[100px]">Actions</TableHead> {/* Increased width */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseItems.map((item) => (
                      <TableRow key={item.id}>
                        {/* Date */}
                        <TableCell>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) => updateExpenseItem(item.id, 'date', e.target.value)}
                            className="w-full text-sm"
                          />
                        </TableCell>
                        
                        {/* Project */}
                        <TableCell>
                          <Select
                            value={item.projectId}
                            onValueChange={(value) => updateExpenseItem(item.id, 'projectId', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project} value={project}>
                                  {project}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        {/* Category */}
                        <TableCell>
                          <Select
                            value={item.category}
                            onValueChange={(value) => updateExpenseItem(item.id, 'category', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        {/* Amount */}
                        <TableCell>
                          <div className="flex items-center border rounded-md pl-2 bg-background focus-within:ring-1 focus-within:ring-ring">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              value={item.amount}
                              onChange={(e) => updateExpenseItem(item.id, 'amount', e.target.value)}
                              className="border-0 pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </TableCell>
                        
                        {/* Description */}
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                            placeholder="Brief description"
                          />
                        </TableCell>
                        
                        {/* Receipt */}
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <label 
                              htmlFor={`receipt-${item.id}`}
                              className="flex items-center justify-center cursor-pointer w-full h-8 rounded-md text-xs border border-dashed border-muted-foreground/50 hover:bg-muted p-1"
                            >
                              <UploadCloud className="h-4 w-4 mr-1" />
                              <span>{item.receipt ? "Change" : "Upload"}</span>
                              <input
                                type="file"
                                id={`receipt-${item.id}`}
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleReceiptUpload(item.id, file);
                                }}
                                accept="image/jpeg,image/png,application/pdf"
                              />
                            </label>
                            
                            {item.receiptName && (
                              <span className="text-xs truncate max-w-[120px]" title={item.receiptName}>
                                {item.receiptName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* Actions */}
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeExpenseItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Add Expense Button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={addExpenseItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Expense Item
              </Button>
              
              {/* Total */}
              <div className="flex justify-end">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Total Claim Amount</div>
                  <div className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {calculateTotal().toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate("/claims")}>
                Cancel
              </Button>
              <Button type="submit">Submit Claim</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default NewClaimForm;
