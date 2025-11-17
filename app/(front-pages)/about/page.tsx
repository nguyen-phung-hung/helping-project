import AboutEssenceSection from "../components/about/AboutEssence";
import SignatureExperienceGallery from "../components/about/AboutGallery";
import AboutHero from "../components/about/AboutHero";

const page = () => {
  return (
    <>
      <AboutHero />
      <AboutEssenceSection />
      <SignatureExperienceGallery />
      {/* next sections go here: Philosophy, Values, Timeline, etc. */}
    </>
  );
};

export default page;
