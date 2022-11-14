import domToImage from 'dom-to-image';

export const renderToImage = (elementRef: HTMLElement, callback: (dataUrl: string) => void) => {
	if (elementRef) {
		// setTimeout to make sure the elments have rendered
		setTimeout(() => {
			domToImage
				.toPng(elementRef as Node, { height: elementRef!.offsetHeight })
				.then(dataUrl => {
					if (callback) {
						callback(dataUrl);
					}
				})
				.catch(error => {
					console.error('Error rendering nft id image', error);
				});
		});
	}
};
