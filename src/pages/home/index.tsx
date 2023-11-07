import React from 'react';
import styled from '@emotion/styled';

const Home = () => {
	return (
		<div>
			<p>Page to be deleted</p>
		</div>
	);
};

const Container = styled.div`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

const Title = styled.h4`
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 36px;
	line-height: 130%;
	margin: 0 0 10px;
`;

const Card = styled.div`
	align-items: center;
	display: flex;
	justify-content: space-between;
	text-align: left;

	@media (max-width: 769px) {
		padding: 50px 0 0;
	}
`;

const TabText = styled.p`
	cursor: pointer;
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	color: #ffffff80;

	&.active {
		color: #ffffff;
	}

	@media (max-width: 830px) {
		font-size: 18px;
	}

	@media (max-width: 426px) {
		width: max-content;
	}
`;

const Divider = styled.span`
	border: 1px solid #ffffff;
	height: 20px;
	margin: 0 20px;
`;

const Heading = styled.div`
	align-items: center;
	display: flex;
	margin-top: 30px;

	@media (max-width: 958px) {
		margin-top: unset;
	}

	@media (max-width: 729px) {
		justify-content: center;
	}

	@media (max-width: 426px) {
		overflow: auto;
	}
`;

export default Home;
