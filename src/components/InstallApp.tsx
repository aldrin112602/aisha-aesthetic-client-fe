import { useEffect, useState } from 'react';
interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
export default function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const ready = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const installed = () => setPrompt(null);
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', installed);
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', installed); };
  }, []);
  if (!prompt || dismissed) return null;
  return <aside className="fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-xl border border-pink-100 bg-white p-3 shadow-lg" aria-label="Install application">
    <button className="primary-btn" onClick={async () => {
      try { await prompt.prompt(); await prompt.userChoice; } finally { setPrompt(null); }
    }}>Install AishaEsthetics</button>
    <button className="text-sm text-gray-600" onClick={() => setDismissed(true)}>Later</button>
  </aside>;
}
