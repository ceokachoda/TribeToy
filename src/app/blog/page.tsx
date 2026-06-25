import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { blogs } from "@/data/blogs";
import StoriesClient from "./StoriesClient";

export const metadata = {
  title: "Stories & Impact - TribeToy",
  description: "Read about our workshops, IIT collaborations, and the community impact we are making across Assam.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background pt-20 md:pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
        <StoriesClient blogs={blogs} />
      </div>
    </main>
  );
}
