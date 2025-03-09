import React, { useState } from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import AllPhoto from "../../components/AllPhoto/AllPhoto";
import Auctions from "../../components/Auctions/Auctions";
import Vote from "../../components/Vote/Vote";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";
import NavBar from "../../components/NavBar/NavBar";

const HomePage: React.FC = () => {
  // Artık üç durumumuz var: "photos" | "auctions" | "vote"
  const [activeSection, setActiveSection] = useState<"photos" | "auctions" | "vote">("photos");

  // Purchase butonuna tıklanınca AllPhoto (photos) göster
  const handlePhotosClick = () => {
    setActiveSection("photos");
  };

  // Aucktion butonuna tıklanınca Auctions (auctions) göster
  const handleAuctionClick = () => {
    setActiveSection("auctions");
  };

  // Vote metnine tıklanınca Vote bileşenini (vote) göster
  const handleVoteClick = () => {
    setActiveSection("vote");
  };

  return (
    <div>
      <NavBar />
      <HeroSection />
      
      {/* NavBarMiddle'e ilgili callback'leri prop olarak gönderiyoruz */}
      <NavBarMiddle
        onAuctionClick={handleAuctionClick}
        onPhotosClick={handlePhotosClick}
        onVoteClick={handleVoteClick}
      />
      
      {/* activeSection'a göre hangi bileşenin görüneceğini belirliyoruz */}
      {activeSection === "photos" && <AllPhoto />}
      {activeSection === "auctions" && <Auctions />}
      {activeSection === "vote" && <Vote />}
    </div>
  );
};

export default HomePage;
