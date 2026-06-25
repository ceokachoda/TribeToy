"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Leaf, GraduationCap, Users, Lightbulb, Map, PenTool, CheckCircle2, HeartHandshake } from "lucide-react";

const whatWeDoFeatures = [
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Eco-Friendly & Safe",
    description: "Biodegradable and completely child-safe materials.",
  },
  {
    icon: <PenTool className="w-8 h-8 text-secondary" />,
    title: "Hand Painted",
    description: "3D-printed designs accompanied by meticulous hand painting.",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-accent" />,
    title: "Assamese Heritage",
    description: "Inspired by traditional storytelling and cultural artifacts.",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
    title: "Fully Customizable",
    description: "From cultural icons to cartoon-themed educational tools.",
  },
];

const educationalFeatures = [
  {
    icon: <PenTool className="w-6 h-6 text-accent" />,
    title: "ABC Tracing Boards",
  },
  {
    icon: <Map className="w-6 h-6 text-primary" />,
    title: "India Geography Maps",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-secondary" />,
    title: "Building Blocks & Puzzles",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-16 md:pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/ghibli_hero_v2.png" 
            alt="Magical Toy Workshop" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } }
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white drop-shadow-2xl mb-6"
            >
              Welcome To <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">TribeToy</span>
            </motion.h1>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-xl md:text-3xl text-white/90 font-medium drop-shadow-lg"
            >
              Blending Tradition, Technology, and Sustainability
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Green Putola Initiative Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              The Green Putola Initiative
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-10 leading-tight">
              A unique initiative at the crossroads of <br className="hidden md:block" />
              <span className="text-secondary">traditional culture</span> & <span className="text-accent">technology.</span>
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-foreground/70 leading-relaxed mb-12 text-left md:text-center max-w-4xl mx-auto">
              <p>
                Green Putola is a unique initiative at the crossroads of traditional culture, technology, and sustainability. Born out of a collaboration between the Department of Science and Technology and IIT Guwahati, this project is implemented by TribeToy Private Limited.
              </p>
              <p>
                TribeToy empowers women from Assam's ST communities by training them in Industry 4.0-powered 3D printing technology — connecting cutting-edge innovation with grassroots creativity. This blend of high-tech and heritage forms the foundation of our mission.
              </p>
            </div>

            <blockquote className="text-2xl md:text-4xl font-heading italic font-medium text-foreground p-8 md:p-12 border-l-4 border-primary glass rounded-r-3xl relative overflow-hidden mt-12 shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
              "To craft joy while nurturing the planet."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-primary/5 relative border-y border-primary/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 text-foreground">What We Do</h2>
            <p className="text-foreground/70 text-lg">
              From Bihu dhols and Majuli masks to eco-conscious dragons, Krishna idols, and playful characters, every item tells a story — celebrating Northeast India's traditional culture while protecting the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatWeDoFeatures.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-[2rem] hover:border-primary/30 transition-all group hover:-translate-y-2 shadow-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Play Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <span className="px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            New Addition
          </span>
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-8">Learn While You <span className="text-accent">Play!</span></h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-16">
            We've added a new dimension to our product line — educational toys, puzzles, and interactive learning models for kids. These products promote hands-on learning through creative and conscious play with Green Putola toys.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {educationalFeatures.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 px-8 py-5 rounded-full glass hover:border-accent/50 hover:bg-white transition-all cursor-default shadow-sm"
              >
                <div className="p-2 bg-white rounded-full shadow-sm">{item.icon}</div>
                <span className="font-bold text-lg text-foreground">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Why Choose Us Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full relative"
            >
              <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group p-2 glass">
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
                  <Image 
                    src="/ghibli_impact.png" 
                    alt="Women Empowerment" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-6xl font-black text-secondary">75+</h3>
                      <p className="text-white/80 font-medium text-sm leading-tight">Rural women trained in sustainable, <br/> tech-enabled manufacturing</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 flex flex-col gap-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 text-foreground">Why Choose Us?</h2>
                <p className="text-lg text-foreground/70 mb-8">
                  Because with every Green Putola creation, you are investing in much more than just a toy. You are driving positive change.
                </p>
                
                <ul className="space-y-6">
                  {[
                    "Supporting women's empowerment (Over 75 rural women trained in sustainable manufacturing).",
                    "Products featured globally in education, decor, gifting, and cultural showcases.",
                    "Celebrating Assamese culture and traditional craftsmanship.",
                    "Investing in a greener, more inclusive future through technology.",
                    "Working towards becoming a full-fledged MSME with e-commerce and retail outreach."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary border border-primary/30 shadow-sm">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-foreground/80 font-medium leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-secondary mt-4 relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 blur-[40px] rounded-full" />
                <p className="text-xl font-heading font-bold text-white relative z-10 leading-relaxed drop-shadow-md">
                  "Let's build a sustainable tomorrow — one toy, one tradition, one curious child at a time."
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}
