import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { blogs } from "@/data/blogs";

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return { title: "Not Found" };

  return {
    title: `${blog.title} - TribeToy`,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-12 px-6 lg:px-12 bg-background flex flex-col items-center">
        <div className="container max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-12">
            <ArrowLeft size={16} /> Back to Stories
          </Link>

          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            {blog.tags.map(tag => (
              <span key={tag} className="text-xs md:text-sm text-primary font-black uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-foreground mb-8 leading-[1.1] max-w-4xl">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-foreground/60 font-medium text-sm md:text-base pt-6 border-t border-foreground/10 w-full max-w-2xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">Author</span>
              <span className="text-foreground font-bold">{blog.author}</span>
            </div>
            <div className="w-px h-8 bg-foreground/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">Published</span>
              <span className="text-foreground font-bold">{blog.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Cover Image */}
      <section className="container mx-auto px-6 md:px-12 max-w-[1200px] mb-16 md:mb-24">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-foreground/10">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="container mx-auto px-6 md:px-12 max-w-4xl pb-32">
        <div className="bg-white rounded-[3rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-foreground/5 p-8 md:p-16 lg:p-20 relative">
          
          <div 
            className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mb-6 prose-h2:mt-12 prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-secondary prose-li:text-foreground/80 prose-strong:text-foreground prose-strong:font-black marker:text-primary"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Event Highlights Photo Gallery */}
          <div className="mt-24 pt-16 border-t border-foreground/5">
            <div className="flex flex-col items-center mb-12">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">Visual Journey</span>
              <h3 className="text-3xl font-heading font-black text-center text-foreground">Event Highlights</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Featured Image */}
              <div className="md:col-span-8 aspect-[4/3] rounded-[2rem] bg-white border border-foreground/5 flex items-center justify-center relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(121,152,122,0.2)] transition-all duration-700">
                <Image src="/Tribetoy_blogs.png" alt="TribeToy Highlights" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  <span className="text-white font-bold tracking-widest text-xs uppercase bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">Featured Highlights</span>
                </div>
              </div>
              
              {/* Side Stack */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <div className="aspect-[4/3] md:aspect-auto md:flex-1 rounded-[2rem] bg-white border border-foreground/5 flex items-center justify-center relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(121,152,122,0.2)] transition-all duration-700">
                  <Image src="/ghibli_hero_v2.png" alt="Workshop Highlight" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]" />
                </div>
                <div className="aspect-[4/3] md:aspect-auto md:flex-1 rounded-[2rem] bg-white border border-foreground/5 flex items-center justify-center relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(121,152,122,0.2)] transition-all duration-700">
                  <Image src="/ghibli_green_putola.png" alt="Workshop Highlight" fill className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
