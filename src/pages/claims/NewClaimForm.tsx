
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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Calendar, Upload, FileText, IndianRupee, Briefcase } from "lucide-react";

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

const NewClaimForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    receipt: null as File | null,
    project: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
      setReceiptFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.category || !formData.amount || !formData.date || !formData.description || !formData.project) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Claim submitted",
        description: "Your claim has been submitted successfully",
      });
      setIsSubmitting(false);
      navigate("/claims");
    }, 1000);
  };

  return (
    <Layout title="New Claim">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>New Expense Claim</CardTitle>
            <CardDescription>Submit a new expense reimbursement request</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Project */}
              <div className="space-y-2">
                <Label htmlFor="project">Project <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.project}
                  onValueChange={(value) => handleSelectChange("project", value)}
                >
                  <SelectTrigger id="project" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectOptions.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Expense Category <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select expense category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (INR) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="pl-10"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about this expense"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    id="receipt"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {receiptFileName ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">{receiptFileName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, receipt: null }));
                          setReceiptFileName("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="receipt" className="cursor-pointer block">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Drag and drop or <span className="text-primary">browse</span> to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </label>
                  )}
                </div>
              </div>
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
