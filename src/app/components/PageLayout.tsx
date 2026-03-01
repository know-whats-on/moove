import { useState, useRef, ReactNode, useEffect } from 'react';
import clsx from 'clsx';

interface PageLayoutProps {
  children: ReactNode;
  header: (props: { compact: boolean }) => ReactNode;
  className?: string; // for the main content area
}

export function PageLayout({ children, header, className }: PageLayoutProps) {
  const [isCompact, setIsCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;

    const onScroll = () => {
      // Use requestAnimationFrame to debounce and prevent event flooding
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (el) {
          const shouldBeCompact = el.scrollTop > 20;
          setIsCompact(prev => {
             // Only update if changed to prevent re-renders
             if (prev !== shouldBeCompact) return shouldBeCompact;
             return prev;
          });
        }
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      <header className="shrink-0 z-40 relative transition-all duration-300 border-b border-zinc-800 bg-zinc-900 shadow-md">
        {header({ compact: isCompact })}
      </header>
      <main 
        ref={scrollRef}
        className={clsx("flex-1 overflow-y-auto scroll-smooth pb-safe", className)}
      >
        {children}
      </main>
    </div>
  );
}
