export type Media = {
	name: string;
	size: number;
	source: string;
	type: string;
};

export type NftIdData = {
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
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
	idPhotoFileHidden?: boolean;
	idPhotoFile?: Media;
	signatureFileHidden?: boolean;
	signatureFile?: Media;
};
