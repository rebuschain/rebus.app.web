import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@material-ui/core';
import variables from 'src/utils/variables';
import { actions as claimDialogActions } from 'src/reducers/slices/stake/slices/claim-dialog';
import { actions as snackbarActions } from 'src/reducers/slices/snackbar';
import { useActions } from 'src/hooks/use-actions';
import { useAddress } from 'src/hooks/use-address';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';

type ClaimButtonProps = {
	disable: boolean;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const ClaimButton = observer<ClaimButtonProps>(({ disable }) => {
	const { lang } = useAppSelector(selector);
	const [handleOpen, showMessage] = useActions([claimDialogActions.showClaimDialog, snackbarActions.showSnackbar]);
	const address = useAddress();

	const handleClick = () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		handleOpen();
	};

	return (
		<Button className="btn gradient-blue claim" disabled={disable} variant="outlined" onClick={handleClick}>
			{variables[lang].claim}
		</Button>
	);
});

export default ClaimButton;
