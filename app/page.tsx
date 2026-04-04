import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/footer";
import { PoolGallery } from "@/components/landing/pool-gallery";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PoolGallery />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
