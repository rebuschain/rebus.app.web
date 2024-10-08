import React, { useState } from 'react';
import styled from 'styled-components';

interface CheckboxProps {
	label: string;
	labelStyle?: React.CSSProperties;
	style?: React.CSSProperties;
	onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, style, labelStyle, onChange }) => {
	const [checked, setChecked] = useState(false);

	const handleCheckboxChange = () => {
		setChecked(!checked);
		onChange();
	};

	return (
		<CheckboxStyled style={style}>
			<label className={`checkbox-label ${checked ? 'checked' : ''}`} style={labelStyle}>
				<input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
				<span className="checkmark">&#10003;</span>
				{label}
			</label>
		</CheckboxStyled>
	);
};

const CheckboxStyled = styled.div`
	font-family: Inter, ui-sans-serif, system-ui;

	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: 18px;
		position: relative;
		color: ${props => props.theme.text};

		input {
			display: none;
		}

		.checkmark {
			width: 24px;
			height: 24px;
			border: 3px solid ${props => props.theme.gray.light};
			font-size: 24px;
			background-color: transparent;
			margin-right: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: transparent;
		}

		&.checked {
			.checkmark {
				background-image: ${props => props.theme.primary};
				color: ${props => props.theme.background};
				border: none;
			}
		}
	}
`;

export default Checkbox;
