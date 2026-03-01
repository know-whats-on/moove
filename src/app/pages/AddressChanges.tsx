import { useState } from 'react';
import { useStore, AddressChangeItem, AddressStatus } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2, Circle, Plus, Trash2, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { HeroBanner } from '../components/HeroBanner';
import { PageLayout } from '../components/PageLayout';
const AddressCow = '/banners/AddressCow.png';
export default function AddressChanges() {
  const { addressChanges, updateAddressChange, addAddressChange, removeAddressChange } = useStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Bank/Finance');
  const [isAdding, setIsAdding] = useState(false);
  
  // New Item State
  const [newItemPlace, setNewItemPlace] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Bank/Finance');

  const categories = Array.from(new Set(addressChanges.map(item => item.category))).sort();
  // Ensure all default categories are present if they have items, or just use the ones from store.
  // The store initializes with some.

  const handleToggleStatus = (id: string, currentStatus: AddressStatus) => {
    const newStatus = currentStatus === 'To do' ? 'Done' : 'To do';
    updateAddressChange(id, { status: newStatus });
    if (newStatus === 'Done') toast.success('Marked as done');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemPlace.trim()) return;

    addAddressChange({
      category: newItemCategory,
      place: newItemPlace,
      action: 'Update Address',
      status: 'To do'
    });
    
    setNewItemPlace('');
    setIsAdding(false);
    toast.success('Address change added');
  };

  const total = addressChanges.length;
  const done = addressChanges.filter(i => i.status === 'Done').length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <PageLayout
      header={({ compact }) => (
        <HeroBanner 
          title="Address"
          secondaryTitle="Changes"
          subtitle="Keep everyone in the loop with your new address."
          imageSrc={AddressCow}
          imageAlt="Address Change Mascot"
          compact={compact}
        />
      )}
    >
      {/* Progress Section */}
      <div className="p-4 pb-0">
         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-zinc-300">Overall Progress</span>
                <span className="text-2xl font-bold text-green-500">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                <div 
                    className="bg-green-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-zinc-500 font-medium uppercase tracking-wide">
                <span>{done} Completed</span>
                <span>{total - done} Remaining</span>
            </div>
         </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
         {categories.map((category) => {
             const items = addressChanges.filter(i => i.category === category);
             const isExpanded = expandedCategory === category;
             const completedCount = items.filter(i => i.status === 'Done').length;
             
             return (
                 <div key={category} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <button 
                        onClick={() => setExpandedCategory(isExpanded ? null : category)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                            <span className="font-bold text-zinc-200 break-words">{category === 'Bank/Finance' ? 'Bank' : category}</span>
                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full flex-shrink-0">
                                {completedCount}/{items.length}
                            </span>
                        </div>
                        <ChevronDown className={clsx("w-5 h-5 text-zinc-500 transition-transform flex-shrink-0 ml-2", isExpanded && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="border-t border-zinc-800 divide-y divide-zinc-800/50">
                                    {items.map(item => (
                                        <div key={item.id} className="p-4 flex items-center gap-3 hover:bg-zinc-800/30 transition-colors group">
                                            <button 
                                                onClick={() => handleToggleStatus(item.id, item.status)}
                                                className={clsx(
                                                    "flex-shrink-0 transition-colors",
                                                    item.status === 'Done' ? "text-green-500" : "text-zinc-600 hover:text-zinc-400"
                                                )}
                                            >
                                                {item.status === 'Done' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                            </button>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className={clsx(
                                                    "font-medium truncate transition-colors",
                                                    item.status === 'Done' ? "text-zinc-500 line-through" : "text-zinc-200"
                                                )}>
                                                    {item.place === 'DMV' ? "Driver's License" : item.place}
                                                </div>
                                                <div className="text-xs text-zinc-500 truncate">{item.action}</div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Remove this item?')) {
                                                        removeAddressChange(item.id);
                                                        toast.success('Item removed');
                                                    }
                                                }}
                                                className="p-2 text-zinc-600 hover:text-red-400 transition-opacity"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
             );
         })}
         
         {/* Add New Item Button */}
         <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-2 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all"
         >
             <Plus className="w-5 h-5" /> Add Custom Place
         </button>
      </div>

       {/* Add Item Modal (Simple overlay for now) */}
       {isAdding && (
           <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
               <motion.div 
                   initial={{ y: 100, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-xl p-6 shadow-2xl space-y-4"
               >
                   <h3 className="text-lg font-bold text-white">Add Place</h3>
                   
                   <div>
                       <label className="text-xs text-zinc-400 block mb-1">Place Name</label>
                       <input 
                          value={newItemPlace}
                          onChange={(e) => setNewItemPlace(e.target.value)}
                          placeholder="e.g. Gym, Library, Club"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                          autoFocus
                       />
                   </div>

                   <div>
                       <label className="text-xs text-zinc-400 block mb-1">Category</label>
                       <select 
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-amber-500 outline-none"
                       >
                           {categories.map(c => <option key={c} value={c}>{c}</option>)}
                           <option value="Other">Other</option>
                       </select>
                   </div>

                   <div className="flex gap-3 mt-4">
                       <button 
                           onClick={() => setIsAdding(false)}
                           className="flex-1 py-3 text-zinc-400 font-bold hover:text-white"
                       >
                           Cancel
                       </button>
                       <button 
                           onClick={handleAddItem}
                           className="flex-1 py-3 bg-amber-600 rounded-lg text-white font-bold hover:bg-amber-500"
                       >
                           Add
                       </button>
                   </div>
               </motion.div>
           </div>
       )}
    </PageLayout>
  );
}
