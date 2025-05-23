export interface Claim {
  id: string;
  userId: string;
  userName: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  project?: string; // Add project field
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  status: string; // Update to allow all possible attendance status values
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number; address: string };
  notes?: string;
  approvedBy?: string;
  project?: string; // Add project field
}

// Mock users
export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    department: "Construction",
    location: "Site A",
    isActive: true
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    department: "Engineering",
    location: "Site B",
    isActive: true
  },
  {
    id: "u3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    department: "Electrical",
    location: "Site A",
    isActive: true
  },
  {
    id: "u4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    department: "Construction",
    location: "Site C",
    isActive: true
  },
  {
    id: "u5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "admin",
    department: "Management",
    location: "HQ",
    isActive: true
  }
];

// Mock claims
export const claims: Claim[] = [
  {
    id: "c1",
    userId: "u2",
    userName: "Jane Smith",
    category: "Transportation",
    amount: 75.50,
    description: "Taxi to Site B",
    date: "2025-05-10",
    status: "approved",
    receiptUrl: "/placeholder.svg",
    approvedBy: "John Doe",
    approvedAt: "2025-05-12"
  },
  {
    id: "c2",
    userId: "u3",
    userName: "Bob Johnson",
    category: "Meals",
    amount: 32.75,
    description: "Lunch with team",
    date: "2025-05-15",
    status: "pending"
  },
  {
    id: "c3",
    userId: "u4",
    userName: "Alice Williams",
    category: "Equipment",
    amount: 129.99,
    description: "Safety gear",
    date: "2025-05-08",
    status: "rejected",
    receiptUrl: "/placeholder.svg",
    rejectedReason: "Receipt unclear"
  },
  {
    id: "c4",
    userId: "u2",
    userName: "Jane Smith",
    category: "Supplies",
    amount: 45.25,
    description: "Office supplies",
    date: "2025-05-18",
    status: "pending",
    receiptUrl: "/placeholder.svg"
  },
  {
    id: "c5",
    userId: "u3",
    userName: "Bob Johnson",
    category: "Transportation",
    amount: 120.00,
    description: "Fuel reimbursement",
    date: "2025-05-20",
    status: "pending"
  }
];

// Mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "a1",
    userId: "u2",
    userName: "Jane Smith",
    date: "2025-05-21",
    status: "present",
    checkInTime: "08:15",
    checkOutTime: "17:30",
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      address: "123 Construction Ave, Site B"
    }
  },
  {
    id: "a2",
    userId: "u3",
    userName: "Bob Johnson",
    date: "2025-05-21",
    status: "late",
    checkInTime: "09:45",
    checkOutTime: "18:00",
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      address: "456 Building St, Site A"
    },
    notes: "Traffic delay"
  },
  {
    id: "a3",
    userId: "u4",
    userName: "Alice Williams",
    date: "2025-05-21",
    status: "absent",
    notes: "Called in sick"
  },
  {
    id: "a4",
    userId: "u2",
    userName: "Jane Smith",
    date: "2025-05-20",
    status: "present",
    checkInTime: "08:05",
    checkOutTime: "17:15",
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      address: "123 Construction Ave, Site B"
    }
  },
  {
    id: "a5",
    userId: "u3",
    userName: "Bob Johnson",
    date: "2025-05-20",
    status: "present",
    checkInTime: "08:30",
    checkOutTime: "17:45",
    location: { 
      lat: 37.7749, 
      lng: -122.4194,
      address: "456 Building St, Site A"
    }
  },
  {
    id: "a6",
    userId: "u4",
    userName: "Alice Williams",
    date: "2025-05-20",
    status: "on-leave",
    notes: "Annual leave"
  }
];

// Category options for claims
export const claimCategories = [
  "Transportation",
  "Meals",
  "Accommodation",
  "Equipment",
  "Supplies",
  "Communication",
  "Maintenance",
  "Other"
];

// Update attendance status options to match the new values
export const attendanceStatusOptions = [
  { value: "present", label: "Present" },
  { value: "leave", label: "Leave" },
  { value: "weekly-off", label: "Weekly Off" },
  { value: "weekly-present", label: "Weekly Present" },
  { value: "comp-off", label: "Comp Off" },
  { value: "holiday-off", label: "Holiday Off" },
  { value: "holiday-present", label: "Holiday Present" },
  { value: "half-day-present", label: "Half day Present" },
  { value: "half-day-leave", label: "Half Day Leave" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "on-leave", label: "On Leave" },
  { value: "sick", label: "Sick Leave" }
];

// Add Leave Types and Leave Requests
export const leaveTypes = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Bereavement",
  "Compensatory Off",
  "Unpaid Leave"
];

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface LeaveBalance {
  userId: string;
  userName: string;
  annual: number;
  sick: number;
  personal: number;
  compensatory: number;
  total: number;
  used: number;
}

// Generate Leave Requests
export const leaveRequests: LeaveRequest[] = [
  {
    id: "lr1",
    userId: "u1",
    userName: "John Doe",
    leaveType: "Annual Leave",
    startDate: "2025-05-25",
    endDate: "2025-05-27",
    reason: "Family vacation",
    status: "approved",
    createdAt: "2025-05-15T10:30:00"
  },
  {
    id: "lr2",
    userId: "u2",
    userName: "Jane Smith",
    leaveType: "Sick Leave",
    startDate: "2025-05-24",
    endDate: "2025-05-24",
    reason: "Not feeling well",
    status: "approved",
    createdAt: "2025-05-23T08:15:00"
  },
  {
    id: "lr3",
    userId: "u3",
    userName: "Michael Johnson",
    leaveType: "Personal Leave",
    startDate: "2025-05-30",
    endDate: "2025-05-31",
    reason: "Personal matters",
    status: "pending",
    createdAt: "2025-05-20T14:45:00"
  },
  {
    id: "lr4",
    userId: "u1",
    userName: "John Doe",
    leaveType: "Bereavement",
    startDate: "2025-05-10",
    endDate: "2025-05-12",
    reason: "Family emergency",
    status: "approved",
    createdAt: "2025-05-09T09:00:00"
  },
  {
    id: "lr5",
    userId: "u4",
    userName: "Emily Brown",
    leaveType: "Compensatory Off",
    startDate: "2025-05-28",
    endDate: "2025-05-28",
    reason: "Worked on weekend",
    status: "pending",
    createdAt: "2025-05-22T16:30:00"
  },
  {
    id: "lr6",
    userId: "u1",
    userName: "John Doe",
    leaveType: "Annual Leave",
    startDate: "2025-06-15",
    endDate: "2025-06-18",
    reason: "Summer vacation",
    status: "pending",
    createdAt: "2025-05-20T11:20:00"
  }
];

// Generate Leave Balances
export const leaveBalances: LeaveBalance[] = [
  {
    userId: "u1",
    userName: "John Doe",
    annual: 15,
    sick: 10,
    personal: 5,
    compensatory: 2,
    total: 32,
    used: 7
  },
  {
    userId: "u2",
    userName: "Jane Smith",
    annual: 15,
    sick: 10,
    personal: 5,
    compensatory: 0,
    total: 30,
    used: 3
  },
  {
    userId: "u3",
    userName: "Michael Johnson",
    annual: 12,
    sick: 10,
    personal: 5,
    compensatory: 1,
    total: 28,
    used: 5
  },
  {
    userId: "u4",
    userName: "Emily Brown",
    annual: 15,
    sick: 10,
    personal: 5,
    compensatory: 3,
    total: 33,
    used: 8
  },
  {
    userId: "u5",
    userName: "David Wilson",
    annual: 18,
    sick: 10,
    personal: 5,
    compensatory: 0,
    total: 33,
    used: 10
  }
];

// Update any amount formatter functions to use INR
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};
