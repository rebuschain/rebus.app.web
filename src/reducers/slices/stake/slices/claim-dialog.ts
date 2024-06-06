import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { actions as successDialogActions } from './success-dialog';

const initialState = {
	open: false,
	validator: 'all',
};

export const claimDialogSlice = createSlice({
	name: 'claimDialog',
	initialState,
	reducers: {
		hideClaimDialog: () => ({
			open: false,
			validator: 'all',
			tokens: null,
		}),
		showClaimDialog: state => ({
			...state,
			open: true,
			validator: 'all',
			tokens: null,
		}),
		setClaimDialogValidator: (state, action: PayloadAction<string>) => ({
			...state,
			validator: action.payload,
		}),
	},
	extraReducers: {
		[successDialogActions.hideSuccessDialog as any]: state => ({
			...state,
			open: false,
		}),
	},
});

export const actions = claimDialogSlice.actions;
export default claimDialogSlice.reducer;
