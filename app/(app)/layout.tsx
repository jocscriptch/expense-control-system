import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="bg-background-light text-slate-900 overflow-hidden h-screen flex transition-colors duration-200">
 <Sidebar />
 <main className="flex-1 flex flex-col h-full overflow-hidden relative">
 <Header />
 <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
 <div className="max-w-7xl mx-auto">
 {children}
 </div>
 </div>
 </main>
 </div>
 );
}
