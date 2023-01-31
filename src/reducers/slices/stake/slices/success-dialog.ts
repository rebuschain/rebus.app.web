import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	doubleEncryptionKey: '',
	hash: '',
	tokens: '',
	isNft: false,
	isNftIdRecord: false,
	isNftIdActivated: undefined as boolean | undefined,
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
				isNftIdActivated?: boolean;
			}>
		) => ({
			open: true,
			doubleEncryptionKey: action.payload.doubleEncryptionKey || '',
			hash: action.payload.hash || '',
			tokens: action.payload.tokens || '',
			isNft: action.payload.isNft || false,
			isNftIdRecord: action.payload.isNftIdRecord || false,
			isNftIdActivated: action.payload.isNftIdActivated,
		}),
	},
});

export const actions = successDialogSlice.actions;
export default successDialogSlice.reducer;
