import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fff8fa]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-h-[calc(100vh-73px)] flex-1 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}