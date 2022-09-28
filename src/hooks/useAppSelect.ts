import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'src/reducers/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
