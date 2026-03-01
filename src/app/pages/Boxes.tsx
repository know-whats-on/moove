import { useState, useEffect, useMemo } from 'react';
import { useStore, Box, BoxSize, MoveMode } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, AlertCircle, Trash2, Lock, Unlock, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Drawer } from 'vaul';
import { clsx } from 'clsx';
import { HeroBanner } from '../components/HeroBanner';
import { PageLayout } from '../components/PageLayout';
import { EmptyBoxIcon, PackingBoxIcon, PackedBoxIcon, UnpackingBoxIcon, UnpackedBoxIcon } from '../components/BoxIcons';
import BoxCow from 'figma:asset/d3900a63192abe7cf8ec22b8863804cbacd50a0e.png';

export default function Boxes() {
  const { boxes, items, addBox, removeBox, updateBox, moveMode, setMoveMode } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // New Box Form State
  const [newBoxLabel, setNewBoxLabel] = useState('');
  const [newBoxRoom, setNewBoxRoom] = useState('');
  const [newBoxSize, setNewBoxSize] = useState<BoxSize>('M');

  const navigate = useNavigate();

  // Unified Search & Ranking Logic
  const { filteredBoxes, matchedItemsMap } = useMemo(() => {
      if (!debouncedSearchTerm.trim()) {
          return { filteredBoxes: boxes, matchedItemsMap: {} };
      }

      const term = debouncedSearchTerm.toLowerCase().trim();
      
      const scored = boxes.map(box => {
          let score = 0;
          const matchedItems: string[] = [];

          const label = box.label.toLowerCase();
          const room = box.room.toLowerCase();

          // 1. Box Label Matches
          if (label === term) score = 100;
          else if (label.startsWith(term)) score = 80;
          else if (label.includes(term)) score = 60;
          
          // Room match (secondary)
          if (room.includes(term)) score = Math.max(score, 50);

          // 2. Item Matches
          const boxItems = items.filter(i => i.boxId === box.id);
          boxItems.forEach(item => {
             const iName = item.name.toLowerCase();
             let iScore = 0;
             if (iName === term) iScore = 50;
             else if (iName.startsWith(term)) iScore = 40;
             else if (iName.includes(term)) iScore = 20;

             if (iScore > 0) {
                 matchedItems.push(item.name);
                 if (score < iScore) score = iScore;
             }
          });

          return { box, score, matchedItems };
      });

      const filtered = scored
        .filter(r => r.score > 0)
        .sort((a, b) => {
            // Sort by score descending
            if (b.score !== a.score) return b.score - a.score;
            // Tie-breaker: number of matched items
            if (b.matchedItems.length !== a.matchedItems.length) return b.matchedItems.length - a.matchedItems.length;
            // Tie-breaker: label alphabetical
            return a.box.label.localeCompare(b.box.label);
        });

      return {
          filteredBoxes: filtered.map(r => r.box),
          matchedItemsMap: filtered.reduce((acc, r) => {
              acc[r.box.id] = r.matchedItems;
              return acc;
          }, {} as Record<string, string[]>)
      };
  }, [boxes, items, debouncedSearchTerm]);

  const getStatus = (box: Box) => {
    const boxItems = items.filter(i => i.boxId === box.id);
    const totalItems = boxItems.length;
    const unpackedItems = boxItems.filter(i => i.unpacked).length;

    if (moveMode === 'MOVE_OUT') {
      if (box.sealed) return 'Packed';
      if (totalItems > 0) return 'Packing';
      return 'Empty';
    } else {
      // Move In
      if (totalItems > 0 && unpackedItems === totalItems) return 'Unpacked';
      if (totalItems > 0 && unpackedItems > 0) return 'Unpacking';
      if (totalItems === 0) return 'Unpacked';
      return 'Packed';
    }
  };

  // Grouping
  const groups = moveMode === 'MOVE_OUT' 
    ? {
        Empty: filteredBoxes.filter(b => getStatus(b) === 'Empty'),
        Packing: filteredBoxes.filter(b => getStatus(b) === 'Packing'),
        Packed: filteredBoxes.filter(b => getStatus(b) === 'Packed'),
      }
    : {
        Packed: filteredBoxes.filter(b => getStatus(b) === 'Packed'),
        Unpacking: filteredBoxes.filter(b => getStatus(b) === 'Unpacking'),
        Unpacked: filteredBoxes.filter(b => getStatus(b) === 'Unpacked'),
      };

  const handleAddBox = () => {
    if (!newBoxLabel.trim() || !newBoxRoom.trim()) {
      toast.error('Please fill in label and room', { duration: 4000 });
      return;
    }

    addBox({
      label: newBoxLabel,
      room: newBoxRoom,
      size: newBoxSize,
      fragile: false,
      sealed: false,
    });

    setNewBoxLabel('');
    setNewBoxRoom('');
    setIsAdding(false);
    
    // Confetti
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#ffffff']
        });
    }
    
    toast.success('New box added!');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Delete this box and all its items?')) {
      removeBox(id);
      toast.success('Box deleted');
    }
  };
  
  const toggleSeal = (e: React.MouseEvent, box: Box) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if empty before sealing in Move Out mode
    if (moveMode === 'MOVE_OUT' && !box.sealed) {
         const boxItems = items.filter(i => i.boxId === box.id);
         if (boxItems.length === 0) {
             toast.error('Add items before sealing!', { duration: 4000 });
             return;
         }
    }

    updateBox(box.id, { sealed: !box.sealed });
    toast.success(box.sealed ? 'Box unsealed' : 'Box sealed');
  };

  const getBoxItemCount = (boxId: string) => items.filter(i => i.boxId === boxId).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <PageLayout
      header={({ compact }) => (
        <>
          <HeroBanner 
            title="Boxes"
            subtitle="Keep your stuff easy to find."
            imageSrc={BoxCow}
            imageAlt="Boxes Mascot"
            compact={compact}
          />

          <div className="bg-zinc-950/95 backdrop-blur-sm p-4 space-y-4 transition-all duration-300">
            {/* Mode Toggle */}
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                    onClick={() => setMoveMode('MOVE_OUT')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        moveMode === 'MOVE_OUT' ? "bg-amber-600 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <ArrowRight className="w-4 h-4" /> Move Out
                </button>
                <button
                    onClick={() => setMoveMode('MOVE_IN')}
                    className={clsx(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                        moveMode === 'MOVE_IN' ? "bg-green-600 text-white shadow-md" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <ArrowLeft className="w-4 h-4" /> Move In
                </button>
            </div>

            {/* Search & Add */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search boxes & items..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-800 text-white pl-9 pr-9 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 border border-zinc-700"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-700 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                
                {moveMode === 'MOVE_OUT' && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-amber-600 hover:bg-amber-500 text-white rounded-lg px-4 py-2 shadow-lg transition-transform active:scale-95 flex items-center gap-2 font-bold text-sm whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Box</span>
                    </button>
                )}
            </div>
          </div>
        </>
      )}
    >
      <div className="p-4 space-y-8 relative z-10 pb-32">
        {debouncedSearchTerm && filteredBoxes.length === 0 ? (
            <div className="text-center py-12">
                <div className="bg-zinc-900 inline-block p-4 rounded-full mb-4 border border-zinc-800">
                    <Search className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-zinc-300 font-bold text-lg">No matches found</h3>
                <p className="text-zinc-500 text-sm mt-1">Try a different word.</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-amber-500 font-bold text-sm hover:underline"
                >
                    Clear search
                </button>
            </div>
        ) : (
            Object.entries(groups).map(([groupName, groupBoxes]) => {
                if (debouncedSearchTerm && groupBoxes.length === 0) return null;

                return (
                    <section key={groupName}>
                         <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            {groupName} ({groupBoxes.length})
                         </h2>
                         {groupBoxes.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded-xl opacity-50">
                                <p className="text-zinc-500 text-xs">No boxes here.</p>
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                {groupBoxes.map((box) => (
                                    <motion.div
                                        key={box.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <BoxTile 
                                            box={box} 
                                            status={groupName}
                                            onDelete={handleDelete} 
                                            onToggleSeal={toggleSeal} 
                                            moveMode={moveMode}
                                            matchedItems={matchedItemsMap?.[box.id]}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                         )}
                    </section>
                );
            })
        )}
      </div>

      {/* Add Box Drawer (Only in Move Out Mode) */}
      <Drawer.Root open={isAdding} onOpenChange={setIsAdding}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-zinc-900 flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50 outline-none border-t border-zinc-800 p-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] max-w-3xl mx-auto">
             <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mb-8" />
             <Drawer.Title className="text-xl font-bold text-white mb-6">New Box</Drawer.Title>
             <Drawer.Description className="sr-only">Fill out the form below to create a new box.</Drawer.Description>
             
             <div className="space-y-4">
               <div>
                 <label className="text-xs text-zinc-400 block mb-1">Label (e.g., Kitchen 1)</label>
                 <input 
                    className="w-full bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:border-amber-500 outline-none"
                    value={newBoxLabel}
                    onChange={(e) => setNewBoxLabel(e.target.value)}
                    placeholder="Enter label"
                    autoFocus
                 />
               </div>
               
               <div>
                 <label className="text-xs text-zinc-400 block mb-1">Room</label>
                 <select 
                    className="w-full bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:border-amber-500 outline-none appearance-none"
                    value={newBoxRoom}
                    onChange={(e) => setNewBoxRoom(e.target.value)}
                 >
                    <option value="">Select Room</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bedroom 1">Bedroom 1</option>
                    <option value="Bedroom 2">Bedroom 2</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Garage">Garage</option>
                    <option value="Office">Office</option>
                 </select>
               </div>

               <div>
                 <label className="text-xs text-zinc-400 block mb-1">Size</label>
                 <div className="flex gap-3">
                   {(['S', 'M', 'L'] as BoxSize[]).map((size) => (
                     <button
                        key={size}
                        onClick={() => setNewBoxSize(size)}
                        className={clsx(
                          "flex-1 p-3 rounded-lg border text-sm font-bold transition-colors",
                          newBoxSize === size ? "bg-amber-600 border-amber-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        )}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>

               <button 
                  onClick={handleAddBox}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-zinc-200 transition-colors"
               >
                 Create Box
               </button>
             </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </PageLayout>
  );
}

function BoxTile({ box, status, onDelete, onToggleSeal, moveMode, matchedItems }: { 
  box: Box; 
  status: string;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onToggleSeal: (e: React.MouseEvent, box: Box) => void;
  moveMode: MoveMode;
  matchedItems?: string[];
}) {
  const Icon = {
      'Empty': EmptyBoxIcon,
      'Packing': PackingBoxIcon,
      'Packed': PackedBoxIcon,
      'Unpacking': UnpackingBoxIcon,
      'Unpacked': UnpackedBoxIcon
  }[status] || EmptyBoxIcon;

  // Colors for badges
  const badgeColor = {
      'Empty': 'bg-zinc-500/90',
      'Packing': 'bg-blue-500/90',
      'Packed': 'bg-amber-500/90',
      'Unpacking': 'bg-purple-500/90',
      'Unpacked': 'bg-green-500/90',
  }[status];

  return (
    <Link to={`/boxes/${box.id}`} className="block group relative">
       {/* Box Visual */}
       <div className="relative aspect-square mb-3 rounded-xl overflow-hidden transition-all transform group-active:scale-95">
          <Icon />
          
          {/* Overlays */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
             {box.fragile && (
               <span className="bg-red-500/90 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold">FRAGILE</span>
             )}
             <span className={clsx(
               "text-[10px] px-1.5 py-0.5 rounded shadow-sm font-bold text-white",
               badgeColor
             )}>
               {status}
             </span>
          </div>
       </div>

       {/* Label Area */}
       <div className="px-1">
         <div className="flex justify-between items-start">
            <h3 className="font-bold text-zinc-200 text-sm leading-tight line-clamp-2">{box.label}</h3>
            
            {/* Seal Toggle - Only in Move Out mode */}
            {moveMode === 'MOVE_OUT' && (
                <button 
                    onClick={(e) => onToggleSeal(e, box)}
                    className="text-zinc-600 hover:text-amber-500 p-1 -mr-2 -mt-1"
                >
                    {box.sealed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
            )}
         </div>
         <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1 truncate">
           {box.room}
         </p>

         {/* Matched Items Preview */}
         {matchedItems && matchedItems.length > 0 && (
             <div className="mt-2 pt-2 border-t border-zinc-800/50">
                 <p className="text-[10px] text-zinc-400 font-medium mb-1">Matches:</p>
                 <div className="flex flex-wrap gap-1">
                     {matchedItems.slice(0, 2).map((item, i) => (
                         <span key={i} className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20 truncate max-w-full">
                             {item}
                         </span>
                     ))}
                     {matchedItems.length > 2 && (
                         <span className="text-[10px] text-zinc-500 px-1 py-0.5">
                             +{matchedItems.length - 2} more
                         </span>
                     )}
                 </div>
             </div>
         )}
       </div>
    </Link>
  );
}
