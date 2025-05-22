
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  toggleUserRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // For demo purposes, initialize with a mock user
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin", // Start as admin for demo
    department: "Construction",
    location: "Site A"
  });

  const isAdmin = currentUser?.role === "admin";

  const toggleUserRole = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: currentUser.role === "admin" ? "user" : "admin"
      });
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isAdmin, toggleUserRole }}>
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
