"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 flex flex-col gap-10"
          >
            <div>
              <h3 className="text-[28px] font-bold mb-10 text-[#1a1a1a]">Contact Information</h3>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#eff4f0] flex items-center justify-center shrink-0 border border-[#e1e9e3]">
                    <Mail className="w-5 h-5 text-[#4a5d4e]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase mb-1">Email Us</p>
                    <a href="mailto:tribetoy2025@gmail.com" className="text-[17px] font-bold text-[#1a1a1a] hover:text-[#4a5d4e] transition-colors">tribetoy2025@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 group">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#eff4f0] flex items-center justify-center shrink-0 border border-[#e1e9e3]">
                    <Phone className="w-5 h-5 text-[#4a5d4e]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase mb-1">Call Us</p>
                    <a href="tel:+918099962939" className="text-[17px] font-bold text-[#1a1a1a] hover:text-[#4a5d4e] transition-colors">(+91) 8099962939</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 group">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#eff4f0] flex items-center justify-center shrink-0 border border-[#e1e9e3]">
                    <MapPin className="w-5 h-5 text-[#4a5d4e]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase mb-1">Visit Us</p>
                    <p className="text-[17px] font-bold text-[#1a1a1a] leading-snug">Technology Incubation Centre (TIC),<br />IIT Guwahati, Assam, 781039</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#586b59] rounded-[2rem] p-10 text-white mt-4">
              <h3 className="text-2xl font-bold mb-4 pr-10">Looking for custom bulk orders?</h3>
              <p className="text-white/80 font-medium mb-10 text-sm leading-relaxed">We handle corporate gifting, educational kits, and large-scale 3D printing arrays.</p>
              
              <Link href="/customization" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#586b59] font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
                Explore Customization <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2rem] p-4 md:p-8 lg:p-12 relative">
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center h-[500px] animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 rounded-full bg-[#eff4f0] flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-12 h-12 text-[#4a5d4e]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1a1a1a] mb-4">Message Sent!</h3>
                  <p className="text-[#5a6b5e] text-lg font-medium max-w-sm mb-10">
                    Thank you for reaching out. Our team will get back to you within 24-48 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-4 rounded-full border border-black/10 font-bold uppercase tracking-widest text-xs text-[#5a6b5e] hover:bg-black/5 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">First Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        placeholder="John" 
                        className="w-full px-6 py-4 rounded-3xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Last Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Doe" 
                        className="w-full px-6 py-4 rounded-3xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      className="w-full px-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Subject</label>
                    <select 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-6 py-4 rounded-full bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] appearance-none"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="general">General Inquiry</option>
                      <option value="custom">Custom Bulk Orders</option>
                      <option value="workshop">Workshop Booking</option>
                      <option value="partnership">Partnerships</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Your Message</label>
                    <textarea 
                      required
                      rows={6}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us about your project..." 
                      className="w-full px-6 py-5 rounded-[2rem] bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60 resize-none"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="mt-6 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    {!isSubmitting && <Send className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
