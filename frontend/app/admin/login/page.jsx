"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simulated admin check
        if (email.includes("admin") || password === "admin") {
            login(email || "admin@sympto.care", "admin")
        } else {
            alert("For demo, use 'admin' in email or password")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-900 px-4">
            <Card className="w-full max-w-sm shadow-md border-slate-700 bg-slate-800 text-white">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-red-900/50">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Authorized personnel only
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Admin Email"
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                required
                                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" variant="destructive" className="w-full">
                            Login to Console
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
