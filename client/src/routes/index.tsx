import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/auth/AuthGuard";
import PublicRoute from "@/components/auth/PublicRoutes";

import Layout from "@/components/layout"
import ContractsPage from "@/pages/merchant/Contracts";
import ContractDetailPage from "@/pages/merchant/ContractDetails";
import ClaimsPage from "@/pages/merchant/Claims";
import ClaimDetailPage from "@/pages/merchant/ClaimDetails";
import Leads from "@/pages/merchant/Leads";
import ProductsPage from "@/pages/merchant/Product";
import ProductDetailPage from '@/pages/merchant/ProductDetails';
import Analytics from "@/pages/merchant/Analytics";
import Customize from "@/pages/merchant/Customize";
import SettingsPage from "@/pages/merchant/Settings";
import Users from "@/pages/merchant/User";
import UserDetail from "@/pages/merchant/UserDetails";

// Authentication Page
import Login from "@/pages/auth/Login";
import ResetPassword from "@/pages/auth/ResetPassword";


const AppRoutes: React.FC = () => {
    return (
        <AnimatePresence mode="wait">
            <Routes>


                <Route path="/" element={<Navigate to="/merchant/contracts" replace />} />



                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Protected Customer Routes */}
                <Route element={<AuthGuard />}>
                    <Route path="/merchant" element={<Layout />}>
                        <Route path="contracts" element={<ContractsPage />} />
                        <Route path="contracts/:contractId" element={<ContractDetailPage />} />
                        <Route path="claims" element={<ClaimsPage />} />
                        <Route path="claims/:claimId" element={<ClaimDetailPage />} />
                        <Route path="leads" element={<Leads />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:productId" element={<ProductDetailPage />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="customize" element={<Customize />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="user" element={<Users />} />
                        <Route path="user/:userId" element={<UserDetail />} />


                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
