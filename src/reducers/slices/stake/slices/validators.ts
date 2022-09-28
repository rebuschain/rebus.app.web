import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Axios from 'axios';
import { VALIDATORS_LIST_URL, validatorImageURL } from 'src/constants/url';
import { config } from 'src/config-insync';

export const getValidators = createAsyncThunk(
	'stake/validators/getValidators',
	async (callback: undefined | ((res: any[]) => void), thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const { setValidatorsFetchError, setValidatorsFetchSuccess, setValidatorsFetching } = validatorsSlice.actions;

		dispatch(setValidatorsFetching());
		const axiosOptions = {
			headers: {
				Accept: 'application/json, text/plain, */*',
				Connection: 'keep-alive',
			},
		};

		Promise.all([
			Axios.get(`${VALIDATORS_LIST_URL}?status=BOND_STATUS_BONDED&limit=9999`, axiosOptions),
			Axios.get(`${VALIDATORS_LIST_URL}?status=BOND_STATUS_UNBONDED&limit=9999`, axiosOptions),
			Axios.get(`${VALIDATORS_LIST_URL}?status=BOND_STATUS_UNBONDING&limit=9999`, axiosOptions),
		])
			.then(responses => {
				const result = [];
				responses[0].data && result.push(...responses[0].data.result);
				responses[1].data && result.push(...responses[1].data.result);
				responses[2].data && result.push(...responses[2].data.result);
				return result;
			})
			.then(res => {
				dispatch(setValidatorsFetchSuccess(res));
				callback && callback(res);
				fulfillWithValue(res);
			})
			.catch(error => {
				dispatch(
					setValidatorsFetchError(
						error.response && error.response.data && error.response.data.message
							? error.response.data.message
							: 'Failed!'
					)
				);

				rejectWithValue(null);
			});
	}
);

export const getValidatorImage = createAsyncThunk(
	'stake/validators/getValidatorImage',
	async (id: string, thunkAPI) => {
		const { dispatch, fulfillWithValue, rejectWithValue } = thunkAPI;
		const { setValidatorImageFetchSuccess } = validatorsSlice.actions;

		const URL = validatorImageURL(id);

		return Axios.get(URL, {
			headers: {
				Accept: 'application/json, text/plain, */*',
				Connection: 'keep-alive',
			},
		})
			.then(res => {
				let obj: any = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
				obj = obj && JSON.parse(obj);
				obj[id] = res.data;
				obj = obj && JSON.stringify(obj);
				sessionStorage.setItem(`${config.PREFIX}_images`, obj);

				const data = {
					...res.data,
					_id: id,
				};

				dispatch(setValidatorImageFetchSuccess(data));
				fulfillWithValue(data);
			})
			.catch(error => {
				rejectWithValue(error);
			});
	}
);

export const validatorsSlice = createSlice({
	name: 'validators',
	initialState: {
		inProgress: false,
		list: null as any[] | null,
		images: [] as any[],
	},
	reducers: {
		setValidatorsFetching: state => ({
			...state,
			inProgress: true,
		}),
		setValidatorsFetchSuccess: (state, action: PayloadAction<any>) => ({
			...state,
			inProgress: false,
			list: action.payload,
		}),
		setValidatorImageFetchSuccess: (state, action: PayloadAction<any>) => {
			const array: any[] = [...state.images];
			if (action.payload && array.indexOf(action.payload) === -1) {
				array.push(action.payload);
			}

			return {
				...state,
				images: [...array],
			};
		},
		setValidatorsFetchError: (state, action: PayloadAction<string>) => ({
			...state,
			inProgress: false,
		}),
	},
});

export const actions = { ...validatorsSlice.actions, getValidators, getValidatorImage };
export default validatorsSlice.reducer;
