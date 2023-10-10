import React from 'react';
import styled from 'styled-components';

interface SliderProps {
	toggleTheme: () => void;
	isDarkTheme: boolean;
}

const Slider: React.FC<SliderProps> = ({ toggleTheme, isDarkTheme }) => {
	const onToggle = () => {
		toggleTheme();
	};

	return (
		<SliderStyled>
			<div>
				<label className="switch">
					<input type="checkbox" onChange={onToggle} checked={isDarkTheme} />
					<span className="slider" />
				</label>
				<p>Toggle Light/Dark Mode</p>
			</div>
		</SliderStyled>
	);
};

const SliderStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: [ 'Inter', 'ui-sans-serif', 'system-ui' ];
	margin-top: 20px;
	.switch {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 20px;
	}
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 50%;
		left: 0;
		width: 40px;
		height: 20px;
		background-color: ${props => props.theme.background};
		border: 1px solid ${props => props.theme.gray.light};
		transition: 0.4s;
		border-radius: 10px;
	}
	.slider:before {
		position: absolute;
		content: '';
		height: 12px;
		width: 12px;
		left: 4px;
		top: 3px; /* one less to center with 1px border */
		background-image: ${props => props.theme.primary};
		border-radius: 50%;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-image: ${props => props.theme.primary};
	}

	input:checked + .slider:before {
		transform: translateX(18px);
		background-image: none;
		background-color: ${props => props.theme.background};
	}
	p {
		margin-top: 10px;
		color: ${props => props.theme.text};
	}
`;

export default Slider;
