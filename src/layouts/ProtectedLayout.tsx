import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8fa]">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
        <main className="min-h-[calc(100vh-73px)] flex-1 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
