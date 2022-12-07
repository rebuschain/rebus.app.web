export type IdRecord = {
	address: string;
	type: number;
	organization: string;
	encryption_key: string;
	metadata_url: string;
	document_number: string;
	id_number: string;
};

export type IdRecordResponse = {
	id_record: IdRecord;
};
