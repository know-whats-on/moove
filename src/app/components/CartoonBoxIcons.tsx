import { Package, PackageOpen } from 'lucide-react';

export const CartoonOpenBox = () => (
  <div className="w-full h-full flex items-center justify-center bg-zinc-800/50">
    <PackageOpen className="w-24 h-24 text-amber-500 drop-shadow-lg" strokeWidth={1.5} />
  </div>
);

export const CartoonSealedBox = () => (
  <div className="w-full h-full flex items-center justify-center bg-zinc-800/50">
    <Package className="w-24 h-24 text-amber-600 drop-shadow-lg" strokeWidth={1.5} />
  </div>
);
