import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/auth/AuthGuard";
import PublicRoute from "@/components/auth/PublicRoutes";

// Authentication Page
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";
import Register from "@/pages/auth/Register";


const AppRoutes: React.FC = () => {
    return (
        <AnimatePresence mode="wait">
            <Routes>


                {/* <Route path="/" element={<Navigate to="/merchant/contracts" replace />} /> */}



                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register /> } />
                    {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
                </Route>

                {/* Protected Customer Routes */}
                
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
