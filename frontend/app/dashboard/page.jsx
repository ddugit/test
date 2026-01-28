"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, History, ChevronRight, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function UserDashboard() {
    const [diseaseQuery, setDiseaseQuery] = useState("")
    const [symptomQuery, setSymptomQuery] = useState("")
    const [result, setResult] = useState(null)
    const [history, setHistory] = useState([])
    const [error, setError] = useState("")

    const isMounted = useRef(false)

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("sympto-care-history")
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (isMounted.current) {
            localStorage.setItem("sympto-care-history", JSON.stringify(history))
        } else {
            isMounted.current = true
        }
    }, [history])

    const { logout, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // router.push("/login")  // Temporarily disabled for testing
        }
    }, [loading, isAuthenticated, router])

    const handleSearch = async () => {
        setError("")
        setResult(null)

        if (!diseaseQuery.trim() && !symptomQuery.trim()) return

        try {
            const requestBody = {
                disease: diseaseQuery.trim() || null,
                symptoms: symptomQuery.trim() ? symptomQuery.split(/[,|\n]/).map(s => s.trim()).filter(s => s) : null
            }

            console.log('Sending request:', requestBody)

            const data = await apiFetch('/ai/query', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            })

            console.log('Received data:', data)

            // Normalize response so UI always reads `result.ai`
            // - Backend returns: { historyId, createdAt, ai }
            // - Direct model call may return: [...] or { warning, results } or { error }
            const normalized =
                data && typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "ai")
                    ? data
                    : { ai: data }

            setResult(normalized)
            // For history, use the disease name if available
            const historyItem = diseaseQuery.trim() || symptomQuery.trim()
            if (!history.includes(historyItem)) {
                setHistory(prev => [historyItem, ...prev].slice(0, 5))
            }
        } catch (err) {
            console.error('Error:', err)
            setError(err.message)
        }
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem("sympto-care-history")
    }

    return (
        <div className="container py-12 flex flex-col items-center gap-10 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-3xl text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-primary">Check Your Symptoms</h1>
                <p className="text-lg text-muted-foreground">Enter a disease name or symptom to find solutions.</p>

                <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto w-full">
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Disease Name (e.g. Fever)"
                            className="pl-4 h-14 text-lg shadow-sm w-full"
                            value={diseaseQuery}
                            onChange={(e) => setDiseaseQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            placeholder="Symptoms (one per line or comma separated, e.g. headache, nausea)"
                            className="pl-4 pt-4 h-14 text-lg shadow-sm w-full border border-input rounded-md resize-none"
                            value={symptomQuery}
                            onChange={(e) => setSymptomQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                            rows={1}
                        />
                    </div>
                    <Button size="lg" onClick={handleSearch} className="px-10 h-14 bg-primary hover:bg-primary/90 text-lg shadow-md">
                        <Search className="w-6 h-6" />
                    </Button>
                </div>
                {error && <p className="text-destructive font-medium mt-4 animate-in fade-in slide-in-from-top-2">{error}</p>}
            </div>

            <div className="grid w-full max-w-6xl gap-10 md:grid-cols-[1fr_350px]">
                {/* Main Result Area */}
                <div className="space-y-8">
                    {result ? (
                        <div className="space-y-6">
                            <Card className="border-t-4 border-t-primary shadow-xl animate-in fade-in slide-in-from-bottom-6">
                                <CardHeader>
                                    <CardDescription className="text-base mt-2">
                                        Based on: {diseaseQuery && `Disease: ${diseaseQuery}`} {symptomQuery && `Symptoms: ${symptomQuery}`}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {result.ai.error && (
                                <p className="text-destructive font-medium mt-4 animate-in fade-in slide-in-from-top-2">
                                    {result.ai.error}{result.ai.details ? `: ${result.ai.details}` : ""}
                                </p>
                            )}
                            {result.ai.warning && <p className="text-yellow-600 font-medium mt-4 animate-in fade-in slide-in-from-top-2">{result.ai.warning}</p>}
                            {result.ai.answer ? (
                                <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-6">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-green-800 flex items-center justify-between">
                                            AI Recommendation
                                            <span className="text-sm font-normal text-muted-foreground">Fallback Response</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="text-sm text-slate-700">{result.ai.answer}</p>
                                    </CardContent>
                                </Card>
                            ) : Array.isArray(result.ai) ? result.ai.map((rec, index) => (
                                <Card key={index} className="shadow-lg animate-in fade-in slide-in-from-bottom-6">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-green-800 flex items-center justify-between">
                                            {rec.disease}
                                            <span className="text-sm font-normal text-muted-foreground">Confidence: {rec['confidence (%)']}%</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                                                    <CheckCircle className="w-5 h-5" /> Herbs
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.herbs}</p>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
                                                    <Info className="w-5 h-5" /> Precautions
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.precautions}</p>
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-yellow-700 mb-3">
                                                    <AlertTriangle className="w-5 h-5" /> Prevention
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.prevention}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-purple-700 mb-3">
                                                    <CheckCircle className="w-5 h-5" /> Preparation
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.preparation}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : result.ai.results ? result.ai.results.map((rec, index) => (
                                <Card key={index} className="shadow-lg animate-in fade-in slide-in-from-bottom-6">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-green-800 flex items-center justify-between">
                                            {rec.disease}
                                            <span className="text-sm font-normal text-muted-foreground">Confidence: {rec['confidence (%)']}%</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                                                    <CheckCircle className="w-5 h-5" /> Herbs
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.herbs}</p>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-blue-700 mb-3">
                                                    <Info className="w-5 h-5" /> Precautions
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.precautions}</p>
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-yellow-700 mb-3">
                                                    <AlertTriangle className="w-5 h-5" /> Prevention
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.prevention}</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                <h3 className="flex items-center gap-2 font-semibold text-purple-700 mb-3">
                                                    <CheckCircle className="w-5 h-5" /> Preparation
                                                </h3>
                                                <p className="text-sm text-slate-700">{rec.preparation}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : null}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg h-64 bg-slate-50/50">
                            <Search className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-muted-foreground">Search results will appear here</p>
                        </div>
                    )}
                </div>

                {/* Sidebar History */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between gap-2 w-full">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4" /> Recent Searches
                                </div>
                                {history.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearHistory} className="h-6 text-xs text-muted-foreground hover:text-destructive">
                                        Clear
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {history.length > 0 ? (
                                <ul className="space-y-2">
                                    {history.map((item, i) => (
                                        <li key={i} className="flex items-center justify-between text-sm p-2 hover:bg-slate-100 rounded-md cursor-pointer" onClick={() => { setDiseaseQuery(item); setSymptomQuery(""); handleSearch() }}>
                                            <span>{item}</span>
                                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent history</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
