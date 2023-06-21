import { createContext, useState, useEffect } from "react";
import { parseCookies } from "nookies";
import axios from "axios";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        const {'token.authRRUN23' : token} = parseCookies(null)
        if(token){
            axios.post('/api/auth/reload', {id: token})
            .then(result => {
                setUser(result.data.user)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [])
    
    function setLogin(data) {
        setUser(data.user)
        console.log(data)
    }
    return (
        <AuthContext.Provider value={{
            setLogin,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}