import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducer from './root-reducer';

export const store = configureStore({
	devTools: process.env.NODE_ENV !== 'production',
	middleware: [thunk],
	reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
