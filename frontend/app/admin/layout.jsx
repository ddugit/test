import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            <AdminSidebar />
            <div className="flex-1 bg-slate-50/50 p-8 overflow-auto">
                {children}
            </div>
        </div>
    )
}
