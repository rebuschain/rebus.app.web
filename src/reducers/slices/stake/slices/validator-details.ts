import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { getValidatorURL } from 'src/constants/url';

export const getValidatorDetails = createAsyncThunk(
	'stake/validatorDetails/getValidatorDetails',
	async (address: string, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const {
			setValidatorDetailsFetching,
			setValidatorDetailsFetchSuccess,
			setValidatorDetailsFetchError,
		} = validatorDetailsSlice.actions;

		dispatch(setValidatorDetailsFetching());
		const URL = getValidatorURL(address);

		Axios.get(URL, {
			headers: {
				Accept: 'application/json, text/plain, */*',
			},
		})
			.then(res => {
				dispatch(setValidatorDetailsFetchSuccess(res.data && res.data.result));
				fulfillWithValue(res.data && res.data.result);
			})
			.catch(error => {
				dispatch(
					setValidatorDetailsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);
				rejectWithValue(null);
			});
	}
);

export const validatorDetailsSlice = createSlice({
	name: 'validatorDetails',
	initialState: {
		inProgress: false,
		value: null,
	},
	reducers: {
		setValidatorDetailsFetching: state => ({
			...state,
			inProgress: true,
		}),
		setValidatorDetailsFetchSuccess: (state, action: PayloadAction<any>) => ({
			inProgress: false,
			value: action.payload,
		}),
		setValidatorDetailsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...validatorDetailsSlice.actions, getValidatorDetails };
export default validatorDetailsSlice.reducer;
