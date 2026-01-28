"use client"

import { useState } from "react"
import { initialDiseases } from "@/data/diseases"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, Search, X } from "lucide-react"

export default function DiseasesPage() {
    const [diseases, setDiseases] = useState(initialDiseases)
    const [filter, setFilter] = useState("")
    const [editingDisease, setEditingDisease] = useState(null)

    const filtered = diseases.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()))

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this disease?")) {
            setDiseases(diseases.filter(d => d.id !== id))
        }
    }

    const handleAdd = () => {
        setEditingDisease({
            id: Date.now(),
            name: "",
            description: "",
            symptoms: [],
            solutions: [],
            precautions: []
        })
    }

    const handleSave = (e) => {
        e.preventDefault()
        if (!editingDisease) return

        const exists = diseases.find(d => d.id === editingDisease.id)
        if (exists) {
            setDiseases(diseases.map(d => d.id === editingDisease.id ? editingDisease : d))
        } else {
            setDiseases([editingDisease, ...diseases])
        }
        setEditingDisease(null)
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Manage Diseases</h2>
                    <p className="text-muted-foreground">Add, edit, or remove disease entries.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Disease
                </Button>
            </div>

            <div className="flex items-center space-x-2 w-full max-sm">
                <Input
                    placeholder="Filter diseases..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white shadow-sm"
                />
                <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filtered.map((disease) => (
                                <tr key={disease.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{disease.name}</td>
                                    <td className="p-4 align-middle hidden md:table-cell text-muted-foreground truncate max-w-xs">{disease.description}</td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8 p-0" title="Edit" onClick={() => setEditingDisease(disease)}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 p-0"
                                                title="Delete"
                                                onClick={() => handleDelete(disease.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-muted-foreground">No diseases found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal (Simple Implementation) */}
            {editingDisease && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold">Edit Disease</h3>
                            <Button variant="ghost" size="icon" onClick={() => setEditingDisease(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Disease Name</label>
                                <Input
                                    value={editingDisease.name}
                                    onChange={(e) => setEditingDisease({ ...editingDisease, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={editingDisease.description}
                                    onChange={(e) => setEditingDisease({ ...editingDisease, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Symptoms (comma separated)</label>
                                <Input
                                    value={editingDisease.symptoms.join(", ")}
                                    onChange={(e) => setEditingDisease({ ...editingDisease, symptoms: e.target.value.split(",").map(s => s.trim()) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Solutions (comma separated)</label>
                                <Input
                                    value={editingDisease.solutions.join(", ")}
                                    onChange={(e) => setEditingDisease({ ...editingDisease, solutions: e.target.value.split(",").map(s => s.trim()) })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setEditingDisease(null)}>Cancel</Button>
                                <Button type="submit" className="bg-primary hover:bg-primary/90">Save Changes</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
