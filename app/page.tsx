import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { OpenSource } from "@/components/OpenSource";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhyVouch } from "@/components/WhyVouch";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <WhyVouch />
        <HowItWorks />
        <OpenSource />
      </main>
      <SiteFooter />
    </>
  );
}
