import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { urlFetchTallyDetails } from 'src/constants/url';

export type TallyDetailsPayload = {
	id: number;
	value: any;
};

export const getTallyDetails = createAsyncThunk(
	'proposals/tallyDetails/getTallyDetails',
	async (id: number, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const {
			setTallyDetailsFetching,
			setTallyDetailsFetchSuccess,
			setTallyDetailsFetchError,
		} = tallyDetailsSlice.actions;

		dispatch(setTallyDetailsFetching());

		const url = urlFetchTallyDetails(id);
		Axios.get(url, {
			headers: {
				Accept: 'application/json, text/plain, */*',
				Connection: 'keep-alive',
			},
		})
			.then(res => {
				const data = {
					id,
					value: res.data && res.data.result,
				};

				dispatch(setTallyDetailsFetchSuccess(data));
				fulfillWithValue(data);
			})
			.catch(error => {
				dispatch(
					setTallyDetailsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const tallyDetailsSlice = createSlice({
	name: 'tallyDetails',
	initialState: {
		inProgress: false,
		value: {} as any,
	},
	reducers: {
		setTallyDetailsFetching: state => ({
			...state,
			inProgress: true,
		}),
		setTallyDetailsFetchSuccess: (state, action: PayloadAction<TallyDetailsPayload>) => {
			const obj = {
				...state.value,
				[action.payload.id]: action.payload.value,
			};

			return {
				inProgress: false,
				value: obj,
			};
		},
		setTallyDetailsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...tallyDetailsSlice.actions, getTallyDetails };
export default tallyDetailsSlice.reducer;
