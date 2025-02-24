import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import FileUpload from "../../components/FileUpload/FileUpload";
import NavBarMiddle from "../../components/NavBarMiddle/NavBarMiddle";

const LandingPage: React.FC = () => {
    return (
        <div>
            <HeroSection />
            <NavBarMiddle />
            <FileUpload />
        </div>
    );
};

export default LandingPage;