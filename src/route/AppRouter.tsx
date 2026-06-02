import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import RegPage from "../pages/RegPage/RegPage.tsx";
import BoardPage from "../pages/BoardPage/BoardPage.tsx";
import type React from "react";

import Footer from "../components/Footer/Footer.tsx";
import Header from "../components/Header/Header.tsx";


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

            <Route path="/login" element={
                <PublicOnlyRoute>
                    <LoginPage />
                </PublicOnlyRoute>
                } />

            <Route path="/register" element={
                <PublicOnlyRoute>
                    <RegPage />
                </PublicOnlyRoute>
                } />

            <Route path="/board" element={
                <ProtectedRoute>
                    <Header/>
                    <BoardPage />
                    <Footer/>
                </ProtectedRoute>
                } />


            <Route 
                path="/register" 
                element={
                    <PublicOnlyRoute>
                        <RegPage />
                    </PublicOnlyRoute>
                } />



            <Route 
                path="/boards"
                element={
                    <>
                        <ProtectedRoute>
                            <Header/>
                            <BoardPage />
                            <Footer/>
                        </ProtectedRoute>
                    </>
                    
                } />
        </Routes>
    );
}