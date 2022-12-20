import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	doubleEncryptionKey: '',
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
			action: PayloadAction<{
				doubleEncryptionKey?: string;
				hash?: string;
				tokens?: string;
				isNft?: boolean;
				isNftIdRecord?: boolean;
			}>
		) => ({
			open: true,
			doubleEncryptionKey: action.payload.doubleEncryptionKey || '',
			hash: action.payload.hash || '',
			tokens: action.payload.tokens || '',
			isNft: action.payload.isNft || false,
			isNftIdRecord: action.payload.isNftIdRecord || false,
		}),
	},
});

export const actions = successDialogSlice.actions;
export default successDialogSlice.reducer;
