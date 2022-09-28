import React, { FunctionComponent } from 'react';
import { IconButton, InputAdornment } from '@material-ui/core';
import TextField from 'src/components/insync/TextField';
import Icon from 'src/components/insync/Icon';
import { searchActions } from 'src/reducers/slices';
import { Lang } from 'src/utils/variables';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { useActions } from 'src/hooks/useActions';
import { RootState } from 'src/reducers/store';

type SearchTextFieldProps = {
	lang: Lang;
	value: string;
	onChange: (value: string) => void;
};

const selector = (state: RootState) => {
	return {
		value: state.stake.search,
	};
};

const SearchTextField: FunctionComponent<SearchTextFieldProps> = () => {
	const [onChange] = useActions([searchActions.setSearch]);
	const { value } = useAppSelector(selector);

	return (
		<TextField
			className="search_text_field"
			id="search-text-field"
			inputProps={{
				startAdornment: (
					<div className="search_icons">
						<InputAdornment position="start">
							<Icon className="search" icon="search" />
						</InputAdornment>
						<div className="line" />
					</div>
				),
				endAdornment: (
					<InputAdornment position="end">
						<IconButton className="text_field_icon">
							<Icon className="menu" icon="menu" />
						</IconButton>
					</InputAdornment>
				),
			}}
			name="search"
			placeholder="Search for validator"
			value={value}
			onChange={onChange}
		/>
	);
};

export default SearchTextField;
