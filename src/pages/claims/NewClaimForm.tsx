import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Calendar, Upload, FileText, IndianRupee, Briefcase, Plus, Trash2 } from "lucide-react";

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

const projectOptions = [
  "Project A",
  "Project B",
  "Project C",
  "Project D",
  "Head Office"
];

// Define expense item structure
interface ExpenseItem {
  id: string;
  category: string;
  amount: string;
  date: string;
  description: string;
  project: string;
  receipt: File | null;
  receiptName: string;
}

// Generate a unique ID
const generateId = () => `exp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

// Create a default expense item
const createDefaultExpenseItem = (): ExpenseItem => ({
  id: generateId(),
  category: "",
  amount: "",
  date: new Date().toISOString().split('T')[0],
  description: "",
  project: "",
  receipt: null,
  receiptName: ""
});

const NewClaimForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();

  // Use an array of expense items
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([createDefaultExpenseItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = () => {
    setExpenseItems([...expenseItems, createDefaultExpenseItem()]);
  };

  const handleRemoveExpense = (id: string) => {
    if (expenseItems.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one expense item",
        variant: "destructive",
      });
      return;
    }
    
    setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const updateExpenseItem = (id: string, field: keyof ExpenseItem, value: string | File | null) => {
    setExpenseItems(items => 
      items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              [field]: value,
              ...(field === 'receipt' && value 
                ? { receiptName: (value as File).name } 
                : {})
            } 
          : item
      )
    );
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateExpenseItem(id, 'receipt', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all expense items
    const invalidItems = expenseItems.filter(
      item => !item.category || !item.amount || !item.date || !item.description || !item.project
    );

    if (invalidItems.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields for all expense items`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Calculate total amount
    const totalAmount = expenseItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0), 
      0
    );

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Claim submitted",
        description: `Your claim with ${expenseItems.length} expense item(s) totaling ₹${totalAmount.toFixed(2)} has been submitted`,
      });
      setIsSubmitting(false);
      navigate("/claims");
    }, 1000);
  };

  return (
    <Layout title="New Claim">
      <div className="max-w-6xl mx-auto"> {/* Increased max width further */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>New Expense Claim</CardTitle>
                <CardDescription>Submit a new expense reimbursement request with multiple items</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Items: {expenseItems.length}</p>
                <p className="text-lg font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0
                  }).format(
                    expenseItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
                  ).replace('₹', '')}
                </p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="overflow-x-auto rounded-md border mb-6">
                <Table className="min-w-full">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[150px]">Date</TableHead> {/* Increased width */}
                      <TableHead className="w-[180px]">Project</TableHead>
                      <TableHead className="w-[200px]">Category</TableHead>
                      <TableHead className="w-[160px]">Amount (₹)</TableHead> {/* Increased width */}
                      <TableHead className="min-w-[250px]">Description</TableHead> {/* Set minimum width */}
                      <TableHead className="w-[130px]">Receipt</TableHead> {/* Increased width */}
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseItems.map((item) => (
                      <TableRow key={item.id}>
                        {/* Date */}
                        <TableCell className="p-2">
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) => updateExpenseItem(item.id, 'date', e.target.value)}
                            className="w-full text-sm"
                          />
                        </TableCell>
                        
                        {/* Project */}
                        <TableCell className="p-2">
                          <Select
                            value={item.project}
                            onValueChange={(value) => updateExpenseItem(item.id, 'project', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectOptions.map((project) => (
                                <SelectItem key={project} value={project}>
                                  {project}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        {/* Category */}
                        <TableCell className="p-2">
                          <Select
                            value={item.category}
                            onValueChange={(value) => updateExpenseItem(item.id, 'category', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {expenseCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        
                        {/* Amount */}
                        <TableCell className="p-2">
                          <div className="relative">
                            <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.amount}
                              onChange={(e) => updateExpenseItem(item.id, 'amount', e.target.value)}
                              className="pl-7 w-full"
                            />
                          </div>
                        </TableCell>
                        
                        {/* Description */}
                        <TableCell className="p-2">
                          <Input
                            type="text"
                            placeholder="Brief description"
                            value={item.description}
                            onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        
                        {/* Receipt */}
                        <TableCell className="p-2">
                          <div className="flex items-center gap-2">
                            <input
                              id={`receipt-${item.id}`}
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleFileChange(item.id, e)}
                            />
                            
                            <label htmlFor={`receipt-${item.id}`} className="cursor-pointer">
                              <div className="flex items-center gap-1 text-xs text-primary underline">
                                <Upload className="h-3 w-3" />
                                {item.receiptName ? 'Change' : 'Upload'}
                              </div>
                            </label>
                            
                            {item.receiptName && (
                              <span className="text-xs truncate max-w-[90px]" title={item.receiptName}>
                                {item.receiptName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* Actions */}
                        <TableCell className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExpense(item.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 text-status-error" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddExpense}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Expense
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/claims")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default NewClaimForm;
