import React, { useState } from 'react';
import styled from 'styled-components';

interface TabProps {
	tabs: string[];
}

const TabBar: React.FC<TabProps> = ({ tabs }) => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};

	return (
		<TabBarStyled>
			<ul className="tab-list">
				{tabs.map((tab, index) => (
					<li
						key={index}
						className={`tab ${activeTab === index ? 'active' : ''}`}
						onClick={() => handleTabClick(index)}>
						{tab}
						{activeTab === index && <div className="tab-line" />}
					</li>
				))}
			</ul>
		</TabBarStyled>
	);
};

const TabBarStyled = styled.div`
	display: flex;
	align-items: center;
	font-family: [ 'Inter', 'ui-sans-serif', 'system-ui' ];

	.tab-list {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tab {
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 10px 20px;
		align-items: center;
		cursor: pointer;
		font-size: 14px;
		transition: 0.4s;
		color: ${props => props.theme.gray.dark};
		border-bottom: 1px solid ${props => props.theme.gray.dark};

		&.active {
			color: ${props => props.theme.text};
		}
	}

	.tab-line {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 3px;
		background-image: ${props => props.theme.primary};
		transform: translateX(0);
		transition: 0.4s;
	}
`;

export default TabBar;
