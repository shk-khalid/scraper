import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/auth/AuthGuard";
import PublicRoute from "@/components/auth/PublicRoutes";

// Pages
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const AppRoutes: React.FC = () => {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
                </Route>

                {/* Protected Routes */}
                <Route element={<AuthGuard />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* Redirect unknown paths to 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
