import React, { FunctionComponent } from 'react';
import gettingStarted from 'src/assets/nft-id-quiz/quiz-passing.png';

type GettingStartedProps = {
	onClick: () => void;
};

const GettingStarted: FunctionComponent<React.PropsWithChildren<GettingStartedProps>> = ({ onClick }) => {
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
			<button onClick={onClick} className="bg-blue1 py-2 px-15 rounded-lg mt-6">
				Get Started
			</button>
		</>
	);
};

export default GettingStarted;
