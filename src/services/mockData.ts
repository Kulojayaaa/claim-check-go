
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
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  status: "present" | "absent" | "late" | "on-leave" | "sick";
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number; address: string };
  notes?: string;
  approvedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  department: string;
  location: string;
  isActive: boolean;
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

// Status options for attendance
export const attendanceStatusOptions = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "on-leave", label: "On Leave" },
  { value: "sick", label: "Sick Leave" }
];
