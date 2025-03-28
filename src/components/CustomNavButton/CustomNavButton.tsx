import React from "react";
import { Button } from "@mui/material";
import styled from "styled-components";

interface CustomNavButtonProps {
	children: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}

const StyledButton = styled(Button)<CustomNavButtonProps>`
	color: ${(props) => (props.isActive ? "#fff" : "#555")};
	background-color: ${(props) => (props.isActive ? "#000" : "transparent")};
	border-radius: 50px;
	border-color: black;
	text-transform: none;
	font-size: 1.2rem;
	padding: 10px 20px;
	transition: all 0.3s ease-in-out;
	&:hover {
		background-color: ${(props) => (props.isActive ? "#222" : "#111")};
		color: white;
	}
`;

const CustomNavButton: React.FC<CustomNavButtonProps> = ({ children, isActive, onClick }) => {
	return (
		<StyledButton variant={isActive ? "contained" : "outlined"} onClick={onClick} isActive={isActive}>
			{children}
		</StyledButton>
	);
};

export default CustomNavButton;
