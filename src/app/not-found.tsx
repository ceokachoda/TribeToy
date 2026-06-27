import Link from 'next/link';
import { FiHome, FiArrowLeft, FiSearch, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Animated 404 Graphic */}
        <div className="relative flex justify-center items-center h-48 sm:h-64 mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <h1 className="text-[120px] sm:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-700 tracking-tighter drop-shadow-sm leading-none relative z-10">
            404
          </h1>
          <div className="absolute bottom-4 right-1/4 sm:right-1/3 bg-white p-3 rounded-full shadow-lg border border-slate-100 animate-bounce">
            <FiAlertCircle className="w-8 h-8 text-rose-500" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            The page you're looking for seems to have vanished into thin air. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Go Back Home
          </Link>
          <Link 
            href="/shop"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-600 border-2 border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
          >
            Browse Shop
          </Link>
        </div>
        
      </div>
    </div>
  );
}
