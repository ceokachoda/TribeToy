export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="h-4 w-32 bg-primary/10 rounded-full animate-pulse mb-6"></div>
          <div className="h-12 w-64 md:w-96 bg-foreground/5 rounded-2xl animate-pulse mb-6"></div>
          <div className="h-5 w-3/4 max-w-2xl bg-foreground/5 rounded animate-pulse"></div>
        </div>

        {/* Featured Blog Skeleton */}
        <div className="mb-20">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-foreground/5 animate-pulse"></div>
          <div className="mt-8 md:mt-12 max-w-3xl mx-auto flex flex-col items-center text-center">
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-20 bg-primary/10 rounded-full animate-pulse"></div>
              <div className="h-6 w-20 bg-primary/10 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 w-full bg-foreground/5 rounded-xl animate-pulse mb-4"></div>
            <div className="h-4 w-5/6 bg-foreground/5 rounded animate-pulse mb-6"></div>
            <div className="h-10 w-32 bg-foreground/5 rounded-full animate-pulse mt-4"></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[4/3] bg-foreground/5 rounded-[2rem] animate-pulse mb-6"></div>
              <div className="h-4 w-24 bg-primary/10 rounded-full animate-pulse mb-4"></div>
              <div className="h-8 w-full bg-foreground/5 rounded-xl animate-pulse mb-3"></div>
              <div className="h-4 w-3/4 bg-foreground/5 rounded animate-pulse mb-6"></div>
              <div className="mt-auto flex justify-between items-center pt-6 border-t border-foreground/5">
                <div className="h-4 w-24 bg-foreground/5 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-foreground/5 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
