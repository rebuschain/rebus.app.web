import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@material-ui/core';
import variables from 'src/utils/variables';
import { delegateDialogActions, snackbarActions } from 'src/reducers/slices';
import { useActions } from 'src/hooks/useActions';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { useAddress } from 'src/hooks/useAddress';

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
