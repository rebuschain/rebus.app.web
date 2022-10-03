import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NameType = 'Stake' | 'Delegate' | 'Undelegate' | 'Redelegate' | '';

type ShowDelegateDialog = {
	name: NameType;
	validatorAddress?: string;
};

const initialState = {
	open: false,
	name: '' as NameType,
	validatorAddress: '',
	toValidatorAddress: '',
	tokens: null as string | null,
};

export const delegateDialogSlice = createSlice({
	name: 'delegateDialog',
	initialState,
	reducers: {
		hideDelegateDialog: state => ({
			...state,
			open: false,
		}),
		showDelegateDialog: (state, action: PayloadAction<ShowDelegateDialog>) => ({
			open: true,
			name: action.payload.name,
			validatorAddress: action.payload.validatorAddress || '',
			toValidatorAddress: '',
			tokens: null,
		}),
		setTokens: (state, action: PayloadAction<string>) => ({
			...state,
			tokens: action.payload,
		}),
		setValidatorAddress: (state, action: PayloadAction<string>) => ({
			...state,
			validatorAddress: action.payload,
		}),
		setToValidatorAddress: (state, action: PayloadAction<string>) => ({
			...state,
			toValidatorAddress: action.payload,
		}),
	},
});

export const actions = delegateDialogSlice.actions;
export default delegateDialogSlice.reducer;
