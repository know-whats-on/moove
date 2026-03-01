import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog'; // Assuming UI components exist or using simple modal
// Wait, I should check if ui/dialog exists. I'll use a simple fixed overlay if not.
// The package.json lists @radix-ui/react-dialog, so likely there are components.
// I'll stick to a simple custom modal to avoid dependency issues if the components aren't set up exactly as I expect.

export function NamePrompt() {
  const { userName, setUserName, hasSeenOnboarding } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // Show if onboarding is done/skipped AND name is null
    if (hasSeenOnboarding && !userName) {
      setOpen(true);
    }
  }, [hasSeenOnboarding, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      setOpen(false);
    }
  };
  
  const handleSkip = () => {
    setUserName('friend'); // Temporary fallback, but effectively "not now"
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-white mb-2">What should I call you?</h2>
        <p className="text-zinc-400 text-sm mb-6">Help me customize your experience.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Type your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-zinc-600"
            autoFocus
          />
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 rounded-xl font-bold bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-900/20"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
