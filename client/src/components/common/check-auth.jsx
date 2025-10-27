import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  
  if(location.pathname === "/") {
    if(!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }else{
         return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;

    }
  }
  // 🔒 Not logged in → block everything except login/register
  if (!isAuthenticated && !path.includes("/login") && !path.includes("/register")) {
    return <Navigate to="/auth/login" replace />;
  }

  // 🔑 Already logged in but trying to access login/register → redirect by role
  if (isAuthenticated && (path.includes("/login") || path.includes("/register"))) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // 🚫 Non-admin user trying to access admin routes
  if (isAuthenticated && user?.role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/unAuthPage" replace />;
  }

  // 🚫 Admin user trying to access shop routes
  if (isAuthenticated && user?.role === "admin" && path.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ If no rules triggered, render the requested page
  return children;
}
