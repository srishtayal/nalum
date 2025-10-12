import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { useEffect } from "react";
const Index = () => {
  // a sample api call to check if the backend is working
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");
        console.log("Backend is working:", response.data);
      } catch (error) {
        console.error("Error checking backend:", error);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <Header />
      </div>
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
