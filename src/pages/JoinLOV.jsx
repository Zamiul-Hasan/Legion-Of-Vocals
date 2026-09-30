import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Container from "../components/UI/Container";
import BackButton from "../components/UI/BackButton";
import JoinHero from "../components/Auth/JoinLOV/JoinHero";
import RegisterStepper from "../components/Auth/JoinLOV/RegisterStepper";

function JoinLOV() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-28 pb-24">
        <Container>
          <div className="space-y-6">
            <div>
              <BackButton label="Back" fallback="/" variant="subtle" />
            </div>
            <JoinHero />
            <RegisterStepper />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default JoinLOV;