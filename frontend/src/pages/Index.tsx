import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import axios from "axios";
import { useEffect } from "react";
const Index = () => {
  // a sample api call to check if the backend is working
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get("https://nalum-p4wh.onrender.com/health");
        console.log("Backend is working:", response.data);
      } catch (error) {
        console.error("Error checking backend:", error);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
