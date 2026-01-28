"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Search, Users } from "lucide-react"

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">System Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into search trends and user behavior.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <div className="mt-4 h-[60px] flex items-end gap-1">
                            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Search Conversion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87.4%</div>
                        <p className="text-xs text-muted-foreground mt-1">Users finding relevant cures</p>
                        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[87%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Symptoms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {['Fever (45%)', 'Cough (22%)', 'Headache (18%)'].map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <span>{s.split(' ')[0]}</span>
                                    <span className="font-bold">{s.split(' ')[1]}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Popular Search Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[
                            { name: "Common Cold", count: 450, trend: "+12%" },
                            { name: "Migraine", count: 320, trend: "+5%" },
                            { name: "Dengue Fever", count: 210, trend: "-2%" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span>{item.name}</span>
                                        <span>{item.count} searches</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${(item.count / 500) * 100}%` }} />
                                    </div>
                                </div>
                                <div className={`text-xs font-bold ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.trend}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
