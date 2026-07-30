import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import RegPage from "../pages/RegPage/RegPage.tsx";
import BoardsPage from "../pages/BoardsPage/BoardsPage.tsx";
import BoardPage from "../pages/BoardPage/BoardPage.tsx";
import NotFoundPage from "../pages/404Page/NotFoundPage.tsx";
import type React from "react";

import MainLayout from "../layout/MainLayout.tsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.tsx";
import Loader from "../components/shared/Loader/Loader.tsx";


function ProtectedRoute({ children} : { children: React.ReactNode }) {
    const {user, loading} = useAuth();

    if (loading) {
        return <Loader/>
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    return children;
}


function PublicOnlyRoute({children} : { children: React.ReactNode }) {

    const {user, loading} = useAuth();

    if (loading) {
        return <Loader/>
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

            <Route path="*" element={<NotFoundPage/>}/>

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
            <Route path="/board" element={<BoardsPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
            <Route path="/profile/:id" element={<ProfilePage/>}/>
            </Route>
        </Routes>
    )
}