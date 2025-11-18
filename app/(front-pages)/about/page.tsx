import AboutEssenceSection from "../components/about/AboutEssence";
import SignatureExperienceGallery from "../components/about/AboutGallery";
import AboutHero from "../components/about/AboutHero";
import AboutDesignPhilosophy from "../components/about/AboutPhilosophy";
import AboutStoryOfAurelia from "../components/about/AboutStory";
import SmoothScrollLayout from "../components/SmoothScrollLayout";

const page = () => {
  return (
    <SmoothScrollLayout pages={8}>
      <AboutHero />
      <AboutStoryOfAurelia />
      <AboutEssenceSection />
      <SignatureExperienceGallery />
      <AboutDesignPhilosophy />
      {/* next sections go here: Philosophy, Values, Timeline, etc. */}
    </SmoothScrollLayout>
  );
};

export default page;
