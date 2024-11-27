import { RPC_URL } from 'src/constants/url';
import {
	AminoTypes,
	createAuthzAminoConverters,
	createBankAminoConverters,
	createDistributionAminoConverters,
	createFeegrantAminoConverters,
	createGovAminoConverters,
	createIbcAminoConverters,
	createStakingAminoConverters,
	createVestingAminoConverters,
	defaultRegistryTypes,
	SigningStargateClient,
} from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/launchpad';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { config } from 'src/config-insync';
import { getAccount } from 'src/utils/account';
import { OfflineDirectSigner, Registry } from '@cosmjs/proto-signing';
import { MsgActivateNftId, MsgDeactivateNftId, MsgMintNftId } from 'src/proto/rebus/nftid/v1/tx';
import { MsgConvertCoin, MsgConvertERC20 } from 'src/proto/evmos/erc20/v1/tx';

const chainId = config.CHAIN_ID;

const registry = new Registry(defaultRegistryTypes);
registry.register('/rebus.erc20.v1.MsgConvertCoin', MsgConvertCoin);
registry.register('/rebus.erc20.v1.MsgConvertERC20', MsgConvertERC20);
registry.register('/rebus.nftid.v1.MsgMintNftId', MsgMintNftId);
registry.register('/rebus.nftid.v1.MsgCreateIdRecord', MsgMintNftId);
registry.register('/rebus.nftid.v1.MsgActivateNftId', MsgActivateNftId);
registry.register('/rebus.nftid.v1.MsgDeactivateNftId', MsgDeactivateNftId);

const defaultAminoTypes = {
	...createAuthzAminoConverters(),
	...createBankAminoConverters(),
	...createDistributionAminoConverters(),
	...createGovAminoConverters(),
	...createStakingAminoConverters('cosmos'),
	...createIbcAminoConverters(),
	...createFeegrantAminoConverters(),
	...createVestingAminoConverters(),
};

const aminoTypes = new AminoTypes({
	...defaultAminoTypes,
	'/rebus.erc20.v1.MsgConvertCoin': {
		aminoType: 'evmos/MsgConvertCoin',
		toAmino: msg => msg,
		fromAmino: msg => msg,
	},
	'/rebus.erc20.v1.MsgConvertERC20': {
		aminoType: 'evmos/MsgConvertERC20',
		toAmino: msg => ({
			...msg,
			contract_address: msg.contractAddress,
		}),
		fromAmino: msg => ({
			...msg,
			contractAddress: msg.contract_address,
		}),
	},
	'/rebus.nftid.v1.MsgMintNftId': {
		aminoType: 'rebus.core/MsgMintNftId',
		toAmino: ({ address, nftType, organization, encryptionKey, metadataUrl }) => {
			return {
				address,
				nft_type: nftType,
				organization,
				encryption_key: encryptionKey,
				metadata_url: metadataUrl,
			};
		},
		fromAmino: ({ address, nft_type, organization, encryption_key, metadata_url }) => {
			return {
				address,
				nftType: nft_type,
				organization,
				encryptionKey: encryption_key,
				metadataUrl: metadata_url,
			};
		},
	},
	'/rebus.nftid.v1.MsgCreateIdRecord': {
		aminoType: 'rebus.core/MsgCreateIdRecord',
		toAmino: ({ address, nftType, organization }) => {
			return {
				address,
				nft_type: nftType,
				organization,
			};
		},
		fromAmino: ({ address, nft_type, organization }) => {
			return {
				address,
				nftType: nft_type,
				organization,
			};
		},
	},
	'/rebus.nftid.v1.MsgActivateNftId': {
		aminoType: 'rebus.core/MsgActivateNftId',
		toAmino: ({ address, nftType, organization, timestamp }) => {
			return {
				address,
				nft_type: nftType,
				organization,
				timestamp,
			};
		},
		fromAmino: ({ address, nft_type, organization, timestamp }) => {
			return {
				address,
				nftType: nft_type,
				organization,
				timestamp,
			};
		},
	},
	'/rebus.nftid.v1.MsgDeactivateNftId': {
		aminoType: 'rebus.core/MsgDeactivateNftId',
		toAmino: ({ address, nftType, organization }) => {
			return {
				address,
				nft_type: nftType,
				organization,
			};
		},
		fromAmino: ({ address, nft_type, organization }) => {
			return {
				address,
				nftType: nft_type,
				organization,
			};
		},
	},
});

export const aminoSignTx = async (
	tx: any,
	address: string,
	signer: OfflineSigner | OfflineDirectSigner | null,
	isEvmos: boolean
) => {
	if (!signer) {
		(await window.keplr) && window.keplr?.enable(chainId);
		signer = (window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId)) as OfflineSigner;
	}

	const client = await SigningStargateClient.connectWithSigner(RPC_URL, signer, { aminoTypes, registry });
	const myac = await getAccount(address);

	if (!myac) {
		throw new Error('Account not found, please transfer some rebus to your account');
	}

	const signerData = {
		accountNumber: myac.accountNumber,
		sequence: myac.sequence,
		chainId: chainId,
	};

	const result = await client.sign(address, tx.msgs ? tx.msgs : [tx.msg], tx.fee, tx.memo, signerData, isEvmos);

	const txBytes = TxRaw.encode(result).finish();

	return client.broadcastTx(txBytes);
};

export const signKeplrArbitrary = async (address: string, payload: string) => {
	(await window.keplr) && window.keplr?.enable(chainId);

	return window.keplr?.signArbitrary(chainId, address, payload);
};

export const stringToBytes = (str: string) => {
	const encoder = new TextEncoder();
	return encoder.encode(str);
};
