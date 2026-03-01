import { useParams, useNavigate } from 'react-router';
import { useStore, BoxSize } from '../store';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, AlertCircle, Save, X, Edit2, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { EmptyBoxIcon, PackingBoxIcon, PackedBoxIcon, UnpackingBoxIcon, UnpackedBoxIcon } from '../components/BoxIcons';

export default function BoxDetail() {
  const { boxId } = useParams();
  const navigate = useNavigate();
  const { boxes, items, updateBox, removeBox, addItem, removeItem, updateItem, moveMode } = useStore();
  
  const box = boxes.find(b => b.id === boxId);
  const boxItems = items.filter(i => i.boxId === boxId);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editLabel, setEditLabel] = useState('');
  const [editRoom, setEditRoom] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (box) {
      setEditLabel(box.label);
      setEditRoom(box.room);
    }
  }, [box]);

  if (!box) {
    return <div className="p-8 text-center text-zinc-500">Box not found</div>;
  }

  // Derived state
  const isSealed = box.sealed;
  const totalItems = boxItems.length;
  const unpackedItemsCount = boxItems.filter(i => i.unpacked).length;
  
  let derivedStatus = 'Empty';
  if (moveMode === 'MOVE_OUT') {
      if (box.sealed) derivedStatus = 'Packed';
      else if (totalItems > 0) derivedStatus = 'Packing';
      else derivedStatus = 'Empty';
  } else {
      // Move In
      if (totalItems > 0 && unpackedItemsCount === totalItems) derivedStatus = 'Unpacked';
      else if (totalItems > 0 && unpackedItemsCount > 0) derivedStatus = 'Unpacking';
      else if (totalItems === 0) derivedStatus = 'Unpacked'; // Treat empty box as unpacked/done
      else derivedStatus = 'Packed';
  }

  const Icon = {
      'Empty': EmptyBoxIcon,
      'Packing': PackingBoxIcon,
      'Packed': PackedBoxIcon,
      'Unpacking': UnpackingBoxIcon,
      'Unpacked': UnpackedBoxIcon
  }[derivedStatus] || EmptyBoxIcon;

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemName.trim()) return;
    
    if (box.sealed) {
        toast.error('Unseal box to add items', { duration: 4000 });
        return;
    }

    const qty = newItemQty > 0 ? Number(newItemQty) : 1;
    
    addItem({
      boxId: box.id,
      name: newItemName,
      quantity: qty,
      unpacked: false,
      category: '',
      notes: ''
    });
    setNewItemName('');
    setNewItemQty(1);
    toast.success('Item added');
    
    // Keep focus
    nameInputRef.current?.focus();
  };

  const handleSaveBox = () => {
    updateBox(box.id, {
      label: editLabel,
      room: editRoom,
    });
    setIsEditing(false);
    toast.success('Box updated');
  };

  const handleDeleteBox = () => {
    if (confirm('Are you sure you want to delete this box?')) {
      removeBox(box.id);
      navigate('/boxes');
      toast.success('Box deleted');
    }
  };

  const toggleSeal = () => {
      if (moveMode === 'MOVE_OUT' && !box.sealed && totalItems === 0) {
          toast.error('Add items before sealing!', { duration: 4000 });
          return;
      }
      updateBox(box.id, { sealed: !box.sealed });
      toast.success(box.sealed ? 'Box unsealed' : 'Box sealed');
  };

  // Move In Actions
  const handleToggleUnpacked = (item: typeof boxItems[0]) => {
      updateItem(item.id, { unpacked: !item.unpacked });
      // If marking as unpacked and box is sealed, unseal it
      if (!item.unpacked && box.sealed) {
          updateBox(box.id, { sealed: false });
          toast.info('Box unsealed for unpacking');
      }
  };

  const handleMarkAllUnpacked = () => {
      boxItems.forEach(item => {
          if (!item.unpacked) updateItem(item.id, { unpacked: true });
      });
      if (box.sealed) updateBox(box.id, { sealed: false });
      toast.success('All items marked unpacked');
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/boxes')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {isEditing ? (
            <input 
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="bg-zinc-800 text-white font-bold text-lg px-2 py-1 rounded w-full mx-4 outline-none border border-zinc-700 focus:border-amber-500"
            />
        ) : (
            <h1 className="font-bold text-lg text-white truncate mx-4 flex-1 text-center">{box.label}</h1>
        )}

        <button 
            onClick={() => isEditing ? handleSaveBox() : setIsEditing(true)}
            className={clsx("p-2 -mr-2 rounded-full", isEditing ? "text-green-500" : "text-zinc-400 hover:text-white")}
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Box Visual State */}
        <div className={clsx(
            "rounded-xl p-6 flex flex-col items-center justify-center gap-4 border transition-colors",
            box.sealed 
                ? "bg-zinc-900 border-amber-900/50" 
                : "bg-zinc-900 border-zinc-800"
        )}>
            <div className="w-32 h-32 relative">
                <Icon />
                 {box.fragile && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md animate-pulse">
                        FRAGILE
                    </div>
                 )}
            </div>

            {/* Controls based on Mode */}
            {moveMode === 'MOVE_OUT' ? (
                <div className="flex items-center gap-4 w-full bg-zinc-950 p-1.5 rounded-full border border-zinc-800 max-w-xs mx-auto">
                    <button
                        onClick={() => updateBox(box.id, { sealed: false })}
                        className={clsx(
                            "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
                            !box.sealed ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Unlock className="w-4 h-4" /> Open
                    </button>
                    <button
                        onClick={toggleSeal}
                        className={clsx(
                            "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2",
                            box.sealed ? "bg-amber-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <Lock className="w-4 h-4" /> Sealed
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <span className={clsx(
                        "text-sm font-bold px-3 py-1 rounded-full",
                        derivedStatus === 'Unpacked' ? "bg-green-500/20 text-green-400" : 
                        derivedStatus === 'Unpacking' ? "bg-purple-500/20 text-purple-400" :
                        "bg-amber-500/20 text-amber-400"
                    )}>
                        {derivedStatus}
                    </span>
                    <p className="text-xs text-zinc-500 mt-2">
                        {derivedStatus === 'Unpacked' ? "Box is empty & done!" :
                         derivedStatus === 'Unpacking' ? "Unpacking in progress..." :
                         "Ready to unpack."}
                    </p>
                </div>
            )}
        </div>

        {/* Box Meta Grid */}
        <div className="grid grid-cols-2 gap-3">
             <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                 <label className="text-[10px] uppercase text-zinc-500 font-bold mb-1 block">Room</label>
                 {isEditing ? (
                     <select 
                        value={editRoom} onChange={(e) => setEditRoom(e.target.value)}
                        className="bg-zinc-800 w-full text-sm p-1 rounded border border-zinc-700"
                     >
                        <option value="Living Room">Living Room</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Bedroom 1">Bedroom 1</option>
                        <option value="Bedroom 2">Bedroom 2</option>
                        <option value="Bathroom">Bathroom</option>
                        <option value="Garage">Garage</option>
                        <option value="Office">Office</option>
                     </select>
                 ) : (
                    <div className="text-zinc-200 font-medium truncate">{box.room}</div>
                 )}
             </div>

             <button 
                onClick={() => updateBox(box.id, { fragile: !box.fragile })}
                className={clsx(
                    "bg-zinc-900 p-3 rounded-xl border flex items-center justify-center gap-2 transition-colors",
                    box.fragile ? "border-red-500/50 text-red-400 bg-red-500/10" : "border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                )}
             >
                 <AlertCircle className="w-5 h-5" />
                 <span className="text-sm font-medium">{box.fragile ? "Fragile" : "Not Fragile"}</span>
             </button>
        </div>

        {/* Items List */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-zinc-200">Contents ({boxItems.length})</h3>
                {moveMode === 'MOVE_IN' && unpackedItemsCount < totalItems && totalItems > 0 && (
                     <button 
                        onClick={handleMarkAllUnpacked}
                        className="text-xs text-amber-500 hover:text-amber-400 font-bold"
                     >
                        Mark All Unpacked
                     </button>
                )}
            </div>
            
            <div className="divide-y divide-zinc-800/50">
                <AnimatePresence initial={false}>
                    {boxItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={clsx(
                                "p-4 flex items-center justify-between group transition-colors",
                                item.unpacked && moveMode === 'MOVE_IN' ? "bg-green-900/10 opacity-60" : ""
                            )}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {moveMode === 'MOVE_IN' && (
                                    <button 
                                        onClick={() => handleToggleUnpacked(item)}
                                        className={clsx(
                                            "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                            item.unpacked 
                                                ? "bg-green-500 border-green-500 text-white" 
                                                : "border-zinc-600 hover:border-zinc-400"
                                        )}
                                    >
                                        {item.unpacked && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                )}
                                <div>
                                    <div className={clsx(
                                        "font-medium",
                                        item.unpacked && moveMode === 'MOVE_IN' ? "text-zinc-500 line-through" : "text-zinc-200"
                                    )}>
                                        {item.name}
                                    </div>
                                    {item.notes && <div className="text-xs text-zinc-500">{item.notes}</div>}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-zinc-400 text-sm">x{item.quantity}</div>
                                {moveMode === 'MOVE_OUT' && (
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors opacity-50 hover:opacity-100 focus:opacity-100"
                                        aria-label="Delete item"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {boxItems.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                        {moveMode === 'MOVE_OUT' 
                            ? "No items yet. Add something!"
                            : "This box is empty."
                        }
                    </div>
                )}
            </div>

            {/* Quick Add Row - ONLY IN MOVE OUT */}
            {moveMode === 'MOVE_OUT' && (
                <div className="p-4 bg-zinc-800/30 border-t border-zinc-800">
                     {!box.sealed ? (
                        <form onSubmit={handleAddItem} className="flex flex-col min-[400px]:flex-row gap-2">
                            <input 
                                ref={nameInputRef}
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Item name"
                                className="w-full min-[400px]:flex-[2] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                            />
                            <div className="flex gap-2 w-full min-[400px]:w-auto">
                                <input 
                                    type="number"
                                    min="1"
                                    value={newItemQty}
                                    onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                                    className="flex-1 min-[400px]:w-16 min-[400px]:flex-none bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-3 text-sm text-white text-center focus:outline-none focus:border-amber-500"
                                />
                                <button 
                                    type="submit"
                                    disabled={!newItemName.trim()}
                                    className="flex-1 min-[400px]:flex-none bg-amber-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 hover:bg-amber-500 transition-colors flex items-center justify-center flex-shrink-0"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="ml-2 min-[400px]:hidden text-sm font-bold">Add</span>
                                </button>
                            </div>
                        </form>
                     ) : (
                         <div className="text-center text-zinc-500 text-sm py-2">
                             Unseal box to add items
                         </div>
                     )}
                </div>
            )}
        </div>

        <div className="w-full">
            <button 
                onClick={handleDeleteBox}
                className="w-full bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-center gap-2 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-medium">Delete Box</span>
            </button>
        </div>

      </div>
    </div>
  );
}
