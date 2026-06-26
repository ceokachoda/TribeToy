export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1600px]">
        
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="h-4 w-32 bg-primary/10 rounded-full animate-pulse mb-4"></div>
            <div className="h-12 w-64 md:w-96 bg-foreground/5 rounded-2xl animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-foreground/5 rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-foreground/5 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Filters and Grid Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0 hidden lg:block">
            <div className="h-8 w-40 bg-foreground/5 rounded-lg animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 w-full bg-foreground/5 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[4/5] bg-foreground/5 rounded-3xl animate-pulse"></div>
                  <div className="h-4 w-1/3 bg-foreground/5 rounded animate-pulse"></div>
                  <div className="h-5 w-2/3 bg-foreground/5 rounded animate-pulse"></div>
                  <div className="h-4 w-1/4 bg-foreground/5 rounded animate-pulse mt-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
