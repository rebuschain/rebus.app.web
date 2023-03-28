import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { urlFetchProposalDetails } from 'src/constants/url';

export type ProposalDetailsPayload = {
	id: number;
	value: any;
};

export const getProposalDetails = createAsyncThunk(
	'proposals/tallyDetails/getProposalDetails',
	async ({ id, callback }: { id: number; callback: (res: any) => void }, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const {
			setProposalDetailsFetching,
			setProposalDetailsFetchSuccess,
			setProposalDetailsFetchError,
		} = proposalDetailsSlice.actions;

		dispatch(setProposalDetailsFetching());

		const url = urlFetchProposalDetails(id);
		Axios.get(url, {
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
		})
			.then(res => {
				const data = {
					id,
					value: res.data && res.data.txs,
				};
				dispatch(setProposalDetailsFetchSuccess(data));
				callback && callback(data);
				fulfillWithValue(data);
			})
			.catch(error => {
				dispatch(
					setProposalDetailsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const proposalDetailsSlice = createSlice({
	name: 'proposalDetails',
	initialState: {
		inProgress: false,
		value: {} as any,
	},
	reducers: {
		setProposalDetailsFetching: () => ({
			inProgress: true,
			value: [],
		}),
		setProposalDetailsFetchSuccess: (state, action: PayloadAction<ProposalDetailsPayload>) => {
			const obj = {
				...state.value,
				[action.payload.id]: action.payload.value,
			};

			return {
				inProgress: false,
				value: obj,
			};
		},
		setProposalDetailsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...proposalDetailsSlice.actions, getProposalDetails };
export default proposalDetailsSlice.reducer;
