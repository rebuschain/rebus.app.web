import { Coin } from 'src/proto/cosmos/base/v1beta1/coin';
import { PaymentType } from 'src/proto/rebus/nftid/v1/id';

export type Payment = {
	amount: Coin;
	timestamp: number;
	locked_at_address: string;
	can_refund: boolean;
};

export type IdRecord = {
	address: string;
	type: number;
	organization: string;
	encryption_key: string;
	metadata_url: string;
	document_number: string;
	id_number: string;
	payment_type: PaymentType;
	payments: Payment[];
	active: boolean;
};

export type IdRecordResponse = {
	id_record: IdRecord;
};
