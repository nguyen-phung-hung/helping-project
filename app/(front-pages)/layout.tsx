import { GlobalBackground } from "@/components/GlobalBackground";
import Navigation from "./components/navigation";
import SmoothScrollLayout from "./components/SmoothScrollLayout";
import IntroSplash from "./components/IntroSlash";
import Footer from "./components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <IntroSplash />
      <Navigation />
      {/* Global dark glow + grain behind everything */}
      <GlobalBackground />

      <main className="min-h-screen flex flex-col items-center relative">
        <SmoothScrollLayout pages={7}>
          {children}
          <Footer />
        </SmoothScrollLayout>
      </main>
    </>
  );
};

export default Layout;
