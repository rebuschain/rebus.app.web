import styled from '@emotion/styled';
import React, { FunctionComponent } from 'react';
import { FullScreenContainer } from 'src/components/layouts/containers';
import SnackbarMessage from '../../components/insync/snackbar-message';
import { AddressConverter } from './components/address-converter';

const ToolsPage: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	return (
		<FullScreenContainerWithPadding>
			<AddressConverter />
			<SnackbarMessage />
		</FullScreenContainerWithPadding>
	);
};

const FullScreenContainerWithPadding = styled(FullScreenContainer)`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

export default ToolsPage;
