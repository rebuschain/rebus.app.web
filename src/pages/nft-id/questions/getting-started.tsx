import styled from '@emotion/styled';
import React, { FunctionComponent } from 'react';
import gettingStarted from 'src/assets/nft-id-quiz/quiz-passing.png';
import { Loader } from 'src/components/common/loader';

type GettingStartedProps = {
	disabled?: boolean;
	onClick: () => void;
};

const loaderStyles: React.CSSProperties = {
	height: '100%',
	justifyContent: 'left',
	left: '18px',
	position: 'absolute',
	top: '0',
};

const GettingStarted: FunctionComponent<React.PropsWithChildren<GettingStartedProps>> = ({ disabled, onClick }) => {
	return (
		<>
			<div className="image-wrapper">
				<img alt="getting-started" src={gettingStarted} />
			</div>
			<p className="title text-center text-xl-2 py-6 leading-8">
				Before you create your NFTID, lets make sure you know what it is.
			</p>
			<p className="sub-text text-center text-base text-white-mid px-8">
				You will be asked 5 questions at random, you need to answer at least 4 of them correctly.
			</p>
			<button disabled={disabled} onClick={onClick} className="bg-blue1 py-2 px-15 rounded-lg mt-6 relative">
				{disabled && <Loader className="h-7" style={loaderStyles} />}Get Started
			</button>
		</>
	);
};

export default GettingStarted;
