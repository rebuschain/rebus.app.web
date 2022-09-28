import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@material-ui/core';
import variables from 'src/utils/variables';
import { useActions } from 'src/hooks/useActions';
import { useAddress } from 'src/hooks/useAddress';
import { delegateDialogActions, snackbarActions } from 'src/reducers/slices';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/useAppSelect';

type ReDelegateButtonProps = {
	valAddress?: string;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const ReDelegateButton = observer<ReDelegateButtonProps>(({ valAddress }) => {
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

		handleOpen({ name: 'Redelegate', validatorAddress: valAddress });
	};

	return (
		<Button className="btn gradient-green" variant="outlined" onClick={handleClick}>
			{variables[lang]['re_delegate']}
		</Button>
	);
});

export default ReDelegateButton;
