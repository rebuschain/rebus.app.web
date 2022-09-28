import { createSlice } from '@reduxjs/toolkit';

export const navBarSlice = createSlice({
	name: 'navBar',
	initialState: false,
	reducers: {
		hideSideBar: () => false,
		showSideBar: () => true,
	},
});

export const actions = navBarSlice.actions;
export default navBarSlice.reducer;
