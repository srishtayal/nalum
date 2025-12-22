import Hero from '@/components/home/Hero';
import IconCtaSection from '@/components/home/IconCtaSection';
import NewsSection from '@/components/home/NewsSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import GivingSection from '@/components/home/GivingSection';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <IconCtaSection />
      <NewsSection />
      <BenefitsSection />
      <GivingSection />
    </main>
  );
};

export default HomePage;
