import React from 'react';
import { NftIdData } from 'src/types/nft-id';

type PublicPreviewProps = {
	className?: string;
	data: NftIdData;
};

export const PublicPreview: React.FC<PublicPreviewProps> = ({ className, data }) => {
	return (
		<div className={className}>
			<h5 className="mb-6 whitespace-nowrap">Public Preview</h5>
		</div>
	);
};
