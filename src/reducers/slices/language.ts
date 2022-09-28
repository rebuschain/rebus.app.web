import { createSlice } from '@reduxjs/toolkit';
import { Lang } from 'src/utils/variables';

export const languageSlice = createSlice({
	name: 'language',
	initialState: 'en' as Lang,
	reducers: {},
});

export default languageSlice.reducer;
