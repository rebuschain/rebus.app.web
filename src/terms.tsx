import React, { FunctionComponent, useState } from 'react';
import { TermsDialog } from './dialogs/terms-dialog';

export const Terms: FunctionComponent = () => {
	const [isOpen, setIsOpen] = useState(localStorage.getItem('terms_agreement') == null);

	return (
		<TermsDialog
			title="Before you begin..."
			isOpen={isOpen}
			onAgree={() => {
				setIsOpen(false);
				localStorage.setItem('terms_agreement', 'true');
			}}
			isHideCloseButton={true}>
			Rebus is a decentralized peer-to-peer blockchain that people can use to create liquidity and trade IBC enabled
			tokens. The Rebus blockchain is made up of free, public, and open-source software. Your use of Rebus involves
			various risks, including, but not limited, to losses while digital assets are being supplied to Rebus pools and
			losses due to the fluctuation of prices of tokens in a trading pair or liquidity pool, including Impermanence
			Loss. Before using any pool on the Rebus blockchain, you should review the relevant documentation to make sure you
			understand how Rebus works, and the pool you use on Rebus works. Additionally, just as you can access protocols,
			such as SMTP, through multiple email clients, you can access pools on Rebus through several web or or mobile
			interfaces. You are responsible for doing your own diligence on those interfaces to understand the fees and risks
			they present.
			<br />
			<br />
			AS DESCRIBED IN THE REBUS LICENSES, THE REBUS PROTOCOL IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT
			WARRANTIES OF ANY KIND. Although Rebus Pte. Ltd. ( “Rebuschain” ) developed much of the initial code for the Rebus
			protocol, it does not provide, own, or control the Rebus protocol, which is run by a decentralized validator set.
			Upgrades and modifications to the protocol are managed in a community-driven way by holders of the OSMO governance
			token. No developer or entity involved in creating the Rebus protocol will be liable for any claims or damages
			whatsoever associated with your use, inability to use, or your interaction with other users of the Rebus protocol,
			including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of
			profits, cryptocurrencies, tokens, or anything else of value.
		</TermsDialog>
	);
};
