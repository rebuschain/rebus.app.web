import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	hash: '',
	tokens: '',
	isNft: false,
	isNftIdRecord: false,
};

export const successDialogSlice = createSlice({
	name: 'successDialog',
	initialState,
	reducers: {
		hideSuccessDialog: state => ({
			...state,
			open: false,
		}),
		showSuccessDialog: (
			state,
			action: PayloadAction<{ hash?: string; tokens?: string; isNft?: boolean; isNftIdRecord?: boolean }>
		) => ({
			open: true,
			hash: action.payload.hash || '',
			tokens: action.payload.tokens || '',
			isNft: action.payload.isNft || false,
			isNftIdRecord: action.payload.isNftIdRecord || false,
		}),
	},
});

export const actions = successDialogSlice.actions;
export default successDialogSlice.reducer;
