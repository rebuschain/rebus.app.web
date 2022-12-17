import React, { FunctionComponent, useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { NameType } from 'src/reducers/slices/stake/slices/delegate-dialog';

export interface MenuItem {
	name: string;
	onClick: (name: NameType) => void;
}

interface CollapseMenuProps {
	menuItems: MenuItem[];
	menuTriggerLabel: string;
}

const CollapseMenu: FunctionComponent<CollapseMenuProps> = observer(({ menuItems, menuTriggerLabel }) => {
	const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

	const handleClick = (event: React.SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				className="btn gradient-blue whitespace-nowrap"
				variant="outlined"
				onClick={(e: React.SyntheticEvent) => handleClick(e)}>
				{menuTriggerLabel}
			</Button>
			<Menu anchorEl={anchorEl as Element} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				{menuItems.map((menuItem: MenuItem) => (
					<MenuItem
						key={menuItem.name}
						onClick={() => {
							menuItem.onClick(menuItem.name as NameType);
							handleClose();
						}}>
						{menuItem.name}
					</MenuItem>
				))}
			</Menu>
		</>
	);
});

export default CollapseMenu;
