export const getIpfsId = (url: string) => url?.split('ipfs://')[1]?.split('/')[0] || url?.split('/')[0];

export const getIpfsHttpsUrl = (url: string = '') => {
	const noProtocolUrl = url?.split('ipfs://')[1] || url;
	const path = noProtocolUrl
		?.split('/')
		.slice(1)
		.join('/');

	return `https://${getIpfsId(url)}.ipfs.nftstorage.link/${path}`;
};
