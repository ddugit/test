"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Shield, Bell, Save } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-primary">System Settings</h2>
                <p className="text-muted-foreground">Configure global parameters and security options.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            <CardTitle>General Configuration</CardTitle>
                        </div>
                        <CardDescription>Basic system identity and display options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">System Name</label>
                                <Input defaultValue="SymptoCare Admin" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Support Email</label>
                                <Input defaultValue="admin@symptocare.com" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-600" />
                            <CardTitle>Security & Access</CardTitle>
                        </div>
                        <CardDescription>Manage password policies and admin session timeouts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-muted-foreground">Recommended for all administrator accounts.</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button className="bg-primary hover:bg-primary/90 px-8">
                        <Save className="w-4 h-4 mr-2" /> Save All Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
