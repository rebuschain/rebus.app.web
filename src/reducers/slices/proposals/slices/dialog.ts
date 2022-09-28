import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { disconnect } from '../../../extra-actions';

const hide = (state: { open: boolean; value: any }) => ({
	...state,
	open: false,
});

export const dialogSlice = createSlice({
	name: 'dialog',
	initialState: {
		open: false,
		value: {} as any,
	},
	reducers: {
		hideProposalDialog: hide,
		showProposalDialog: (_, action: PayloadAction<any>) => ({
			open: true,
			value: action.payload,
		}),
	},
	extraReducers: {
		[disconnect as any]: hide,
	},
});
//DELEGATE_SUCCESS_DIALOG_HIDE

export const actions = dialogSlice.actions;
export default dialogSlice.reducer;
