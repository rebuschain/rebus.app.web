import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { MouseEventHandler, useRef } from 'react';
import { ReactSVG } from 'react-svg';
import { Media } from 'src/types/nft-id';
import { Button } from '../button';
import { TextInput } from './text-input';

export type FileInputProps = {
	className?: string;
	backgroundSize?: 'cover' | 'contain';
	onChange: (name: string, value: Media | undefined) => void;
	name?: string;
	placeholder?: string;
	useWhitescale?: boolean;
	value?: Media;
};

export const FileInput: React.FC<FileInputProps> = ({
	className,
	backgroundSize = 'cover',
	onChange,
	name = '',
	placeholder,
	useWhitescale,
	value,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onStartUpload: MouseEventHandler<HTMLButtonElement> = e => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) {
			return;
		}

		const file = e.target.files[0];

		const fileReader = new FileReader();
		fileReader.onload = () => {
			onChange(name, {
				name: file.name,
				size: file.size,
				source: fileReader.result as string,
				type: file.type,
			});
		};
		fileReader.readAsDataURL(file);
	};

	return (
		<div className={classNames(className, 'flex')}>
			<div
				className="bg-gray-1 rounded-2lg flex-shrink-0"
				style={{
					height: '115px',
					width: '100px',
				}}>
				<div
					style={{
						backgroundImage: value ? `url(${value.source})` : undefined,
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						backgroundSize,
						filter: useWhitescale ? 'brightness(0) invert(1)' : undefined,
						height: '100%',
						width: '100%',
					}}
				/>
			</div>

			<div className="ml-2.5">
				<label className="block text-white text-base mb-2.5">File Upload</label>

				<div className="flex mb-2.5">
					<div className="w-full relative mr-2.5">
						<TextInput
							className={value ? 'pr-9' : ''}
							name={name}
							placeholder="Upload File"
							readonly
							value={value?.name || ''}
						/>
						{value && (
							<button className="absolute right-1 top-2" onClick={() => onChange(name, undefined)}>
								<CloseIconSVG src="/public/assets/icons/close.svg" />
							</button>
						)}
					</div>
					<Button backgroundStyle="blue" onClick={onStartUpload} smallBorderRadius smallFont textTransform="uppercase">
						Upload
					</Button>
				</div>

				<div className="text-white text-xs font-medium opacity-50">
					Please provide a clear photo headshot similar to something you would use for a passport or ID card. JPG, PNG,
					and GIF are supported.
				</div>

				<input
					accept=".jpg,.png,.gif"
					className={classNames(className, 'invisible')}
					onChange={onFileChange}
					name={name}
					placeholder={placeholder}
					ref={fileInputRef}
					type="file"
				/>
			</div>
		</div>
	);
};

const CloseIconSVG = styled(ReactSVG as any)`
	path {
		fill: white;
	}
`;
