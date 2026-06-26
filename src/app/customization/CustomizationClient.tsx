"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function CustomizationClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast("File is too large (max 5MB)", "error");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    let reference_image_url = null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Upload file if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        // The bucket user-uploads expects the file to be under user's id folder if we follow typical RLS.
        // Wait, the RLS policy for user-uploads says:
        // CREATE POLICY "Users can upload their own files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
        // So the folder must be the user's uid. Let's use anonymous approach if not logged in.
        // Wait, if not logged in, they can't upload to user-uploads if RLS enforces auth.uid().
        // Let me check if user is logged in.
        
        let filePath = "";
        if (userId) {
          filePath = `${userId}/${Date.now()}.${fileExt}`;
        } else {
          // If no user, maybe we put in an anonymous folder? But RLS requires auth.uid()
          showToast("You must be logged in to upload images.", "error");
          setIsSubmitting(false);
          return;
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("user-uploads")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("user-uploads")
          .getPublicUrl(filePath);

        reference_image_url = urlData.publicUrl;
      }

      // Insert into customizations
      const { error: insertError } = await supabase
        .from("customizations")
        .insert({
          user_id: userId || null,
          name,
          email,
          description,
          reference_image_url
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      showToast("Custom request submitted successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred while submitting.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-24 relative z-10 max-w-4xl text-center">
        <div className="bg-white rounded-[2rem] p-12 border border-black/5 shadow-xl inline-flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#eff4f0] flex items-center justify-center mb-8">
            <CheckCircle2 className="w-12 h-12 text-[#4a5d4e]" />
          </div>
          <h3 className="text-3xl font-bold text-[#1a1a1a] mb-4">Request Received!</h3>
          <p className="text-[#5a6b5e] text-lg font-medium max-w-md mb-10">
            Our engineers are reviewing your custom 3D printing requirements. We'll be in touch at {email} within 24-48 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-8 py-4 rounded-full border border-black/10 font-bold uppercase tracking-widest text-xs text-[#5a6b5e] hover:bg-black/5 transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 relative z-10 max-w-4xl">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-xl">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#4a5d4e]/20 bg-[#eff4f0] mb-6 shadow-sm"
          >
            <Sparkles size={16} className="text-[#4a5d4e]" />
            <span className="text-xs font-black tracking-widest text-[#4a5d4e] uppercase">Custom Request</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground">Tell us what you need</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Full Name *</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full px-6 py-4 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Email Address *</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" 
                className="w-full px-6 py-4 rounded-2xl bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Project Description *</label>
            <textarea 
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea, dimensions, materials, or any specific requirements..." 
              className="w-full px-6 py-5 rounded-[2rem] bg-[#f4f5f4] border border-transparent focus:border-[#4a5d4e]/30 focus:bg-white focus:ring-4 focus:ring-[#4a5d4e]/10 transition-all outline-none font-medium text-[#1a1a1a] placeholder:text-[#8a958c]/60 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] text-[#8a958c] uppercase ml-1">Reference Image (Optional)</label>
            <div className="relative">
              <input 
                type="file" 
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="file-upload"
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#f4f5f4] border border-dashed border-[#8a958c]/40 hover:border-[#4a5d4e] hover:bg-[#eff4f0] cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Upload className="w-5 h-5 text-[#4a5d4e]" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm text-[#1a1a1a] truncate">
                    {file ? file.name : "Upload a reference image"}
                  </span>
                  <span className="text-xs font-medium text-[#8a958c]">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Max 5MB (JPEG, PNG)"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            type="submit" 
            className="mt-6 w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#2a2a2a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
          >
            <span>{isSubmitting ? "Submitting..." : "Submit Request"}</span>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
