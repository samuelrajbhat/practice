import {Navigate} from "react-router-dom"
import {jwtDecode, JwtDecode} from "jwt-decode"
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { useState, useEffect } from "react"


function ProtectedRoute({ children }){
    const [isAuthorized, setIsAuhtoorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuhtoorized(false))
    }), []

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
                const res = await api.post("/api/token/refresh/", {
                    refresh: refreshToken,
                });
                if (res.status === 200){
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    setIsAuhtoorized(true)                    
                } else {
                    setIsAuhtoorized(false)
                }

        } catch (error) {
            console.log(error)
            setIsAuhtoorized(false)
        }
    }

    // Check for authorization
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token){
            setIsAuhtoorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000
        if (tokenExpiration < now){
            await refreshToken()
        } else {
            setIsAuhtoorized(true)
        }
    }
    
    if(isAuthorized === null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to = "/login" />
}

export default ProtectedRoute;