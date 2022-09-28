import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	open: false,
	hash: '',
	tokens: '',
};

export const successDialogSlice = createSlice({
	name: 'successDialog',
	initialState,
	reducers: {
		hideSuccessDialog: () => initialState,
		showSuccessDialog: (state, action: PayloadAction<{ hash?: string; tokens?: string }>) => ({
			open: true,
			hash: action.payload.hash || '',
			tokens: action.payload.tokens || '',
		}),
	},
});

export const actions = successDialogSlice.actions;
export default successDialogSlice.reducer;
