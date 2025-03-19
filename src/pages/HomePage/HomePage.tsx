// HomePage.tsx
import React, { useState } from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import AllPhoto from "../../components/AllPhoto/AllPhoto";
import Auctions from "../../components/Auctions/Auctions";
import Vote from "../../components/Vote/Vote";
import CategoriesPage from "../Categories/Categories";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";
import NavBar from "../../components/NavBar/NavBar";

const HomePage: React.FC = () => {
  // Artık dört durumumuz var: "photos" | "auctions" | "vote" | "categories"
  const [activeSection, setActiveSection] = useState<"photos" | "auctions" | "vote" | "categories">("photos");

  const handlePhotosClick = () => setActiveSection("photos");
  const handleAuctionClick = () => setActiveSection("auctions");
  const handleVoteClick = () => setActiveSection("vote");
  const handleCategoriesClick = () => setActiveSection("categories");

  return (
    <div>
      <NavBar />
      <HeroSection />

      <NavBarMiddle
        onAuctionClick={handleAuctionClick}
        onPhotosClick={handlePhotosClick}
        onVoteClick={handleVoteClick}
        onCategoriesClick={handleCategoriesClick}
      />

      {activeSection === "photos" && <AllPhoto />}
      {activeSection === "auctions" && <Auctions />}
      {activeSection === "vote" && <Vote />}
      {activeSection === "categories" && <CategoriesPage />}
    </div>
  );
};

export default HomePage;
