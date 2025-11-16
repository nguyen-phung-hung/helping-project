import { GlobalBackground } from "@/components/GlobalBackground";
import Navigation from "./components/navigation";
import SmoothScrollLayout from "./components/SmoothScrollLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {/* Global dark glow + grain behind everything */}
      <GlobalBackground />

      <main className="min-h-screen flex flex-col items-center relative">
        <SmoothScrollLayout pages={7}>{children}</SmoothScrollLayout>
      </main>
    </>
  );
};

export default Layout;
