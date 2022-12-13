import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';

const DotsLoading: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	return (
		<Spinner className="spinner">
			<div className="bounce1" />
			<div className="bounce2" />
			<div className="bounce3" />
		</Spinner>
	);
};

const Spinner = styled.div`
	width: 70px;
	text-align: center;
	margin: auto;

	& > div {
		width: 10px;
		margin: 0 2px;
		height: 10px;
		background-color: #1923cf;
		border-radius: 100%;
		display: inline-block;
		animation: bounce_delay 1.4s infinite ease-in-out both;

		&.bounce1 {
			animation-delay: -0.32s;
		}

		&.bounce2 {
			animation-delay: -0.16s;
		}
	}

	@keyframes bounce_delay {
		0%,
		80%,
		100% {
			transform: scale(0);
		}

		40% {
			transform: scale(1);
		}
	}
`;

export default DotsLoading;
