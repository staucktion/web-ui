import React from "react";
import styled from "styled-components";

interface CustomNavButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const StyledButton = styled.button<CustomNavButtonProps>`
  position: relative;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  font-size: 1.4rem;
  padding: 10px 20px;
  text-transform: none;
  color: black;
  transition: all 0.3s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 2px;
    height: 2px;
    background-color: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* subtle shadow under line */
    transform: scaleX(${(props) => (props.isActive ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.3s ease-in-out;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const CustomNavButton: React.FC<CustomNavButtonProps> = ({ children, isActive, onClick }) => {
  return (
    <StyledButton onClick={onClick} isActive={isActive}>
      {children}
    </StyledButton>
  );
};

export default CustomNavButton;
