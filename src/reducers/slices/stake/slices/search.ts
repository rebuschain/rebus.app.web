import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
	name: 'search',
	initialState: '',
	reducers: {
		setSearch: (_, action: PayloadAction<string>) => action.payload,
	},
});

export const actions = searchSlice.actions;
export default searchSlice.reducer;
