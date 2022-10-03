import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const snackbarSlice = createSlice({
	name: 'snackbar',
	initialState: {
		open: false,
		message: '',
	},
	reducers: {
		hideSnackbar: state => ({
			...state,
			open: false,
		}),
		showSnackbar: (_, action: PayloadAction<string>) => ({
			open: true,
			message: action.payload,
		}),
	},
});

export const actions = snackbarSlice.actions;
export default snackbarSlice.reducer;
