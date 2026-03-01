import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { PageLayout } from '../components/PageLayout';
import { HeroBanner } from '../components/HeroBanner';
const HomeCow = '/banners/HomeCow.png';
import { Link, useNavigate } from 'react-router';
import clsx from 'clsx';
import { Drawer } from 'vaul';
import { 
  Package, 
  MapPin, 
  CheckSquare, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const { 
    boxes, 
    items, 
    addressChanges, 
    checklistTasks, 
    userName, 
    moveDate,
    distanceText,
    moveMode
  } = useStore();

  const navigate = useNavigate();

  // --- 1. Readiness Calculation ---
  const readiness = useMemo(() => {
    // Boxes (50%)
    const totalBoxes = boxes.length;
    // For Move Out: Packed (sealed) count
    // For Move In: Unpacked count (inferred from "Move Out mode" instruction implying context switching)
    // Sticking to prompt: "Packed boxes = boxes with status Packed (sealed=true)"
    const packedBoxes = boxes.filter(b => b.sealed).length; 
    
    const boxScore = totalBoxes > 0 ? (packedBoxes / totalBoxes) : 0;
    
    // Address (25%)
    const totalAddress = addressChanges.length;
    const doneAddress = addressChanges.filter(a => a.status === 'Done').length;
    const addressScore = totalAddress > 0 ? (doneAddress / totalAddress) : 0;
    
    // Checklist (25%)
    const totalChecklist = checklistTasks.length;
    const doneChecklist = checklistTasks.filter(c => c.status === 'Done').length;
    const checklistScore = totalChecklist > 0 ? (doneChecklist / totalChecklist) : 0;

    // Weighted Average
    // If any total is 0, score is 0 for that part, but overall calculation remains weighted
    const totalScore = (boxScore * 0.5) + (addressScore * 0.25) + (checklistScore * 0.25);
    
    return {
      total: Math.round(totalScore * 100),
      boxScore,
      addressScore,
      checklistScore,
      details: {
        boxes: { total: totalBoxes, done: packedBoxes },
        address: { total: totalAddress, done: doneAddress },
        checklist: { total: totalChecklist, done: doneChecklist }
      }
    };
  }, [boxes, addressChanges, checklistTasks]);

  // --- 2. Suggestions Logic (Today's 3 Moves) ---
  const suggestions = useMemo(() => {
    const list: { 
      id: string; 
      type: 'box' | 'address' | 'checklist'; 
      title: string; 
      subtitle: string; 
      action: () => void; 
      icon: any;
      color: string;
    }[] = [];

    // Helper to add suggestion
    const add = (item: any) => list.push(item);

    // Priority 1: Boxes
    const emptyBoxes = boxes.filter(b => !b.sealed && items.filter(i => i.boxId === b.id).length === 0);
    const packingBoxes = boxes.filter(b => !b.sealed && items.filter(i => i.boxId === b.id).length > 0);

    if (boxes.length === 0) {
      add({
        id: 'add-box',
        type: 'box',
        title: 'Add your first box',
        subtitle: 'Start tracking your items',
        action: () => navigate('/boxes'), // Ideally open create modal, but navigation works
        icon: Package,
        color: 'text-amber-500'
      });
    } else if (emptyBoxes.length > 0) {
      const box = emptyBoxes[0];
      add({
        id: `fill-box-${box.id}`,
        type: 'box',
        title: `Add 3 items to ${box.label}`,
        subtitle: 'Start filling this empty box',
        action: () => navigate('/boxes'), // Deep link logic would go here
        icon: Package,
        color: 'text-amber-500'
      });
    } else if (packingBoxes.length > 0) {
      // Find most packed box? Or just first. "Seal {mostPackedBoxLabel}"
      // Using first for simplicity
      const box = packingBoxes[0];
      add({
        id: `seal-box-${box.id}`,
        type: 'box',
        title: `Seal ${box.label}`,
        subtitle: 'Finish packing this box',
        action: () => navigate('/boxes'),
        icon: Package,
        color: 'text-amber-500'
      });
    }

    // Priority 2: Address
    const todoAddresses = addressChanges.filter(a => a.status === 'To do');
    if (todoAddresses.length > 0) {
      const addr = todoAddresses[0];
      add({
        id: `addr-${addr.id}`,
        type: 'address',
        title: `Update ${addr.category}`,
        subtitle: `Change address for ${addr.place}`,
        action: () => navigate('/address'),
        icon: MapPin,
        color: 'text-green-500'
      });
    }

    // Priority 3: Checklist
    const todoChecklist = checklistTasks.filter(c => c.status === 'To do');
    if (todoChecklist.length > 0) {
      const task = todoChecklist[0];
      add({
        id: `task-${task.id}`,
        type: 'checklist',
        title: `Tick off: ${task.title}`,
        subtitle: 'Keep moving forward',
        action: () => navigate('/checklist'),
        icon: CheckSquare,
        color: 'text-blue-500'
      });
    }

    // Fill remaining slots
    // If we have < 3, add more from available pools
    while (list.length < 3) {
      // Try to add another address
      const usedAddrIds = list.filter(l => l.type === 'address').map(l => l.id.replace('addr-', ''));
      const nextAddr = todoAddresses.find(a => !usedAddrIds.includes(a.id));
      
      if (nextAddr) {
        add({
          id: `addr-${nextAddr.id}`,
          type: 'address',
          title: `Update ${nextAddr.category}`,
          subtitle: `Change address for ${nextAddr.place}`,
          action: () => navigate('/address'),
          icon: MapPin,
          color: 'text-green-500'
        });
        continue;
      }

      // Try to add another checklist
      const usedTaskIds = list.filter(l => l.type === 'checklist').map(l => l.id.replace('task-', ''));
      const nextTask = todoChecklist.find(t => !usedTaskIds.includes(t.id));

      if (nextTask) {
        add({
          id: `task-${nextTask.id}`,
          type: 'checklist',
          title: `Tick off: ${nextTask.title}`,
          subtitle: 'One more thing to do',
          action: () => navigate('/checklist'),
          icon: CheckSquare,
          color: 'text-blue-500'
        });
        continue;
      }
      
      // Try to add another box task (generic if needed, or specific if multiple boxes)
      // Since we aggregated box logic above, we might just add a generic "Organize boxes" if we really need to fill 3
      // Or just stop if we truly have nothing else.
      // But prompt says "Always display exactly 3 suggestions (unless 100% ready)"
      
      if (readiness.total === 100) break; // Don't force if ready

      // Fallback filler
      add({
        id: `filler-${list.length}`,
        type: 'box',
        title: 'Review your inventory',
        subtitle: 'Check if you missed anything',
        action: () => navigate('/boxes'),
        icon: Package,
        color: 'text-zinc-500'
      });
      break; // Prevent infinite loop if logic fails
    }

    return list.slice(0, 3);
  }, [boxes, items, addressChanges, checklistTasks, navigate, readiness.total]);


  // --- 3. Days Left & Milestones ---
  const { daysLeft, milestones } = useMemo(() => {
    if (!moveDate) return { daysLeft: null, milestones: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(moveDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Milestones status logic
    // T-30: Expect >= 25%
    // T-14: Expect >= 55%
    // T-3: Expect >= 80%
    
    const getStatus = (thresholdDays: number, requiredReadiness: number) => {
      // If we are past this milestone (days < threshold), did we meet it? 
      // Actually prompt says: "If days_until > 30: no warning chips".
      // "30-15 days: expect readiness >= 25%"
      
      let isOverdue = false;
      let isDueSoon = false;

      if (days > 30) {
        // Far out
        return 'upcoming'; 
      }
      
      // Determine current window expectations
      if (days <= thresholdDays) {
         // We are IN or PAST the window for this milestone
         // e.g. T-30 milestone. If we are at 29 days, we should have hit it.
         if (readiness.total >= requiredReadiness) return 'completed';
         return 'attention';
      }
      
      return 'upcoming';
    };

    const ms = [
      { 
        label: 'Pack non-essentials', 
        days: 30, 
        target: 25,
        status: getStatus(30, 25) 
      },
      { 
        label: 'Addresses + utilities', 
        days: 14, 
        target: 55,
        status: getStatus(14, 55)
      },
      { 
        label: 'Cleaning + keys', 
        days: 3, 
        target: 80,
        status: getStatus(3, 80)
      }
    ];

    return { daysLeft: days, milestones: ms };
  }, [moveDate, readiness.total]);


  return (
    <PageLayout
      header={({ compact }) => (
        <HeroBanner 
          data-tour="home-hero"
          title="Let’s Moove,"
          secondaryTitle={userName || 'friend'}
          imageSrc={HomeCow}
          imageAlt="Moove Mascot"
          compact={compact}
        />
      )}
    >
      <div className="p-4 space-y-8 pb-32 max-w-lg mx-auto w-full">
        
        {/* 1. Readiness Ring */}
        <section>
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button 
                data-tour="home-add-box"
                className="w-full group relative flex flex-col items-center justify-center py-6 focus:outline-none"
              >
                {/* Ring SVG */}
                <div className="relative w-48 h-48">
                   {/* Background Circle */}
                   <svg className="w-full h-full transform -rotate-90">
                     <circle
                       cx="96"
                       cy="96"
                       r="88"
                       stroke="currentColor"
                       strokeWidth="12"
                       fill="transparent"
                       className="text-zinc-800"
                     />
                     {/* Progress Circle */}
                     <circle
                       cx="96"
                       cy="96"
                       r="88"
                       stroke="currentColor"
                       strokeWidth="12"
                       fill="transparent"
                       strokeDasharray={2 * Math.PI * 88}
                       strokeDashoffset={2 * Math.PI * 88 * (1 - readiness.total / 100)}
                       strokeLinecap="round"
                       className={clsx(
                         "transition-all duration-1000 ease-out",
                         readiness.total === 100 ? "text-green-500" : "text-amber-500"
                       )}
                     />
                   </svg>
                   
                   {/* Center Text */}
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                        {readiness.total}%
                      </span>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        Ready
                      </span>
                   </div>
                </div>

                {/* Microcopy */}
                <div className="mt-6 text-center space-y-1">
                   <p className="text-white font-medium text-lg">
                     {readiness.details.boxes.total === 0 
                        ? "Add your first box to start tracking."
                        : readiness.total < 30
                        ? "Start small. One box at a time."
                        : readiness.total < 70
                        ? "Nice pace. Keep sealing boxes."
                        : "You’re nearly ready to Moove!"
                     }
                   </p>
                   <p className="text-zinc-500 text-xs flex items-center justify-center gap-1 group-hover:text-amber-500 transition-colors">
                     Tap to see what’s holding you back <ChevronRight className="w-3 h-3" />
                   </p>
                </div>
              </button>
            </Drawer.Trigger>
            
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/80 z-50" />
              <Drawer.Content className="bg-zinc-900 flex flex-col rounded-t-[10px] h-[60%] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 focus:outline-none">
                <div className="p-4 bg-zinc-900 rounded-t-[10px] flex-1">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-8" />
                  
                  <div className="max-w-md mx-auto">
                    <Drawer.Title className="font-medium mb-4 text-white text-lg">
                      What’s holding you back?
                    </Drawer.Title>
                    <Drawer.Description className="sr-only">
                      Details about your moving readiness score and incomplete tasks.
                    </Drawer.Description>
                    
                    <div className="space-y-3">
                      {/* Box Blocker */}
                      {(readiness.details.boxes.total === 0 || readiness.details.boxes.done < readiness.details.boxes.total) && (
                        <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                 <Package className="w-5 h-5" />
                              </div>
                              <div>
                                 <div className="font-medium text-white">
                                   {readiness.details.boxes.total === 0 
                                      ? "No boxes added yet" 
                                      : `${readiness.details.boxes.total - readiness.details.boxes.done} boxes to seal`}
                                 </div>
                                 <div className="text-xs text-zinc-500">
                                   {readiness.details.boxes.done} of {readiness.details.boxes.total} packed
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => navigate('/boxes')}
                             className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                           >
                             Open
                           </button>
                        </div>
                      )}

                      {/* Address Blocker */}
                      {(readiness.details.address.total === 0 || readiness.details.address.done < readiness.details.address.total) && (
                        <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                 <MapPin className="w-5 h-5" />
                              </div>
                              <div>
                                 <div className="font-medium text-white">
                                   {readiness.details.address.total === 0 
                                      ? "No address changes added" 
                                      : `${readiness.details.address.total - readiness.details.address.done} changes left`}
                                 </div>
                                 <div className="text-xs text-zinc-500">
                                   {readiness.details.address.done} of {readiness.details.address.total} done
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => navigate('/address')}
                             className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                           >
                             Open
                           </button>
                        </div>
                      )}

                      {/* Checklist Blocker */}
                      {(readiness.details.checklist.total === 0 || readiness.details.checklist.done < readiness.details.checklist.total) && (
                        <div className="bg-zinc-800/50 p-4 rounded-xl flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                 <CheckSquare className="w-5 h-5" />
                              </div>
                              <div>
                                 <div className="font-medium text-white">
                                   {readiness.details.checklist.total === 0 
                                      ? "No tasks added yet" 
                                      : `${readiness.details.checklist.total - readiness.details.checklist.done} tasks left`}
                                 </div>
                                 <div className="text-xs text-zinc-500">
                                   {readiness.details.checklist.done} of {readiness.details.checklist.total} done
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => navigate('/checklist')}
                             className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                           >
                             Open
                           </button>
                        </div>
                      )}

                      {readiness.total === 100 && (
                        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl text-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-bold text-white mb-1">You're all set!</h3>
                            <p className="text-sm text-zinc-400">Nothing holding you back right now.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </section>

        {/* 2. Today's 3 Moves */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Today’s 3 Moves</h2>
            {readiness.total === 100 && <span className="text-xs text-amber-500 font-bold">You're ready! 🎉</span>}
          </div>
          
          <div className="space-y-3">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group text-left"
              >
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-zinc-800", item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
                  <p className="text-zinc-500 text-xs truncate">{item.subtitle}</p>
                </div>
                <div className="bg-zinc-800 text-zinc-300 group-hover:bg-amber-500 group-hover:text-white p-2 rounded-full transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
            
            {suggestions.length === 0 && (
               <div className="text-center py-8 text-zinc-500 text-sm bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  No suggestions right now. You're doing great!
               </div>
            )}
          </div>
        </section>

        {/* 3. Days Until Moove + Milestones */}
        <section>
           <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Timeline</h2>
           <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              
              {/* Countdown Header */}
              <div className="p-6 border-b border-zinc-800 text-center relative">
                 <div className="absolute top-4 right-4 text-zinc-700 opacity-20 pointer-events-none">
                    
                 </div>
                 
                 {moveDate ? (
                   <>
                     <div className="text-4xl font-bold text-white tabular-nums tracking-tighter">
                       {daysLeft}
                     </div>
                     <div className="text-zinc-400 text-xs font-medium uppercase tracking-wide mt-1">
                       Days until Moove
                     </div>
                   </>
                 ) : (
                   <div className="py-2">
                     <p className="text-zinc-400 text-sm mb-2">When are you mooving?</p>
                     <Link to="/settings" className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg inline-block font-bold transition-colors">
                       Set Date
                     </Link>
                   </div>
                 )}
              </div>

              {/* Milestones List */}
              {moveDate && (
                <div className="divide-y divide-zinc-800/50">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 px-5">
                       <div className="flex items-center gap-3">
                          <div className={clsx(
                             "w-1.5 h-1.5 rounded-full",
                             m.status === 'completed' ? "bg-green-500" :
                             m.status === 'attention' ? "bg-red-500" :
                             "bg-zinc-700"
                          )} />
                          <span className={clsx(
                             "text-sm font-medium",
                             m.status === 'completed' ? "text-zinc-400 line-through" : "text-zinc-200"
                          )}>
                             {m.label}
                          </span>
                       </div>
                       
                       {/* Status Chip */}
                       {m.status === 'attention' && (
                          <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20">
                             Falls behind
                          </span>
                       )}
                       {m.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500/50" />
                       )}
                       {m.status === 'upcoming' && (
                          <span className="text-[10px] text-zinc-600 font-medium">T-{m.days}</span>
                       )}
                    </div>
                  ))}
                </div>
              )}
           </div>
        </section>

        {/* 4. Distance Card */}
        <section>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between group hover:border-zinc-700 transition-colors">
             <div>
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Distance</h3>
                {distanceText ? (
                  <div>
                    <div className="text-white font-bold text-lg">
                      {distanceText.split(' (')[0]}
                    </div>
                    {distanceText.includes('(') && (
                      <div className="text-xs text-zinc-500">
                        ({distanceText.split('(')[1]}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm">
                    Set addresses to calculate distance
                  </p>
                )}
             </div>
             
             <Link 
               to="/settings"
               className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-all shrink-0"
             >
                {distanceText ? <Truck className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
             </Link>
          </div>
          {distanceText && (
             <p className="text-[10px] text-zinc-600 text-center mt-2">
               Distance is approximate.
             </p>
          )}
        </section>

      </div>
    </PageLayout>
  );
}
