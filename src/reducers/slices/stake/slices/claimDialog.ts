import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
		}),
		setClaimDialogValidator: (state, action: PayloadAction<string>) => ({
			...state,
			validator: action.payload,
		}),
	},
});

export const actions = claimDialogSlice.actions;
export default claimDialogSlice.reducer;
