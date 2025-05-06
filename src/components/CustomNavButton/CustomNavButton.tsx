import React from "react";
import styled from "styled-components";

interface CustomNavButtonProps {
	children: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}

const StyledButton = styled.button<{ $isActive: boolean }>`
	position: relative;
	background: none;
	border: none;
	outline: none;
	cursor: pointer;

	font-size: 1.4rem;
	padding: 10px 20px;
	color: black;
	transition: all 0.3s ease-in-out;

	&::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 2px;
		height: 2px;
		width: ${({ $isActive }) => ($isActive ? "100%" : "0%")};
		background-color: black;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		transition: width 0.3s ease-in-out;
	}

	&:hover::after {
		width: 100%;
	}

	@media (max-width: 600px) {
		font-size: 1.2rem;
		padding: 10px 2px;
	}
`;

const CustomNavButton: React.FC<CustomNavButtonProps> = ({ children, isActive, onClick }) => {
	return (
		<StyledButton onClick={onClick} $isActive={isActive}>
			{children}
		</StyledButton>
	);
};

export default CustomNavButton;
