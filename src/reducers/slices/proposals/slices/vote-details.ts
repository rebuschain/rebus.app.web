import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { urlFetchVoteDetails } from 'src/constants/url';
import { disconnect } from '../../../extra-actions';

export const getVoteDetails = createAsyncThunk(
	'proposals/voteDetails/getVoteDetails',
	async ({ id, address }: { id: number; address: string }, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const { setVoteDetailsFetching, setVoteDetailsFetchSuccess, setVoteDetailsFetchError } = voteDetailsSlice.actions;

		dispatch(setVoteDetailsFetching());
		const url = urlFetchVoteDetails(id, address);

		Axios.get(url, {
			headers: {
				Accept: 'application/json, text/plain, */*',
				Connection: 'keep-alive',
			},
		})
			.then(res => {
				dispatch(setVoteDetailsFetchSuccess(res.data && res.data.result));
				fulfillWithValue(res.data && res.data.result);
			})
			.catch(error => {
				dispatch(
					setVoteDetailsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const voteDetailsSlice = createSlice({
	name: 'voteDetails',
	initialState: {
		inProgress: false,
		value: [] as any[],
	},
	reducers: {
		setVoteDetailsFetching: () => ({
			inProgress: true,
			value: [],
		}),
		setVoteDetailsFetchSuccess: (state, action: PayloadAction<any>) => {
			const arr: any[] = [...state.value];
			const filter =
				state.value &&
				state.value.length &&
				action.payload &&
				action.payload.proposal_id &&
				state.value.filter((val: any) => val.proposal_id === action.payload.proposal_id);
			if (!filter.length) {
				arr.push(action.payload);
			}

			return {
				inProgress: false,
				value: arr,
			};
		},
		setVoteDetailsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
	extraReducers: {
		[disconnect as any]: () => ({
			inProgress: false,
			value: [],
		}),
	},
});

export const actions = { ...voteDetailsSlice.actions, getVoteDetails };
export default voteDetailsSlice.reducer;
