import { Button } from "@mui/material";
import styled from "styled-components";

export const SecondaryButton = styled(Button)`
	&& {
		background-color: #f50057;
		color: white;
		padding: 6px 16px;
		font-weight: bold;
		border-radius: 4px;

		&:hover {
			opacity: 0.85;
		}
	}
`;
