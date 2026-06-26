import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#f4f5f4] flex flex-col items-center justify-center relative overflow-hidden pt-20">
      {/* Background Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-[#4a5d4e]/5 rounded-full blur-[80px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-6xl px-6">
        {/* Animated Brand */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-heading font-extrabold text-5xl tracking-tight text-[#1a1a1a]">
            Tribe<span className="text-[#4a5d4e] animate-pulse">Toy</span>
          </span>
          <div className="flex gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-[#4a5d4e] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#4a5d4e] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#4a5d4e] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Skeleton Grid (Generic "Exoskeleton" representing content loading) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full opacity-40">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full aspect-square rounded-[2rem] bg-black/5 animate-pulse" />
              <div className="w-3/4 h-4 rounded-full bg-black/5 animate-pulse" />
              <div className="w-1/2 h-4 rounded-full bg-black/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
