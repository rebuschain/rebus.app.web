export type Theme = {
	name: string;
	colors: string[];
};

export type Media = {
	name: string;
	size: number;
	source: string;
	type: string;
};

export type NftIdData = {
	theme?: Theme;

	documentNumber?: string;
	idNumber?: string;
	issuedBy?: string;

	nameHidden?: boolean;
	name?: string;
	dateOfBirthHidden?: boolean;
	dateOfBirth?: string;
	genderHidden?: boolean;
	gender?: string;
	placeOfBirthHidden?: boolean;
	cityOfBirth?: string;
	stateOfBirth?: string;
	nationalityHidden?: boolean;
	nationality?: string;
	addressHidden?: boolean;
	address?: string;
	idPhotoFileHidden?: boolean;
	idPhotoFile?: Media;
	signatureFileHidden?: boolean;
	signatureFile?: Media;
};
