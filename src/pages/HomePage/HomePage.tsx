import React, { useState } from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import PurchasablePhotos from "../../components/PurchasablePhotos/PurchasablePhotos";
import Auctions from "../../components/Auctions/Auctions";
import Vote from "../../components/Vote/Vote";
import CategoriesPage from "../Categories/Categories";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";
import NavBar from "../../components/NavBar/NavBar";

const HomePage: React.FC = () => {
	const [activeSection, setActiveSection] = useState<"purchasablePhotos" | "auctions" | "vote" | "categories">("purchasablePhotos");

	const onPurchasablePhotosClick = () => setActiveSection("purchasablePhotos");
	const handleAuctionClick = () => setActiveSection("auctions");
	const handleVoteClick = () => setActiveSection("vote");
	const handleCategoriesClick = () => setActiveSection("categories");

	return (
		<div>
			<NavBar />
			<HeroSection />

			<NavBarMiddle onAuctionClick={handleAuctionClick} onPurchasablePhotosClick={onPurchasablePhotosClick} onVoteClick={handleVoteClick} onCategoriesClick={handleCategoriesClick} />

			{activeSection === "purchasablePhotos" && <PurchasablePhotos />}
			{activeSection === "auctions" && <Auctions />}
			{activeSection === "vote" && <Vote />}
			{activeSection === "categories" && <CategoriesPage />}
		</div>
	);
};

export default HomePage;
