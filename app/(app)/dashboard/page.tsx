"use client";

import { logout } from "@/features/auth/actions";
import Button from "@/components/ui/button";

export default function DashboardPage() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center">
      {/* Signout Button in top right */}
      <div className="absolute top-6 right-6">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cerrar sesión
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-black">Dashboard</h1>
    </div>
  );
}
