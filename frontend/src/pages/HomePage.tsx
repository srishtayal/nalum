import Hero from '@/components/home/Hero';
import IconCtaSection from '@/components/home/IconCtaSection';
import NewsSection from '@/components/home/NewsSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import GivingSection from '@/components/home/GivingSection';
import SocialMediaSection from '@/components/home/SocialMediaSection';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <IconCtaSection />
      <NewsSection />
      <BenefitsSection />
      <GivingSection />
      <SocialMediaSection />
    </div>
  );
};

export default HomePage;