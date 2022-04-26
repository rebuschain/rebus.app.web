// last is highest priority
export enum IContainerState {
	ENABLED,
	HOVER,
	FOCUS,
	SELECTED,
	DRAG,
}

export interface IContainerSettings {
	draggable?: boolean;
	focusable?: boolean;
	hoverable?: boolean;
}

export enum TCardTypes {
	PRIMARY,
	SURFACE,
	CARD,
	TRANSPARENT,
}

export enum TModal {
	INIT,
	NEW_POOL,
	MANAGE_LIQUIDITY,
}
