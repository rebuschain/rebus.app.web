import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@mui/material';
import variables from 'src/utils/variables';
import { delegateDialogActions, snackbarActions } from 'src/reducers/slices';
import { useActions } from 'src/hooks/use-actions';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';
import { useAddress } from 'src/hooks/use-address';

type DelegateButtonProps = {
	valAddress?: string;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const DelegateButton = observer<DelegateButtonProps>(({ valAddress = '' }) => {
	const { lang } = useAppSelector(selector);
	const address = useAddress();

	const [handleOpen, showMessage] = useActions([
		delegateDialogActions.showDelegateDialog,
		snackbarActions.showSnackbar,
	]);

	const handleClick = () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		handleOpen({ name: 'Delegate', validatorAddress: valAddress });
	};

	return (
		<Button className="btn gradient-green" variant="outlined" onClick={handleClick}>
			{variables[lang].delegate}
		</Button>
	);
});

export default DelegateButton;
