import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { PROPOSALS_LIST_URL } from 'src/constants/url';

export const getProposals = createAsyncThunk(
	'proposals/items/getProposals',
	async (callback: (res: any) => void, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const { setProposalsFetching, setProposalsFetchSuccess, setProposalsFetchError } = itemsSlice.actions;

		dispatch(setProposalsFetching());

		Axios.get(PROPOSALS_LIST_URL, {
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
		})
			.then(res => {
				const data = res.data && res.data.result;
				dispatch(setProposalsFetchSuccess(data));
				callback && callback(data);
				fulfillWithValue(data);
			})
			.catch(error => {
				dispatch(
					setProposalsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const itemsSlice = createSlice({
	name: 'items',
	initialState: {
		inProgress: false,
		list: [] as any[],
	},
	reducers: {
		setProposalsFetching: state => ({
			...state,
			inProgress: true,
		}),
		setProposalsFetchSuccess: (_, action: PayloadAction<any>) => ({
			inProgress: false,
			list: action.payload,
		}),
		setProposalsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...itemsSlice.actions, getProposals };
export default itemsSlice.reducer;
