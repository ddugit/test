"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, BarChart3, Settings } from "lucide-react"

export function AdminSidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Diseases", href: "/admin/diseases", icon: FileText },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-50">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-lg font-bold">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
