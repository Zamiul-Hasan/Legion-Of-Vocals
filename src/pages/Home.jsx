import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import ContestLaunchBanner from "../components/Contest/ContestLaunchBanner";
import Announcement from "../components/Announcement/Announcement";
import FeaturedProjects from "../components/FeaturedProjects/FeaturedProjects";
import AboutSection from "../components/About/AboutSection";
import GalleryPreview from "../components/Gallery/GalleryPreview";
import CTASection from "../components/CTA/CTASection";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ContestLaunchBanner isCompactHome={true} />
      <AboutSection />
      <Announcement />
      <FeaturedProjects />
      <GalleryPreview />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;