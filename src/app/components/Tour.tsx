import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useStore } from '../store';
import { useNavigate, useLocation } from 'react-router';
import { useTheme } from 'next-themes';

const Tour = () => {
  const { 
    hasSeenOnboarding, 
    setHasSeenOnboarding, 
    onboardingStep, 
    setOnboardingStep,
    userName,
    setUserName,
    skipOnboarding,
    startOnboarding
  } = useStore();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const [run, setRun] = useState(false);
  
  const steps: Step[] = [
    {
      target: '[data-tour="home-hero"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Welcome to Moove</h3>
          <p className="text-sm">Moo will help you keep boxes, addresses, and tasks tidy. Let’s do a quick tour.</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="home-add-box"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Track your progress</h3>
          <p className="text-sm">This ring shows how ready you are. Tap it to see what’s holding you back.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nav-boxes"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Your boxes live here</h3>
          <p className="text-sm">Tap a box to add items. Seal it when it’s packed.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="ask-moove"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Ask Moo</h3>
          <p className="text-sm">Try ‘Where is my charger?’ or ‘List everything in Box Bedroom 1’.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="nav-address"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Update addresses</h3>
          <p className="text-sm">Work through categories like Bank, Utilities, and Friends. Check off as you go.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="nav-checklist"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Don’t miss move-out tasks</h3>
          <p className="text-sm">Notice, cleaning, condition report, bond, keys. Keep it simple.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="nav-settings"]',
      content: (
        <div>
          <h3 className="font-bold text-lg mb-2">Replay anytime</h3>
          <p className="text-sm">Tap ‘How to Moove’ whenever you want a refresher.</p>
        </div>
      ),
      placement: 'top',
      styles: {
        buttonNext: {
          backgroundColor: '#16a34a',
        },
      },
    },
  ];

  useEffect(() => {
    // Auto-start if not seen
    if (!hasSeenOnboarding && onboardingStep === 0) {
        // Use a small timeout to ensure hydration
        const timer = setTimeout(() => {
             // Only start if we are on the home page or ensure we navigate there?
             // But for now, let's just start it.
             // Ideally we should be on Home.
             if (location.pathname === '/') {
                 startOnboarding();
             }
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding, onboardingStep, location.pathname, startOnboarding]);

  useEffect(() => {
    // Start tour logic
    if (!hasSeenOnboarding && onboardingStep === 1) {
        setRun(true);
    } else if (onboardingStep > 1) {
        setRun(true);
    } else {
        setRun(false);
    }
  }, [hasSeenOnboarding, onboardingStep]);

  const handleCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      setHasSeenOnboarding(true);
      setOnboardingStep(0);
      // Logic to trigger name prompt handled by parent/store or effect
      return;
    }

    if (type === 'step:after') {
        const nextIndex = index + 1;
        
        // Navigation logic based on steps
        // Step 0: Home Hero -> Next -> Home Add Box (Stay)
        // Step 1: Home Add Box -> Next -> Boxes Tab
        if (index === 1) {
            navigate('/boxes');
        }
        // Step 2: Boxes Tab -> Next -> Ask Moo (Stay or potentially on any page, but let's stay on Boxes)
        // Step 3: Ask Moo -> Next -> Address Tab
        if (index === 3) {
            navigate('/address');
        }
        // Step 4: Address Tab -> Next -> Checklist Tab
        if (index === 4) {
            navigate('/checklist');
        }
        // Step 5: Checklist Tab -> Next -> Settings Tab
        if (index === 5) {
            navigate('/settings');
        }
        
        setOnboardingStep(nextIndex + 1); // 1-based step for store consistency if needed
    }
  };
  
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      locale={{ last: 'Finish' }}
      callback={handleCallback}
      styles={{
        options: {
          arrowColor: '#18181b', // zinc-900
          backgroundColor: '#18181b', // zinc-900
          overlayColor: 'rgba(0, 0, 0, 0.8)',
          primaryColor: '#f59e0b', // amber-500
          textColor: '#fff',
          zIndex: 10000,
        },
        tooltip: {
            fontSize: '14px',
            borderRadius: '12px',
            padding: '16px',
        },
        buttonNext: {
            backgroundColor: '#f59e0b',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '8px 16px',
        },
        buttonBack: {
            color: '#a1a1aa', // zinc-400
            marginRight: 'auto',
        },
        buttonSkip: {
            color: '#a1a1aa',
        }
      }}
      floaterProps={{
        disableAnimation: true,
      }}
    />
  );
};

export default Tour;
