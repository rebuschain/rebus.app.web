/* eslint-disable react/no-unescaped-entities */
import React, { FunctionComponent, useState } from 'react';
import { TermsDialog } from './dialogs/terms-dialog';

export const Terms: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const [isOpen, setIsOpen] = useState(localStorage.getItem('terms_agreement') == null);

	return (
		<TermsDialog
			title="Before you enter the app..."
			isOpen={isOpen}
			onAgree={() => {
				setIsOpen(false);
				localStorage.setItem('terms_agreement', 'true');
			}}
			isHideCloseButton={true}>
			Rebus is a decentralized peer-to-peer blockchain that people can use to participate in decentralized financial
			products. The Rebus blockchain is made up of free, public, and open-source software.
			<br />
			<br />
			AS DESCRIBED IN THE REBUS LICENSES, THE REBUS PROTOCOL IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT
			WARRANTIES OF ANY KIND. Although Rebus Foundation Ltd. ( "Rebus Foundation" ) developed much of the initial code
			for the Rebus protocol, it does not provide, own, or control the Rebus protocol, which is run by a decentralized
			validator set. Upgrades and modifications to the protocol are managed in a community-driven way by holders of the
			REBUS governance token. No developer or entity involved in creating the Rebus protocol will be liable for any
			claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of
			the Rebus protocol, including any direct, indirect, incidental, special, exemplary, punitive or consequential
			damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
		</TermsDialog>
	);
};
