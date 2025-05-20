import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Home/Dashboard";
import Login from "../Auth/Login";
import Signup from "../Auth/SignUp";
import TodoCards from "../TodoCards/TodoCards";

// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import UserProfileList from "../AllEmployee/UserProfileList";
import EmployeeProfile from "../EmployeeProfile/EmployeeProfile";
import Note from "../Notes/Note";

export function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // or use context
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // or use context
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function Router() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todocard"
          element={
            <ProtectedRoute>
              <TodoCards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employeelist"
          element={
            <ProtectedRoute>
              <UserProfileList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Note />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}
