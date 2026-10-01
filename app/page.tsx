import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { SplitHero } from "@/components/sections/home/SplitHero";
import { OurProducts } from "@/components/sections/home/OurProducts";
import { TaglineMarquee } from "@/components/sections/home/TaglineMarquee";
import { StoryPinned } from "@/components/sections/home/StoryPinned";
import { HowItWorks } from "@/components/sections/home/HowItWorks";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { InstagramGrid } from "@/components/sections/home/InstagramGrid";
import { Newsletter } from "@/components/sections/home/Newsletter";

export const metadata: Metadata = {
  title: { absolute: "RJS Foods | Tok Bah Heritage Meals & Mak 'Chic' Keropok, Singapore" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div data-brand="rjs">
      <SplitHero />
      {/* All products directly under the hero (and its trust strip). Replaces the featured carousel. */}
      <OurProducts />
      <TaglineMarquee />
      <StoryPinned />
      <HowItWorks />
      <Testimonials />
      <InstagramGrid />
      <Newsletter />
    </div>
  );
}
