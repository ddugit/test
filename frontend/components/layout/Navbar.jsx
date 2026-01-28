"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"

export function Navbar() {
    const { user, logout } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Activity className="h-6 w-6 text-secondary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        SymptoCare
                    </span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/#features" className="transition-colors hover:text-blue-600">
                        Features
                    </Link>
                    <Link href="/#how-it-works" className="transition-colors hover:text-blue-600">
                        How It Works
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">Hi, {user.name}</span>
                            {user.role === 'admin' ? (
                                <Link href="/admin/dashboard">
                                    <Button variant="outline" size="sm">Dashboard</Button>
                                </Link>
                            ) : (
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">Dashboard</Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/admin/login">
                                <Button variant="outline" size="sm">Admin</Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
