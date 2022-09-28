import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const failedDialogSlice = createSlice({
	name: 'failedDialog',
	initialState: {
		open: false,
		hash: '',
		message: '',
	},
	reducers: {
		hideFailedDialog: () => ({
			open: false,
			message: '',
			hash: '',
		}),
		showFailedDialog: (state, action: PayloadAction<{ message: string; hash?: string }>) => ({
			open: true,
			hash: action.payload.hash || '',
			message: action.payload.message,
		}),
	},
});

export const actions = failedDialogSlice.actions;
export default failedDialogSlice.reducer;
