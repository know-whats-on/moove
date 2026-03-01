import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    target: '[data-tour="home-hero"]',
    path: '/',
    title: 'Welcome to Moove',
    body: 'Moo will help you keep boxes, addresses, and tasks tidy. Let’s do a quick tour.',
    placement: 'bottom'
  },
  {
    step: 2,
    target: '[data-tour="home-add-box"]',
    path: '/',
    title: 'Start with boxes',
    body: 'Add boxes as you pack. Moove will show Empty, Packing, and Packed automatically.',
    placement: 'top'
  },
  {
    step: 3,
    target: '[data-tour="nav-boxes"]', // Focusing the nav item is safer as it's always there
    path: '/boxes',
    title: 'Your boxes live here',
    body: 'Tap a box to add items. Seal it when it’s packed.',
    placement: 'top'
  },
  {
    step: 4,
    target: '[data-tour="ask-moove"]',
    path: '/boxes', // Stay on boxes or any page
    title: 'Ask Moo',
    body: 'Try ‘Where is my charger?’ or ‘List everything in Box Bedroom 1’.',
    placement: 'top-left'
  },
  {
    step: 5,
    target: '[data-tour="nav-address"]',
    path: '/address',
    title: 'Update addresses',
    body: 'Work through categories like Bank, Utilities, and Friends. Check off as you go.',
    placement: 'top'
  },
  {
    step: 6,
    target: '[data-tour="nav-checklist"]',
    path: '/checklist',
    title: 'Don’t miss move-out tasks',
    body: 'Notice, cleaning, condition report, bond, keys. Keep it simple.',
    placement: 'top'
  },
  {
    step: 7,
    target: '[data-tour="nav-settings"]',
    path: '/settings',
    title: 'Replay anytime',
    body: 'Tap ‘How to Moove’ whenever you want a refresher.',
    placement: 'top'
  }
];

export function Onboarding() {
  const { onboardingStep, setOnboardingStep, skipOnboarding, setHasSeenOnboarding } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<DOMRect | null>(null);
  
  // Current step config
  const currentStepConfig = STEPS.find(s => s.step === onboardingStep);

  // Navigate if needed
  useEffect(() => {
    if (onboardingStep > 0 && currentStepConfig) {
      if (location.pathname !== currentStepConfig.path) {
         navigate(currentStepConfig.path);
      }
    }
  }, [onboardingStep, currentStepConfig, location.pathname, navigate]);

  // Find target element
  useEffect(() => {
    if (!currentStepConfig) return;

    const findTarget = () => {
      const el = document.querySelector(currentStepConfig.target);
      if (el) {
        const r = el.getBoundingClientRect();
        // Check if visible
        if (r.width > 0 && r.height > 0) {
            setRect(r);
        }
      } else {
        // Retry a few times if not found immediately (e.g. during transition)
        // For now, just retry on next frame
        requestAnimationFrame(findTarget);
      }
    };

    // Small delay to allow page transition
    const timer = setTimeout(findTarget, 300);
    window.addEventListener('resize', findTarget);
    
    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', findTarget);
    };
  }, [currentStepConfig, location.pathname]);

  const handleNext = () => {
    if (onboardingStep < STEPS.length) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Finish
      skipOnboarding();
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };
  
  const handleSkip = () => {
      skipOnboarding();
  };

  if (onboardingStep === 0 || !currentStepConfig) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark Overlay with Cutout using mix-blend-mode or SVG mask */}
      {/* Simplified approach: 4 dark divs around the highlight */}
      {rect && (
        <>
            {/* Top */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute top-0 left-0 right-0 bg-black/70 pointer-events-auto transition-all duration-300 ease-out"
                style={{ height: rect.top }}
            />
            {/* Bottom */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 bg-black/70 pointer-events-auto transition-all duration-300 ease-out"
                style={{ top: rect.bottom }}
            />
            {/* Left */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute left-0 bg-black/70 pointer-events-auto transition-all duration-300 ease-out"
                style={{ top: rect.top, bottom: window.innerHeight - rect.bottom, width: rect.left }}
            />
            {/* Right */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute right-0 bg-black/70 pointer-events-auto transition-all duration-300 ease-out"
                style={{ top: rect.top, bottom: window.innerHeight - rect.bottom, left: rect.right }}
            />
            
            {/* Spotlight Border */}
            <div 
                className="absolute border-2 border-amber-500 rounded transition-all duration-300 ease-out pointer-events-none"
                style={{
                    top: rect.top - 4,
                    left: rect.left - 4,
                    width: rect.width + 8,
                    height: rect.height + 8,
                }}
            />
        </>
      )}
      
      {!rect && (
          // Full screen cover while searching for element
          <div className="absolute inset-0 bg-black/70 pointer-events-auto" />
      )}

      {/* Tooltip */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
         {/* Position relative to rect if possible, otherwise center or bottom sheet */}
         {/* For simplicity on mobile, let's use a fixed position card that moves slightly or just fixed bottom/center depending on placement */}
         {/* Given the targets move around, a fixed bottom card is often safest for mobile, but let's try to position it near the target if space allows */}
         
         <div 
            className={clsx(
                "pointer-events-auto absolute w-[calc(100%-2rem)] max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 transition-all duration-300",
                // Simple positioning logic
                currentStepConfig.placement === 'top' ? "bottom-24" : 
                currentStepConfig.placement === 'bottom' ? "top-24" : "bottom-24"
            )}
            style={{
                // If we wanted exact positioning relative to rect we'd calculate here.
                // But simplified fixed zones works well for mobile.
            }}
         >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{currentStepConfig.title}</h3>
                    <p className="text-sm text-zinc-400">{currentStepConfig.body}</p>
                </div>
                <button onClick={handleSkip} className="text-zinc-500 hover:text-white p-1">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-zinc-500 font-medium">
                    {onboardingStep} of {STEPS.length}
                </span>
                <div className="flex gap-2">
                    {onboardingStep > 1 && (
                        <button 
                            onClick={handleBack}
                            className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700"
                        >
                            Back
                        </button>
                    )}
                    <button 
                        onClick={handleNext}
                        className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-bold hover:bg-amber-500 flex items-center gap-1"
                    >
                        {onboardingStep === STEPS.length ? 'Finish' : 'Next'}
                        {onboardingStep !== STEPS.length && <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}