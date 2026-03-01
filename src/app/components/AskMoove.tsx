import { useState, useMemo, useEffect, useRef } from 'react';
import { Drawer } from 'vaul';
import { useStore, Box, BoxItem } from '../store';
import { 
  Search, 
  X, 
  ArrowRight, 
  Package, 
  MapPin, 
  Box as BoxIcon,
  List,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { clsx } from 'clsx';

interface AskMooveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Intent = 'item-locator' | 'box-inventory' | 'general';

interface Suggestion {
  id: string;
  type: 'item' | 'box';
  mainText: string;
  subText: string;
  fillQuery: string;
}

interface SearchResult {
  type: 'item-match' | 'box-match' | 'box-list';
  box?: Box;
  items?: BoxItem[]; 
  matchCount?: number;
  label?: string; // For headers
}

export function AskMoove({ open, onOpenChange }: AskMooveProps) {
  const { boxes, items, moveMode } = useStore();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'search' | 'results'>('search');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [resultHeader, setResultHeader] = useState<string>('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      // Small delay to allow drawer animation to start
      setTimeout(() => inputRef.current?.focus(), 100);
      setView('search');
      setQuery('');
      setResults([]);
      setResultHeader('');
    }
  }, [open]);

  // --- Helpers ---

  const getBoxStatus = (box: Box) => {
    const boxItems = items.filter(i => i.boxId === box.id);
    const totalItems = boxItems.length;
    const unpackedItems = boxItems.filter(i => i.unpacked).length;

    if (moveMode === 'MOVE_OUT') {
      if (box.sealed) return 'Packed';
      if (totalItems > 0) return 'Packing';
      return 'Empty';
    } else {
      if (totalItems > 0 && unpackedItems === totalItems) return 'Unpacked';
      if (totalItems > 0 && unpackedItems > 0) return 'Unpacking';
      if (totalItems === 0) return 'Unpacked'; 
      return 'Packed';
    }
  };

  // --- Intent Detection & Suggestions ---

  const { intent, suggestions } = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    let currentIntent: Intent = 'general';
    
    // Intent Detection Regex
    const itemLocatorRegex = /^(where is|where’s|wheres|find my|find|where.*my)/i;
    const boxInventoryRegex = /^(list everything in|list items in|what’s in|whats in|show me what’s in)/i;

    if (itemLocatorRegex.test(lowerQuery)) currentIntent = 'item-locator';
    else if (boxInventoryRegex.test(lowerQuery)) currentIntent = 'box-inventory';

    let sugs: Suggestion[] = [];

    if (!query.trim()) return { intent: currentIntent, suggestions: [] };

    if (currentIntent === 'item-locator') {
      // Extract term
      const term = lowerQuery
        .replace(itemLocatorRegex, '')
        .replace('my', '')
        .trim();

      // Search Items
      const matches = items.filter(i => i.name.toLowerCase().includes(term));
      const uniqueNames = Array.from(new Set(matches.map(i => i.name)));
      
      // Limit to 5
      sugs = uniqueNames.slice(0, 5).map(name => {
        const matchingItems = items.filter(i => i.name === name);
        const boxLabels = matchingItems
          .map(i => boxes.find(b => b.id === i.boxId)?.label)
          .filter(Boolean);
        const uniqueBoxLabels = Array.from(new Set(boxLabels));
        
        let subText = '';
        if (uniqueBoxLabels.length === 1) subText = `in ${uniqueBoxLabels[0]}`;
        else subText = `in ${uniqueBoxLabels.length} boxes`;

        return {
          id: `item-${name}`,
          type: 'item',
          mainText: name,
          subText,
          fillQuery: `Where is my ${name}?`
        };
      });
    } else if (currentIntent === 'box-inventory') {
       const term = lowerQuery.replace(boxInventoryRegex, '').trim();

       const matches = boxes.filter(b => b.label.toLowerCase().includes(term));
       sugs = matches.slice(0, 5).map(box => ({
         id: box.id,
         type: 'box',
         mainText: box.label,
         subText: `${box.room} • ${getBoxStatus(box)}`,
         fillQuery: `List everything in ${box.label}.`
       }));
    } else {
      // Fallback: General Search
      // Items
      const itemMatches = items.filter(i => i.name.toLowerCase().includes(lowerQuery));
      const uniqueItemNames = Array.from(new Set(itemMatches.map(i => i.name))).slice(0, 3);
      
      const itemSugs: Suggestion[] = uniqueItemNames.map(name => {
          const matchingItems = items.filter(i => i.name === name);
          const boxLabels = matchingItems.map(i => boxes.find(b => b.id === i.boxId)?.label).filter(Boolean);
          const uniqueBoxLabels = Array.from(new Set(boxLabels));
          let subText = uniqueBoxLabels.length === 1 ? `in ${uniqueBoxLabels[0]}` : `in ${uniqueBoxLabels.length} boxes`;

          return {
            id: `item-${name}`,
            type: 'item',
            mainText: name,
            subText,
            fillQuery: `Where is my ${name}?`
          };
      });

      // Boxes
      const boxMatches = boxes.filter(b => b.label.toLowerCase().includes(lowerQuery));
      const boxSugs: Suggestion[] = boxMatches.slice(0, 3).map(box => ({
           id: box.id,
           type: 'box',
           mainText: box.label,
           subText: `${box.room} • ${getBoxStatus(box)}`,
           fillQuery: `List everything in ${box.label}.`
      }));

      sugs = [...itemSugs, ...boxSugs];
    }

    return { intent: currentIntent, suggestions: sugs };
  }, [query, boxes, items, moveMode]);


  // --- Execution ---

  const handleExecute = (overrideQuery?: string) => {
    const finalQuery = (overrideQuery || query).trim();
    if (!finalQuery) return;

    setQuery(finalQuery);
    
    const lowerQuery = finalQuery.toLowerCase();
    
    // Special Commands
    if (lowerQuery.includes('show open boxes')) {
        const openBoxes = boxes.filter(b => !b.sealed);
        setResults(openBoxes.map(b => ({ type: 'box-match', box: b, items: items.filter(i => i.boxId === b.id) })));
        setResultHeader(`Found ${openBoxes.length} open boxes`);
        setView('results');
        return;
    }
    if (lowerQuery.includes('show packed boxes')) {
        const packedBoxes = boxes.filter(b => b.sealed);
        setResults(packedBoxes.map(b => ({ type: 'box-match', box: b, items: items.filter(i => i.boxId === b.id) })));
        setResultHeader(`Found ${packedBoxes.length} packed boxes`);
        setView('results');
        return;
    }

    // Regex Check
    const itemLocatorRegex = /^(where is|where’s|wheres|find my|find|where.*my)/i;
    const boxInventoryRegex = /^(list everything in|list items in|what’s in|whats in|show me what’s in)/i;
    
    let res: SearchResult[] = [];
    let header = '';

    if (boxInventoryRegex.test(lowerQuery)) {
       // Box Search
       const term = lowerQuery.replace(boxInventoryRegex, '').replace(/\.$/, '').trim();
       let matchedBoxes = boxes.filter(b => b.label.toLowerCase() === term.toLowerCase());
       if (matchedBoxes.length === 0) {
         matchedBoxes = boxes.filter(b => b.label.toLowerCase().includes(term));
       }

       res = matchedBoxes.map(box => ({
         type: 'box-match',
         box,
         items: items.filter(i => i.boxId === box.id)
       }));
       
       if (matchedBoxes.length === 0) header = 'No boxes found';
       else header = `Found ${matchedBoxes.length} box${matchedBoxes.length === 1 ? '' : 'es'}`;

    } else {
       // Item Search (Default)
       let term = lowerQuery.replace(itemLocatorRegex, '').replace(/\?$/, '').replace('my', '').trim();
       // Fallback if regex matched but term is empty (e.g. "find my") -> shouldn't happen with valid execution but safety check
       if (!term && itemLocatorRegex.test(lowerQuery)) term = "";
       else if (!term) term = lowerQuery;

       const matchedItems = items.filter(i => i.name.toLowerCase().includes(term));
       
       // Group by Box
       const boxesMap = new Map<string, BoxItem[]>();
       matchedItems.forEach(item => {
         if (boxesMap.has(item.boxId)) {
           boxesMap.get(item.boxId)?.push(item);
         } else {
           boxesMap.set(item.boxId, [item]);
         }
       });

       res = Array.from(boxesMap.entries()).map(([boxId, boxItems]) => {
         const box = boxes.find(b => b.id === boxId);
         if (!box) return null;
         return {
           type: 'item-match',
           box,
           items: boxItems,
           matchCount: boxItems.length
         } as SearchResult;
       }).filter(Boolean) as SearchResult[];

       if (res.length === 0) header = 'No items found';
       else header = `Found in ${res.length} box${res.length === 1 ? '' : 'es'}`;
    }

    setResults(res);
    setResultHeader(header);
    setView('results');
  };

  const handleSuggestionClick = (sug: Suggestion) => {
    setQuery(sug.fillQuery);
    handleExecute(sug.fillQuery);
  };

  // --- Render ---

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-zinc-950 flex flex-col rounded-t-[20px] h-[90vh] fixed bottom-0 left-0 right-0 z-50 outline-none border-t border-zinc-800 max-w-3xl mx-auto shadow-2xl">
          
          {/* Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mt-3 mb-2" />
          
          {/* Header Area */}
          <div className="px-5 pb-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Drawer.Title className="text-xl font-bold text-white flex items-center gap-2">
                  Ask Moo <Sparkles className="w-4 h-4 text-amber-500" />
                </Drawer.Title>
                <Drawer.Description className="text-xs text-zinc-400">Find items, boxes, and what’s inside.</Drawer.Description>
              </div>
              <button onClick={() => onOpenChange(false)} className="p-2 -mr-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Chips (Always Visible Above Input) */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-1">
               <QuickChip label="Where is my..." onClick={() => { setQuery("Where is my "); inputRef.current?.focus(); }} />
               <QuickChip label="List everything in..." onClick={() => { setQuery("List everything in "); inputRef.current?.focus(); }} />
               <QuickChip label="Open boxes" onClick={() => handleExecute("Show open boxes")} />
               <QuickChip label="Packed boxes" onClick={() => handleExecute("Show packed boxes")} />
            </div>

            {/* Smart Command Bar */}
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (view === 'results') setView('search');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                placeholder="Try “Where is my charger?” or “List everything in Box 2.”"
                aria-label="Ask Moove"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-12 pr-24 py-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 placeholder:text-zinc-600 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 {query && (
                    <button 
                        onClick={() => {
                            setQuery('');
                            setView('search');
                            inputRef.current?.focus();
                        }}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-full hover:bg-zinc-800 transition-colors"
                        aria-label="Clear history"
                    >
                        <X className="w-4 h-4" />
                    </button>
                 )}
                 <button 
                    onClick={() => handleExecute()}
                    className="bg-zinc-800 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors font-bold text-xs"
                 >
                    Go
                 </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-950 px-5">
            {view === 'search' ? (
              <div className="py-4 space-y-6">
                
                {/* Suggestions List */}
                {suggestions.length > 0 ? (
                  <div className="space-y-1">
                     {/* Mode Hint Below Input / Above Suggestions */}
                     <div className="pb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                           {intent === 'item-locator' && <Search className="w-3 h-3" />}
                           {intent === 'box-inventory' && <List className="w-3 h-3" />}
                           {intent === 'general' && <Sparkles className="w-3 h-3" />}
                           {intent === 'item-locator' ? "Searching Items" : intent === 'box-inventory' ? "Searching Boxes" : "Suggestions"}
                        </span>
                     </div>

                    {suggestions.map((sug) => (
                      <button
                        key={sug.id}
                        onClick={() => handleSuggestionClick(sug)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900 text-left group transition-colors border border-transparent hover:border-zinc-800"
                      >
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:border-amber-500/30 group-hover:text-amber-500 transition-colors shrink-0">
                              {sug.type === 'item' ? <Package className="w-5 h-5" /> : <BoxIcon className="w-5 h-5" />}
                           </div>
                           <div className="min-w-0">
                             <div className="font-bold text-zinc-200 group-hover:text-white truncate">{sug.mainText}</div>
                             <div className="text-xs text-zinc-500 group-hover:text-zinc-400 truncate">{sug.subText}</div>
                           </div>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-amber-500 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : query.trim().length > 0 ? (
                  // Empty State for Search
                  <div className="text-center py-10 text-zinc-500">
                    <p className="text-sm">No matches found.</p>
                  </div>
                ) : (
                  // Zero State
                   <div className="text-center py-12 text-zinc-500 opacity-50">
                      <p className="text-sm">Start typing to search...</p>
                   </div>
                )}
              </div>
            ) : (
              // Results View
              <div className="py-4 space-y-4 pb-20">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{resultHeader}</h3>
                </div>

                {results.length > 0 ? (
                   <div className="space-y-4">
                     {results.map((res, idx) => (
                        <ResultCard 
                          key={idx} 
                          result={res} 
                          onClose={() => onOpenChange(false)} 
                        />
                     ))}
                   </div>
                ) : (
                   // Not Found State
                   <div className="text-center py-8 px-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                        <Search className="w-8 h-8 text-zinc-600" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">
                        Nothing found
                      </h3>
                      <p className="text-zinc-400 text-sm mb-6 max-w-xs mx-auto">
                         We couldn't find what you're looking for in your inventory.
                      </p>
                      <div className="flex justify-center gap-3">
                        <button 
                           onClick={() => { onOpenChange(false); navigate('/boxes'); }}
                           className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm"
                        >
                           Go to Boxes
                        </button>
                      </div>
                   </div>
                )}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function QuickChip({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="whitespace-nowrap bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all"
    >
      {label}
    </button>
  );
}

function ResultCard({ result, onClose }: { result: SearchResult, onClose: () => void }) {
  const navigate = useNavigate();
  const { moveMode } = useStore();
  
  const handleOpen = () => {
    onClose();
    if (result.box) {
        navigate(`/boxes/${result.box.id}`);
    }
  };

  if (!result.box) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/30">
        <div className="flex items-center gap-3 min-w-0">
           <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-500 shrink-0 border border-zinc-700/50">
             <BoxIcon className="w-5 h-5" />
           </div>
           <div className="min-w-0">
             <h3 className="font-bold text-white truncate text-sm">{result.box.label}</h3>
             <p className="text-xs text-zinc-400 truncate flex items-center gap-1.5">
                {result.box.room}
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className={clsx(
                    result.box.sealed ? "text-amber-500" : "text-zinc-400"
                )}>
                    {result.box.sealed ? "Packed" : "Open"}
                </span>
             </p>
           </div>
        </div>
        <button 
          onClick={handleOpen}
          className="bg-zinc-100 text-zinc-900 hover:bg-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          Open
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {result.type === 'item-match' && (
           <div className="space-y-3">
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Matched Items</div>
             {result.items?.map(item => (
               <div key={item.id} className="flex justify-between items-center bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                 <div className="flex items-center gap-2">
                    <div className={clsx(
                        "w-2 h-2 rounded-full",
                        moveMode === 'MOVE_IN' && !item.unpacked ? "bg-zinc-700" : "bg-green-500"
                    )} />
                    <span className="text-zinc-200 text-sm font-medium">{item.name}</span>
                 </div>
                 <span className="text-zinc-500 text-xs font-mono">x{item.quantity}</span>
               </div>
             ))}
           </div>
        )}

        {result.type === 'box-match' && (
           <div className="space-y-2">
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Contents</div>
             {result.items && result.items.length > 0 ? (
                <div className="divide-y divide-zinc-800/50 border border-zinc-800/50 rounded-lg overflow-hidden">
                    {result.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-zinc-950/30">
                            <span className="text-zinc-300 text-sm">{item.name}</span>
                            <span className="text-zinc-600 text-xs">x{item.quantity}</span>
                        </div>
                    ))}
                </div>
             ) : (
               <div className="text-zinc-500 italic text-sm py-2">Empty box</div>
             )}
           </div>
        )}
      </div>
    </div>
  );
}
