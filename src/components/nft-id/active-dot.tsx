import styled from '@emotion/styled';
import { lighten } from '@mui/material';
import React from 'react';

type ActiveDotProps = {
	className?: string;
	isActive?: boolean;
	style?: React.CSSProperties;
};

const INACTIVE_COLOR = '#FB201E';
const ACTIVE_COLOR = '#42CD4A';

export const ActiveDot: React.FC<ActiveDotProps> = ({ isActive, className, style }) => (
	<Container isActive={isActive}>
		<div className="bubble">
			<span className="bubble-outer-dot">
				<span className="bubble-inner-dot" />
			</span>
		</div>
	</Container>
);

const Container = styled.div<{ isActive?: boolean }>`
	height: 14px;
	position: absolute;
	right: 10px;
	top: 10px;
	width: 14px;

	.bubble {
		opacity: 0.6;
		position: absolute;
	}

	.bubble:hover:after {
		background-color: ${props => (props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR)};
	}

	.bubble:after {
		background-color: ${props => (props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR)};
		border-radius: 50%;
		content: '';
		display: block;
		height: 12px;
		left: 1px;
		opacity: 0.6;
		position: absolute;
		top: 1px;
		width: 12px;
	}

	.bubble .bubble-outer-dot {
		margin: 1px;
		display: block;
		text-align: center;
		opacity: 1;
		background-color: ${props => lighten(props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR, 0.4)};
		width: 12px;
		height: 12px;
		border-radius: 50%;
		animation: bubble-pulse 1.6s linear infinite;
	}

	.bubble .bubble-inner-dot {
		display: block;
		text-align: center;
		opacity: 1;
		background-color: ${props => lighten(props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR, 0.4)};
		width: 12px;
		height: 12px;
		border-radius: 50%;
		animation: bubble-pulse 1.6s linear infinite;
	}

	.bubble .bubble-inner-dot:after {
		content: '';
		display: block;
		text-align: center;
		opacity: 1;
		background-color: ${props => lighten(props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR, 0.4)};
		width: 12px;
		height: 12px;
		border-radius: 50%;
		animation: bubble-pulse 1.6s linear infinite;
	}

	@keyframes bubble-pulse {
		0% {
			transform: scale(1);
			opacity: 0.75;
		}
		25% {
			transform: scale(1);
			opacity: 0.75;
		}
		85% {
			transform: scale(2.2);
			opacity: 0;
		}
		86% {
			transform: scale(1);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 0.75;
		}
	}
`;
