import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/reducers/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
