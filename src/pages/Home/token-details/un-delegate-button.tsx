import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@material-ui/core';
import variables from 'src/utils/variables';
import { useActions } from 'src/hooks/use-actions';
import { useAddress } from 'src/hooks/use-address';
import { delegateDialogActions, snackbarActions } from 'src/reducers/slices';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';

type UnDelegateButtonProps = {
	valAddress?: string;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const UnDelegateButton = observer<UnDelegateButtonProps>(({ valAddress = '' }) => {
	const { lang } = useAppSelector(selector);
	const [handleOpen, showMessage] = useActions([
		delegateDialogActions.showDelegateDialog,
		snackbarActions.showSnackbar,
	]);
	const address = useAddress();

	const handleClick = () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		handleOpen({ name: 'Undelegate', validatorAddress: valAddress });
	};

	return (
		<Button className="btn gradient-pink" variant="outlined" onClick={handleClick}>
			{variables[lang]['un_delegate']}
		</Button>
	);
});

export default UnDelegateButton;
