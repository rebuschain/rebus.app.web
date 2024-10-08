import styled from 'styled-components';
import * as React from 'react';
import { Button } from 'src/components/common/button';
import { Text } from 'src/components/texts';
import useWindowSize from 'src/hooks/use-window-size';

interface ConnectAccountButtonProps {
	textStyle?: React.CSSProperties;
}

export function ConnectAccountButton(props: React.HTMLAttributes<HTMLButtonElement> & ConnectAccountButtonProps) {
	const { isMobileView } = useWindowSize();

	return (
		<Button {...(props as any)} style={{ whiteSpace: 'nowrap', ...(props.style || {}) }}>
			<WalletImg src="/public/assets/icons/assets.svg" />
			<p style={{ marginLeft: '6px', ...props.textStyle }}>Connect Wallet</p>
		</Button>
	);
}

const WalletImg = styled.img`
	width: 1.25rem;
	height: 1.25rem;
	margin-top: 3px;
`;
