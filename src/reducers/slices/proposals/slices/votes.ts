import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { urlFetchProposalVotes } from 'src/constants/url';

export const getVotes = createAsyncThunk('proposals/votes/getVotes', async (id: number, thunkAPI) => {
	const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
	const { setVotesFetching, setVotesFetchSuccess, setVotesFetchError } = votesSlice.actions;

	dispatch(setVotesFetching());
	const url = urlFetchProposalVotes(id);

	Axios.get(url, {
		headers: {
			Accept: 'application/json, text/plain, */*',
			Connection: 'keep-alive',
		},
	})
		.then(res => {
			dispatch(setVotesFetchSuccess(res.data && res.data.result));
			fulfillWithValue(res.data && res.data.result);
		})
		.catch(error => {
			dispatch(
				setVotesFetchError(
					error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Failed!'
				)
			);
			rejectWithValue(null);
		});
});

export const votesSlice = createSlice({
	name: 'votes',
	initialState: {
		inProgress: false,
		list: [],
	},
	reducers: {
		setVotesFetching: state => ({
			...state,
			inProgress: true,
		}),
		setVotesFetchSuccess: (_, action: PayloadAction<any>) => ({
			inProgress: false,
			list: action.payload,
		}),
		setVotesFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = votesSlice.actions;
export default votesSlice.reducer;
