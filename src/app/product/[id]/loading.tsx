export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-foreground/5 rounded-[2rem] animate-pulse"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 aspect-square bg-foreground/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Details Skeleton */}
          <div className="flex flex-col justify-center">
            <div className="h-4 w-24 bg-primary/10 rounded-full animate-pulse mb-6"></div>
            <div className="h-10 w-3/4 bg-foreground/5 rounded-xl animate-pulse mb-4"></div>
            <div className="h-8 w-1/3 bg-foreground/5 rounded-xl animate-pulse mb-8"></div>
            
            <div className="h-px w-full bg-foreground/10 my-8"></div>
            
            <div className="space-y-4 mb-8">
              <div className="h-4 w-full bg-foreground/5 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-foreground/5 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-foreground/5 rounded animate-pulse"></div>
            </div>
            
            <div className="h-14 w-full bg-foreground/5 rounded-full animate-pulse mt-4"></div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
