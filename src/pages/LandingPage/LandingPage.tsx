import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import RandomPhotos from "../../components/RandomPhotos/RandomPhotos";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";
import NavBar from "../../components/NavBar/NavBar";

const LandingPage: React.FC = () => {
	return (
		<div>
			<NavBar />
			<HeroSection />
			<NavBarMiddle onAuctionClick={() => {}} onPhotosClick={() => {}} onVoteClick={() => {}} onCategoriesClick={() => {}} />
			<RandomPhotos />
		</div>
	);
};

export default LandingPage;
