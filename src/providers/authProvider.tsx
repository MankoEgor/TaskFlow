import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

type AuthProviderProps = {
  children: React.ReactNode;
};


export function AuthProvider({ children } : AuthProviderProps){
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInitialSession = async () => {
            const {data, error} = await supabase.auth.getSession();
            if(error){
                console.error("Error fetching session:", error);
            }
                

            setSession(data.session);
            setUser(data.session?.user || null);
            setLoading(false);
        };

        getInitialSession();

        const { data: {subscription} } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        }

    }, []);

    const signOut = async () => {
            await supabase.auth.signOut();
        }

    return (
        <AuthContext.Provider value={{ user, session, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )

}
