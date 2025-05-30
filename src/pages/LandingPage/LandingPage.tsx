import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import RandomPhotos from "../../components/RandomPhotos/RandomPhotos";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";
import NavBar from "../../components/NavBar/NavBar";

const LandingPage: React.FC = () => {
	return (
		<div>
			<NavBar />
			<HeroSection onCategorySearch={() => {}} />
			<NavBarMiddle
			activeTab="purchasablePhotos" // veya "categories" ya da uygun olan başka bir default
			onAuctionClick={() => {}}
			onPurchasablePhotosClick={() => {}}
			onVoteClick={() => {}}
			onCategoriesClick={() => {}}
			/>
			<RandomPhotos />
		</div>
	);
};

export default LandingPage;
