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
    <div className="protected-layout min-h-dvh bg-[#fff8fa]">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      <div className="flex min-w-0 items-start">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
        <main className="min-h-[calc(100dvh-73px)] min-w-0 flex-1 pb-6 [overflow-wrap:anywhere]">
          {children}
        </main>
      </div>
    </div>
  );
}
