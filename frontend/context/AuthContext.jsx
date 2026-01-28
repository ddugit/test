"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem("sympto-care-user")
        const token = localStorage.getItem("sympto-care-token")
        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Login failed");
            }

            const data = await response.json();

            const newUser = {
                id: data.id,
                name: data.username,
                email: data.email,
                roles: data.roles
            }

            setUser(newUser)
            localStorage.setItem("sympto-care-user", JSON.stringify(newUser))
            localStorage.setItem("sympto-care-token", data.token)

            if (data.roles.includes("ROLE_ADMIN")) {
                router.push("/admin/dashboard")
            } else {
                router.push("/dashboard")
            }
            return { success: true }
        } catch (error) {
            console.error("Login Error:", error)
            return { success: false, error: error.message }
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role: ["user"] })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Registration failed");
            }

            return { success: true }
        } catch (error) {
            console.error("Registration Error:", error)
            return { success: false, error: error.message }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("sympto-care-user")
        localStorage.removeItem("sympto-care-token")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
