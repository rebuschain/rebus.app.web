import { computed, makeObservable } from 'mobx';
import env from '@beam-australia/react-env';
import axios from 'axios';
import { ObservableQuery } from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { camelCase } from 'lodash-es';

export type FeatureFlagsResponse = {
	data: {
		id: number;
		attributes: {
			slug: string;
			enabled: boolean;
			description: string;
			createdAt: string;
			updatedAt: string;
		};
	}[];
};

export type FeatureFlags = {
	assetsPage?: boolean;
	assetsPageErc20ToNative?: boolean;
	nftIdPage?: boolean;
	ibcTransferPage?: boolean;
	newProposals?: boolean;
};

const axiosInstance = axios.create({
	baseURL: `${env('CMS_URL')}/api`,
});

/**
 * FeatureFlagStore
 */
export class FeatureFlagStore extends ObservableQuery<FeatureFlagsResponse> {
	constructor(kvStore: KVStore) {
		super(kvStore, axiosInstance, '/feature-flags');
		makeObservable(this);
	}

	@computed
	public get featureFlags(): FeatureFlags {
		return (
			this.response?.data?.data?.reduce(
				(acc, { attributes: { enabled, slug } }) => ({ ...acc, [camelCase(slug)]: enabled }),
				{}
			) || {}
		);
	}
}
