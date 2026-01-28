"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Stethoscope, Activity, Search } from "lucide-react"

import { useAuth } from "@/context/AuthContext"

export default function LandingPage() {
    const { isAuthenticated } = useAuth()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center py-20 bg-gradient-to-b from-primary/5 to-background text-center md:py-32">
                <div className="container px-4 md:px-6">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-40"></div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-2">
                        Smart Health Assistance <br /> at Your Fingertips
                    </h1>
                    <p className="mt-6 max-w-[42rem] mx-auto leading-normal text-muted-foreground sm:text-l md:text-xl">
                        Enter a disease name to instantly get recommended solutions, precautions, and treatment guidance. Reliable. Fast. Secure.
                    </p>
                    <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                                    <Search className="w-5 h-5" /> Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-muted/30 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Key Features</h2>
                        <p className="mt-4 text-muted-foreground">Everything you need to stay informed and healthy.</p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                            <CardHeader className="flex flex-col items-center pb-2 w-full">
                                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                                    <Search className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">Instant Search</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Rapidly find detailed information about diseases, symptoms, and cures.
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                            <CardHeader className="flex flex-col items-center pb-2 w-full">
                                <div className="p-3 rounded-full bg-secondary/10 text-secondary mb-4">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">Precautions & Cures</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Get verified precautions and home remedies to manage your health better.
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center">
                            <CardHeader className="flex flex-col items-center pb-2 w-full">
                                <div className="p-3 rounded-full bg-accent text-accent-foreground mb-4">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">Health Analytics</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                Track search history and emerging health trends (Admin specific).
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Medical Disclaimer */}
            <section className="py-12 bg-card border-t">
                <div className="container px-4 md:px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-yellow-100 text-yellow-700">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Medical Disclaimer</h2>
                    <p className="max-w-[700px] mx-auto text-muted-foreground">
                        The content on this website is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>
                </div>
            </section>
        </div>
    )
}
