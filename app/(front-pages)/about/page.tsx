import AboutEssenceSection from "../components/about/AboutEssence";
import SignatureExperienceGallery from "../components/about/AboutGallery";
import AboutHero from "../components/about/AboutHero";
import AboutDesignPhilosophy from "../components/about/AboutPhilosophy";

const page = () => {
  return (
    <>
      <AboutHero />
      <AboutEssenceSection />
      <SignatureExperienceGallery />
      <AboutDesignPhilosophy />
      {/* next sections go here: Philosophy, Values, Timeline, etc. */}
    </>
  );
};

export default page;
