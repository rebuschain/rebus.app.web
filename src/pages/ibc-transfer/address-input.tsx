import classNames from 'classnames';
import React, { ChangeEventHandler, useState } from 'react';
import { AmountInput } from 'src/components/form/inputs';
import { Button } from 'src/components/common/button';

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
		<div
			className={`w-full flex-1 p-3 md:p-4 border ${
				!hasError ? 'border-white-faint' : 'border-missionError'
			} rounded-2xl`}>
			<div className="flex place-content-between">
				<div className="flex gap-2 items-center">
					<img alt={chainName} className="w-5 h-5" src={chainImage} />
					<p className="text-white-high">
						{chainName} - {label}
					</p>
				</div>
				{!!hasError && <p className="text-error">Invalid address</p>}
			</div>
			{isEditing ? (
				<>
					<div className="flex gap-3 w-full border border-secondary-200 rounded-xl p-1 my-2">
						<img className="ml-2 h-3 my-auto" src="/public/assets/icons/warning.svg" />
						<p className="text-xs">
							Warning: Transferring to a central exchange address or the wrong address could result in loss of funds.
						</p>
					</div>
					<div className="flex gap-2 place-content-between p-1 bg-background rounded-lg">
						<AmountInput
							style={{ fontSize: '14px', textAlign: 'left' }}
							value={address}
							onChange={e => onChangeAddress && onChangeAddress(e.target.value)}
						/>
						<button
							onClick={() => {
								if (onChangeConfirm) {
									onChangeConfirm(true);
								}

								setIsEditing(false);
							}}
							className={classNames('my-auto p-1.5 flex justify-center items-center rounded-md md:static', {
								'bg-primary-200 hover:opacity-75 cursor-pointer ': didVerifyWithdrawRisks && !hasError,
								'opacity-30': !didVerifyWithdrawRisks || !!hasError || !address,
							})}
							disabled={!didVerifyWithdrawRisks || !!hasError || !address}>
							<p className="text-xs text-white-high leading-none">Enter</p>
						</button>
					</div>
					<div className="flex space-between">
						<div className="flex mt-2 mb-1 mr-3 items-center relative">
							{onGetKeplAddress && (
								<Button onClick={onGetKeplAddress} backgroundStyle="primary" style={{ marginRight: '8px' }}>
									<img alt="Keplr" className="w-5 h-5 mr-1.5" src="/public/assets/other-logos/keplr.png" />
									<p className="text-xs text-white-high leading-none">Keplr Address</p>
								</Button>
							)}
							{onGetMetamaskAddress && (
								<Button onClick={onGetMetamaskAddress} backgroundStyle="primary">
									<img alt="Metamask" className="w-6 h-6 mr-1" src="/public/assets/other-logos/metamask.png" />
									<p className="text-xs text-white-high leading-none">Metamask Address</p>
								</Button>
							)}
						</div>
						<label
							htmlFor="checkbox"
							className="text-xs flex justify-end items-center mr-2 mt-2 mb-1 cursor-pointer"
							onClick={() => setDidVerifyWithdrawRisks(!didVerifyWithdrawRisks)}>
							{didVerifyWithdrawRisks ? (
								<div className="mr-2.5">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4ZM20.6717 7.43656C21.1889 6.78946 21.0837 5.84556 20.4366 5.32831C19.7895 4.81106 18.8456 4.91633 18.3283 5.56344L10.2439 15.6773L5.61855 10.5006C5.06659 9.88282 4.11834 9.82948 3.50058 10.3814C2.88282 10.9334 2.82948 11.8817 3.38145 12.4994L9.18914 18.9994C9.48329 19.3286 9.90753 19.5115 10.3488 19.4994C10.7902 19.4873 11.2037 19.2814 11.4794 18.9366L20.6717 7.43656Z"
											fill="white"
										/>
									</svg>
								</div>
							) : (
								<div className="w-6 h-6 border-2 border-iconDefault mr-2.5 rounded" />
							)}
							I verify that I am sending to the correct address
						</label>
					</div>
				</>
			) : (
				<p className="text-white-disabled truncate overflow-ellipsis">
					{address}
					{!isEditing && canEdit && (
						<Button
							style={{
								borderRadius: '12px !important',
								fontSize: '11px',
								marginBottom: '3px',
								marginLeft: '6px',
								minWidth: '0',
								padding: '2px 8px',
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
		</div>
	);
};
