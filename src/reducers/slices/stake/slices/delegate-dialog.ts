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
		hideDelegateDialog: () => ({
			open: false,
			name: '' as NameType,
			validatorAddress: '',
			toValidatorAddress: '',
			tokens: null,
		}),
		showDelegateDialog: (state, action: PayloadAction<ShowDelegateDialog>) => ({
			...state,
			open: true,
			name: action.payload.name,
			validatorAddress: action.payload.validatorAddress || '',
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
