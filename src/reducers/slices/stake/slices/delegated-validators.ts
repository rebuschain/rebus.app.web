import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { getDelegatedValidatorsURL } from 'src/constants/url';
import { disconnect } from '../../../extra-actions';

export const getDelegatedValidatorsDetails = createAsyncThunk(
	'stake/delegatedValidators/getDelegatedValidatorsDetails',
	async (address: string, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const {
			setDelegatedValidatorsFetching,
			setDelegatedValidatorsFetchSuccess,
			setDelegatedValidatorsFetchError,
		} = delegatedValidatorsSlice.actions;

		dispatch(setDelegatedValidatorsFetching());
		const URL = getDelegatedValidatorsURL(address);

		Axios.get(URL, {
			headers: {
				Accept: 'application/json, text/plain, */*',
				Connection: 'keep-alive',
			},
		})
			.then(res => {
				dispatch(setDelegatedValidatorsFetchSuccess(res.data && res.data.result));
				fulfillWithValue(res.data && res.data.result);
			})
			.catch(error => {
				dispatch(
					setDelegatedValidatorsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const delegatedValidatorsSlice = createSlice({
	name: 'delegatedValidators',
	initialState: {
		inProgress: false,
		list: [],
	},
	reducers: {
		setDelegatedValidatorsFetching: state => ({
			...state,
			inProgress: true,
		}),
		setDelegatedValidatorsFetchSuccess: (state, action: PayloadAction<any>) => ({
			inProgress: false,
			list: action.payload,
		}),
		setDelegatedValidatorsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
	extraReducers: {
		[disconnect as any]: state => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...delegatedValidatorsSlice.actions, getDelegatedValidatorsDetails };
export default delegatedValidatorsSlice.reducer;
