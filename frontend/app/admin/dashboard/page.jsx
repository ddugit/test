"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, TrendingUp } from "lucide-react"

import { useRouter } from "next/navigation"

export default function AdminDashboard() {
    const router = useRouter()

    const handleExport = () => {
        const data = "Date,Search Query,Count\n2026-01-25,Flu,150\n2026-01-25,Migraine,80"
        const blob = new Blob([data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('hidden', '')
        a.setAttribute('href', url)
        a.setAttribute('download', 'health_analytics_report.csv')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Diseases Database</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">Active entries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">99.9%</div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">New feedback</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['Flu', 'Migraine', 'Diabetes', 'Dengue', 'Covid-19'].map((s, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <span className="text-sm font-medium">{s}</span>
                                    <span className="text-xs text-muted-foreground">Just now</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <div
                            onClick={() => router.push("/admin/diseases")}
                            className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            + Add New Disease Entry
                        </div>
                        <div
                            onClick={() => alert("User Management feature coming soon!")}
                            className="p-3 bg-slate-50 text-slate-700 rounded-md text-sm font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                            Manage User Access
                        </div>
                        <div
                            onClick={handleExport}
                            className="p-3 bg-green-50 text-green-700 rounded-md text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            Export Data Logs (CSV)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
