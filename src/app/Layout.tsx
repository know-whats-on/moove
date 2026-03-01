import { Outlet, useLocation, useNavigate } from 'react-router';
import { useStore } from './store';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  CheckSquare, 
  Settings, 
  MessageCircleQuestion 
} from 'lucide-react';
import { Toaster } from 'sonner';
import { AskMoove } from './components/AskMoove';
import { useState, useEffect } from 'react';
import Tour from './components/Tour';
import { NamePrompt } from './components/NamePrompt';
import { PWAHead } from './components/PWAHead';

function Layout() {
  const darkMode = useStore((state) => state.darkMode);
  const location = useLocation();
  const navigate = useNavigate();
  const [askOpen, setAskOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard, tourId: 'nav-home' },
    { path: '/boxes', label: 'Boxes', icon: Package, tourId: 'nav-boxes' },
    { path: '/address', label: 'Address', icon: MapPin, tourId: 'nav-address' },
    { path: '/checklist', label: 'Checklist', icon: CheckSquare, tourId: 'nav-checklist' },
    { path: '/settings', label: 'Settings', icon: Settings, tourId: 'nav-settings' },
  ];

  const isBoxDetail = location.pathname.startsWith('/boxes/');

  return (
    <div className={twMerge("min-h-screen bg-zinc-950 text-zinc-100 font-sans", darkMode ? "dark" : "")}>
      <main className="w-full max-w-3xl mx-auto min-h-screen bg-zinc-950 shadow-2xl relative pb-24 transition-all duration-300">
        <Outlet />
        
        {/* Persistent Ask Moo Button */}
        {!isBoxDetail && (
           <button
             onClick={() => setAskOpen(true)}
             data-tour="ask-moove"
             className="fixed bottom-24 right-4 z-40 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-500 transition-colors flex items-center justify-center md:right-[calc(50%-24rem+1rem)]"
             aria-label="Ask Moo"
           >
             <MessageCircleQuestion className="w-6 h-6" />
           </button>
        )}

        {/* Bottom Navigation */}
        {!isBoxDetail && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
            <div className="w-full max-w-3xl mx-auto flex justify-around items-center h-16 px-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    data-tour={item.tourId}
                    onClick={() => {
                      navigate(item.path);
                      window.scrollTo(0, 0);
                    }}
                    className={clsx(
                      "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                      isActive ? "text-amber-500" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </main>
      
      <AskMoove open={askOpen} onOpenChange={setAskOpen} />
        <Toaster 
          position="top-center" 
          theme={darkMode ? 'dark' : 'light'}
          closeButton
          duration={2500}
          visibleToasts={3}
          toastOptions={{
            classNames: {
              closeButton: "!bg-zinc-800 !text-zinc-400 hover:!text-white !border-zinc-700 !top-2 !right-2 !w-9 !h-9 flex items-center justify-center !rounded-full transition-colors",
              toast: "!bg-zinc-900 !border-zinc-800 !text-zinc-100 !shadow-xl !rounded-xl !p-4 !gap-3 !items-start",
              title: "!font-bold !text-zinc-100 !text-sm",
              description: "!text-zinc-400 !text-xs",
              actionButton: "!bg-amber-600 !text-white !font-bold",
              cancelButton: "!bg-zinc-800 !text-zinc-400 !font-bold",
              error: "!bg-red-950/20 !border-red-900/30 !text-red-200",
              success: "!bg-green-950/20 !border-green-900/30 !text-green-200",
              warning: "!bg-amber-950/20 !border-amber-900/30 !text-amber-200",
              info: "!bg-blue-950/20 !border-blue-900/30 !text-blue-200",
            },
          }}
        />
      <Tour />
      <NamePrompt />
      <PWAHead />
    </div>
  );
}

export default Layout;
