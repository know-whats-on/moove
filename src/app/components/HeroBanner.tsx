import clsx from 'clsx';

interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  secondaryTitle?: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  compact?: boolean;
}

export function HeroBanner({ 
  title, 
  secondaryTitle, 
  subtitle, 
  imageSrc, 
  imageAlt = "Mascot",
  compact = false,
  className,
  ...props 
}: HeroBannerProps) {
  return (
    <div 
      className={clsx(
        "relative bg-zinc-900 overflow-hidden flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        compact ? "min-h-[120px] p-4 pt-12" : "min-h-[220px] sm:min-h-[260px] p-6 pt-12",
        className
      )}
      {...props}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent z-10 pointer-events-none" />

      <div className={clsx(
          "relative z-20 flex flex-col transition-all duration-500",
          compact ? "gap-0" : "gap-1 max-w-[60%] sm:max-w-[50%]"
      )}>
         <h1 className={clsx(
             "font-bold text-[#D0A100] tracking-tight transition-all duration-500 origin-left",
             compact ? "text-xl" : "text-3xl sm:text-5xl"
         )}>
           {title}
         </h1>
         {secondaryTitle && (
           <h1 className={clsx(
               "font-bold text-white break-words tracking-tight transition-all duration-500 origin-left",
               compact ? "text-xl" : "text-3xl sm:text-5xl"
           )}>
             {secondaryTitle}
           </h1>
         )}
         {subtitle && (
           <div className={clsx(
               "transition-all duration-500 overflow-hidden",
               compact ? "max-h-0 opacity-0 mt-0" : "max-h-[100px] opacity-100 mt-2"
           )}>
               <p className="text-zinc-400 text-sm max-w-md font-medium">
                 {subtitle}
               </p>
           </div>
         )}
      </div>
      
      {/* Mascot Image - Bottom Flush */}
      <div className={clsx(
          "absolute bottom-0 right-0 pointer-events-none z-0 transition-all duration-500 origin-bottom-right",
          compact ? "h-[90%] opacity-80" : "h-[70%] sm:h-[80%]"
      )}>
           <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="h-full w-auto object-contain object-bottom"
          />
      </div>
    </div>
  );
}
