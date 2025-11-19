import ContactConciergeHero from "../components/contact/ContactConciergeHero";
import ContactQuietDetailsSection from "../components/contact/ContactQuietDetailsSection";
import SmoothScrollLayout from "../components/SmoothScrollLayout";

const page = () => {
  return (
    <SmoothScrollLayout pages={2.5}>
      <ContactConciergeHero />
      <ContactQuietDetailsSection />
      {/* later you can add the small “Finding your way” info strip below */}
    </SmoothScrollLayout>
  );
};

export default page;
