import React, { FunctionComponent, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { RootState } from 'src/reducers/store';
import variables from 'src/utils/variables';
import { useAppSelector } from 'src/hooks/use-app-select';
import styled from '@emotion/styled';

interface ClearEncryptionDialogProps {
	open: boolean;
	onSubmit: () => void;
	onClose: () => void;
}

const selector = (state: RootState) => ({
	lang: state.language,
});

export const ClearEncryptionDialog: FunctionComponent<React.PropsWithChildren<ClearEncryptionDialogProps>> = ({
	open,
	onSubmit,
	onClose,
}) => {
	const { lang } = useAppSelector(selector);

	return (
		<Dialog open={open} onClose={onClose}>
			<StyledDialogContent>
				<StyledPrompt>Are you sure you want to clear the encryption?</StyledPrompt>
			</StyledDialogContent>
			<StyledDialogActions>
				<StyledButton variant="contained" onClick={() => onSubmit()}>
					{variables[lang]['confirm_clear_encryption']}
				</StyledButton>
			</StyledDialogActions>
		</Dialog>
	);
};

const StyledDialogContent = styled(DialogContent)`
	background-color: #000000;
`;
const StyledButton = styled(Button)`
	background-color: #1976d2 !important;
`;

const StyledPrompt = styled.p`
	color: #ffffff;
`;

const StyledDialogActions = styled(DialogActions)`
	background-color: #000000;
`;
