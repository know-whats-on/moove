import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useStore } from '../store';
import { Download, Trash2, HelpCircle, PlayCircle, User, Calendar, MapPin, Calculator, RefreshCw, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { AddressSearch } from '../components/AddressSearch';
import { useState, useRef } from 'react';
import { PageLayout } from '../components/PageLayout';
import { HeroBanner } from '../components/HeroBanner';
const CowSettings = '/banners/CowSettings.png';
const MooAbout = '/icons/AppIcon.png';
export default function Settings() {
  const { 
    resetData, 
    boxes, 
    items, 
    addressChanges, 
    checklistTasks,
    startOnboarding,
    setHasSeenOnboarding,
    userName,
    setUserName,
    moveDate,
    setMoveDate,
    fromAddress,
    toAddress,
    fromCoords,
    toCoords,
    setFromAddress,
    setToAddress,
    setDistanceText,
    importData
  } = useStore();

  const [isCalculating, setIsCalculating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCalculateDistance = async () => {
    if (!fromCoords || !toCoords) {
        toast.error('Please set both addresses first');
        return;
    }

    setIsCalculating(true);
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No route found');
        }

        const distanceMeters = data.routes[0].distance;
        const distanceMiles = distanceMeters * 0.000621371;
        const distanceKm = distanceMeters / 1000;

        let formattedMiles = '';
        if (distanceMiles < 10) {
            formattedMiles = distanceMiles.toFixed(1);
        } else {
            formattedMiles = Math.round(distanceMiles).toString();
        }

        const formattedKm = Math.round(distanceKm);
        const text = `Mooving ${formattedMiles} miles away (${formattedKm} km)`;
        
        setDistanceText(text);
        toast.success('Distance updated!');

    } catch (error) {
        console.error('Distance calculation failed:', error);
        toast.error('Couldn’t calculate distance right now. Try again.');
    } finally {
        setIsCalculating(false);
    }
  };

  const handleClearAddresses = () => {
      setFromAddress('', undefined);
      setToAddress('', undefined);
      setDistanceText('');
      toast.success('Addresses cleared');
  };

  const handleExportJSON = () => {
    const data = {
      boxes,
      items,
      addressChanges,
      checklistTasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moove-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup exported');
  };

  const handleExportCSV = () => {
    // Collect all items
    const rows: string[] = [];
    rows.push('Item Name,Box Name,Area'); // Header

    items.forEach(item => {
      const box = boxes.find(b => b.id === item.boxId);
      const boxName = box ? box.label : "Unassigned";
      const room = box ? box.room : "Unknown";

      // Escape quotes
      const esc = (s: string) => (s || '').replace(/"/g, '""');
      rows.push(`"${esc(item.name)}","${esc(boxName)}","${esc(room)}"`);
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moove-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Inventory CSV exported');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        // Simple validation check
        if (!data.boxes && !data.items && !data.checklistTasks) {
           throw new Error("Invalid backup file");
        }

        if (confirm("This will overwrite your current data with the backup. Continue?")) {
            importData(data);
            toast.success('Data restored successfully!');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to import. Invalid file.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };



  const handleReset = () => {
    if (confirm('Are you sure? This will delete ALL your data and cannot be undone.')) {
      resetData();
      toast.success('App reset to factory settings');
    }
  };

  const navigate = useNavigate();

  const handleReplayTour = () => {
    setHasSeenOnboarding(false);
    startOnboarding();
    navigate('/');
  };
  
  const handleChangeName = () => {
      const newName = prompt('Enter your name:', userName || '');
      if (newName) {
          setUserName(newName);
          toast.success('Name updated');
      }
  };

  return (
    <PageLayout
      header={({ compact }) => (
        <HeroBanner 
          title="Settings"
          subtitle="Tweak your Moove. Replay the tour anytime."
          imageSrc={CowSettings}
          imageAlt="Settings Mascot"
          compact={compact}
        />
      )}
    >
      <div className="pb-32 min-h-screen text-white p-4 space-y-6">
        
        {/* Move Details */}
        <section>
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Move Details</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-4">
             {/* Move Date */}
             <div>
                <label className="text-xs text-zinc-400 font-medium mb-1.5 block ml-1">Move Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="date"
                        value={moveDate || ''}
                        onChange={(e) => setMoveDate(e.target.value || null)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
                    />
                </div>
             </div>

             <AddressSearch 
                 label="From" 
                 value={fromAddress}
                 onChange={(addr, coords) => setFromAddress(addr, coords)}
                 placeholder="Current address"
             />

             <AddressSearch 
                 label="To" 
                 value={toAddress}
                 onChange={(addr, coords) => setToAddress(addr, coords)}
                 placeholder="New address"
             />
             
             <div className="grid grid-cols-2 gap-3 pt-2">
                 <button 
                     onClick={handleCalculateDistance}
                     disabled={isCalculating || !fromCoords || !toCoords}
                     className={clsx(
                         "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all",
                         isCalculating || !fromCoords || !toCoords
                             ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                             : "bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/20"
                     )}
                 >
                     {isCalculating ? (
                         <>
                            <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Calculating...
                         </>
                     ) : (
                         <>
                            <RefreshCw className="w-4 h-4" /> Recalculate
                         </>
                     )}
                 </button>
                 
                 <button 
                     onClick={handleClearAddresses}
                     className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all"
                 >
                     <Trash2 className="w-4 h-4" /> Clear
                 </button>
             </div>
          </div>
        </section>

        {/* Help & Personalization */}
        <section>
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Help</h2>
          <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 divide-y divide-zinc-800/50">
            <button 
              onClick={handleReplayTour}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <PlayCircle className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <span className="font-medium block text-white">How to Moove</span>
                <span className="text-xs text-zinc-500">Replay the guided tour</span>
              </div>
            </button>

            <button 
              onClick={handleChangeName}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <User className="w-5 h-5 text-zinc-400" />
              <div className="text-left">
                <span className="font-medium block text-white">Change Name</span>
                <span className="text-xs text-zinc-500">Current: {userName || 'Not set'}</span>
              </div>
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Data</h2>
          <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 divide-y divide-zinc-800/50">
            <button 
              onClick={handleExportJSON}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <Download className="w-5 h-5 text-zinc-400" />
              <div className="text-left">
                <span className="font-medium block text-white">Backup Data (JSON)</span>
                <span className="text-xs text-zinc-500">Save full app state</span>
              </div>
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <Upload className="w-5 h-5 text-zinc-400" />
              <div className="text-left">
                <span className="font-medium block text-white">Import Data (JSON)</span>
                <span className="text-xs text-zinc-500">Restore from backup</span>
              </div>
            </button>
            <input 
               type="file" 
               accept=".json" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={handleImportJSON}
            />

            <button 
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <FileText className="w-5 h-5 text-zinc-400" />
              <div className="text-left">
                <span className="font-medium block text-white">Export Inventory (CSV)</span>
                <span className="text-xs text-zinc-500">Item Name | Box | Area</span>
              </div>
            </button>
            
            <button 
              onClick={handleReset}
              className="w-full flex items-center gap-3 p-4 hover:bg-red-900/10 transition-colors text-red-400"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Reset All Data</span>
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2 px-2">
            Your data is stored locally on this device. Clearing your browser cache will remove it.
          </p>
        </section>

        {/* About */}
        <section>
          <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">About</h2>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden">
                 <img 
                  src={MooAbout} 
                  alt="Moo" 
                  className="w-full h-full object-cover opacity-80"
                />
            </div>
            <h3 className="font-bold text-white">Moove App</h3>
            <p className="text-zinc-400 text-sm">v1.0.0</p>
            <p className="text-zinc-500 text-xs">Made with 🧡 by a Serial Moo-ver</p>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
