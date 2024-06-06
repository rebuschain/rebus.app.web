import { createSlice } from '@reduxjs/toolkit';

export const processingDialogSlice = createSlice({
	name: 'processingDialog',
	initialState: false,
	reducers: {
		hideProcessingDialog: () => false,
		showProcessingDialog: () => true,
	},
});

export const actions = processingDialogSlice.actions;
export default processingDialogSlice.reducer;
