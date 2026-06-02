import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import RegPage from "../pages/RegPage/RegPage.tsx";
import BoardPage from "../pages/BoardsPage/BoardsPage.tsx";
import type React from "react";

import MainLayout from "../layout/MainLayout.tsx";


function ProtectedRoute({ children} : { children: React.ReactNode }) {
    const {user, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    return children;
}


function PublicOnlyRoute({children} : { children: React.ReactNode }) {

    const {user, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if(user){
        return <Navigate to="/board" replace />
    }

    return children;
}


export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/board" replace />} />

            <Route
            path="/login"
            element={
                <PublicOnlyRoute>
                <LoginPage />
                </PublicOnlyRoute>
            }
            />

            <Route
            path="/register"
            element={
                <PublicOnlyRoute>
                <RegPage />
                </PublicOnlyRoute>
            }
            />

            <Route
            element={
                <ProtectedRoute>
                <MainLayout />
                </ProtectedRoute>
            }
            >
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
            </Route>
        </Routes>
    )
}