
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
  password?: string; // Only used internally for authentication
  isActive?: boolean;
  leaveBalance?: number;
  leaveTaken?: number;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  toggleUserRole: () => void;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, "isActive">) => void;
  deleteUser: (userId: string) => void;
  toggleUserActive: (userId: string) => void;
}

// Initial users including admin and sample user
const initialUsers: User[] = [
  {
    id: "Admin",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    department: "Management",
    location: "Head Office",
    password: "Password",
    isActive: true,
    leaveBalance: 30,
    leaveTaken: 5
  },
  {
    id: "User1",
    name: "Regular User",
    email: "user1@example.com",
    role: "user",
    department: "Construction",
    location: "Site A",
    password: "Password1",
    isActive: true,
    leaveBalance: 20,
    leaveTaken: 2
  },
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    department: "Construction",
    location: "Site A",
    password: "password123",
    isActive: true,
    leaveBalance: 25,
    leaveTaken: 10
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    department: "Electrical",
    location: "Site B",
    password: "password123",
    isActive: true,
    leaveBalance: 15,
    leaveTaken: 8
  }
];

const USER_STORAGE_KEY = "projectsite_currentUser";
const USERS_STORAGE_KEY = "projectsite_users";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Try to get user from localStorage
  const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  };

  // Get stored users or use initial users
  const getStoredUsers = (): User[] => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : initialUsers;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [users, setUsers] = useState<User[]>(getStoredUsers());

  // Update localStorage when users change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === "admin";
  const isAuthenticated = currentUser !== null;

  const toggleUserRole = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: currentUser.role === "admin" ? "user" : "admin"
      });
    }
  };

  const login = (userId: string, password: string): boolean => {
    const user = users.find(
      u => u.id === userId && u.password === password && u.isActive !== false
    );
    
    if (user) {
      // Create a copy without the password
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser: Omit<User, "isActive">) => {
    const userWithDefaults = {
      ...newUser,
      isActive: true,
      leaveBalance: newUser.leaveBalance || 20,
      leaveTaken: 0
    };
    setUsers(prev => [...prev, userWithDefaults]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const toggleUserActive = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: !user.isActive } 
          : user
      )
    );
  };

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        isAdmin, 
        isAuthenticated,
        toggleUserRole, 
        login, 
        logout,
        users,
        addUser,
        deleteUser,
        toggleUserActive
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
