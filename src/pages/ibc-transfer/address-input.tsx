import classNames from 'classnames';
import React, { ChangeEventHandler, useState } from 'react';
import { AmountInput } from 'src/components/form/inputs';
import { Button } from 'src/components/common/button';
import styled from 'styled-components';
import TextField from 'src/components/insync/text-field/text-field';
import Checkbox from 'src/components/common/checkbox';
import { hexToRgb } from 'src/colors';

type Props = {
	address: string;
	canEdit?: boolean;
	chainImage: string;
	chainName: string;
	hasError?: boolean;
	label: string;
	onChangeAddress?: (address: string) => void;
	onChangeConfirm?: (isConfirmed: boolean) => void;
	onGetKeplAddress?: () => void;
	onGetMetamaskAddress?: () => void;
};

export const AddressInput = ({
	address,
	canEdit = false,
	chainImage,
	chainName,
	hasError = false,
	label,
	onChangeAddress,
	onChangeConfirm,
	onGetKeplAddress,
	onGetMetamaskAddress,
}: Props) => {
	const [isEditing, setIsEditing] = useState(canEdit && !address);
	const [didVerifyWithdrawRisks, setDidVerifyWithdrawRisks] = useState(false);

	return (
		<AddressInputStyled className={`w-full flex-1 p-3 md:p-4 border`} hasError={hasError}>
			<div className="flex place-content-between">
				<div className="flex gap-2 items-center">
					<img alt={chainName} className="w-5 h-5" src={chainImage} />
					<p>
						{chainName} - {label}
					</p>
				</div>
				{hasError && <p className="text-error">Invalid address</p>}
			</div>
			{isEditing ? (
				<>
					<div className="flex gap-3 w-full border border-secondary-200 rounded-xl p-1 my-2">
						<img className="ml-2 h-3 my-auto" src="/public/assets/icons/warning.svg" />
						<p className="text-xs">
							Warning: Transferring to a central exchange address or the wrong address could result in loss of funds.
						</p>
					</div>
					<TextField
						label=""
						value={address}
						onChange={e => onChangeAddress && onChangeAddress(e.target.value)}
						buttonText="Enter"
						onButtonClick={() => {
							if (onChangeConfirm) {
								onChangeConfirm(true);
							}

							setIsEditing(false);
						}}
						disabledButton={!didVerifyWithdrawRisks || hasError || !address}
					/>
					<div className="flex mt-2 mb-1 mr-3 space-between items-center relative">
						{onGetKeplAddress && (
							<Button
								onClick={onGetKeplAddress}
								backgroundStyle="primary"
								style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
								<img alt="Keplr" className="w-5 h-5 mr-1.5" src="/public/assets/other-logos/keplr.png" />
								<p className="md:text-md leading-none">Keplr Address</p>
							</Button>
						)}
						{onGetMetamaskAddress && (
							<Button
								onClick={onGetMetamaskAddress}
								backgroundStyle="primary"
								style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
								<img alt="Metamask" className="w-6 h-6 mr-1" src="/public/assets/other-logos/metamask.png" />
								<p className="md:text-md leading-none">Metamask Address</p>
							</Button>
						)}
						<Checkbox
							label="I verify that I am sending to the correct address"
							onChange={() => setDidVerifyWithdrawRisks(!didVerifyWithdrawRisks)}
							labelStyle={{ fontSize: '12px' }}
						/>
					</div>
				</>
			) : (
				<p className="truncate overflow-ellipsis">
					{address}
					{!isEditing && canEdit && (
						<Button
							style={{
								borderRadius: '12px !important',
								margin: '6px',
								minWidth: '0',
							}}
							onClick={e => {
								e.preventDefault();
								setIsEditing(true);
								setDidVerifyWithdrawRisks(false);

								if (onChangeConfirm) {
									onChangeConfirm(false);
								}
							}}>
							Edit
						</Button>
					)}
				</p>
			)}
		</AddressInputStyled>
	);
};

const AddressInputStyled = styled.div<{ hasError?: boolean }>`
	border-color: ${props => (props.hasError ? props.theme.error : hexToRgb(props.theme.text, 0.1))};
	border-radius: 20px;

	color: ${props => props.theme.text};
`;
