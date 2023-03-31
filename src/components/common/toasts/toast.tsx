import React, { FunctionComponent, ReactComponentElement, ReactElement, ReactNode } from 'react';
import { toast, ToastOptions } from 'react-toastify';

const CloseButton: FunctionComponent<React.PropsWithChildren<{ closeToast: () => void }>> = ({ closeToast }) => (
	<button
		onClick={closeToast}
		className="hover:opacity-75 absolute top-2 md:-top-2 right-2 md:-left-2 z-100 h-5 md:h-6 w-5 md:w-6">
		<img alt="x" className="w-full h-full" src="/public/assets/icons/toast-close.png" />
	</button>
);

const defaultOptions = {
	position: 'top-right',
	autoClose: 7000,
	hideProgressBar: true,
	closeOnClick: false,
	pauseOnHover: true,
	draggable: false,
	progress: undefined,
	pauseOnFocusLoss: false,
	closeButton: CloseButton,
};

const defaultExtraData = { message: '', customLink: '' };

export enum TToastType {
	TX_BROADCASTING,
	TX_SUCCESSFUL,
	TX_FAILED,
}

interface IToastExtra {
	message?: string;
	customLink?: string;
}

export type DisplayToastFn = ((type: TToastType.TX_BROADCASTING, options?: Partial<ToastOptions>) => void) &
	((
		type: TToastType.TX_SUCCESSFUL | TToastType.TX_FAILED,
		extraData?: IToastExtra,
		options?: Partial<ToastOptions>
	) => void);

export interface DisplayToast {
	displayToast: DisplayToastFn;
}

export const displayToast: DisplayToastFn = (
	type: TToastType,
	extraData?: IToastExtra | Partial<ToastOptions>,
	options?: Partial<ToastOptions>
) => {
	const refinedOptions = type === TToastType.TX_BROADCASTING ? extraData ?? {} : options ?? {};
	const refinedExtraData = extraData ? extraData : {};
	const inputExtraData = { ...defaultExtraData, ...refinedExtraData } as IToastExtra;
	const inputOptions = {
		...defaultOptions,
		...refinedOptions,
	} as ToastOptions;
	if (type === TToastType.TX_BROADCASTING) {
		toast(<ToastTxBroadcasting />, inputOptions);
	} else if (type === TToastType.TX_SUCCESSFUL) {
		toast(<ToastTxSuccess link={inputExtraData.customLink || ''} message={inputExtraData.message} />, inputOptions);
	} else if (type === TToastType.TX_FAILED) {
		toast(<ToastTxFailed message={inputExtraData.message || ''} />, inputOptions);
	} else {
		console.error(`Undefined toast type - ${type}`);
	}
};

const ToastTxBroadcasting: FunctionComponent<React.PropsWithChildren<unknown>> = () => (
	<div className="flex gap-3 md:gap-3.75">
		<img alt="ldg" className="s-spin w-7 h-7" src="/public/assets/icons/loading.png" />
		<section className="text-white-high">
			<h6 className="mb-2 text-base md:text-lg">Transaction Broadcasting</h6>
			<p className="text-xs md:text-sm">Waiting for transaction to be included in the block</p>
		</section>
	</div>
);

const ToastTxFailed: FunctionComponent<React.PropsWithChildren<{ message: string }>> = ({ message }) => (
	<div className="flex gap-3 md:gap-3.75">
		<img className="w-8 h-8" alt="x" src="/public/assets/icons/failed-tx.png" />
		<section className="text-white-high">
			<h6 className="mb-2 text-base md:text-lg">Transaction Failed</h6>
			<p className="text-xs md:text-sm">{message}</p>
		</section>
	</div>
);

const ToastTxSuccess: FunctionComponent<React.PropsWithChildren<{ link: string; message?: string }>> = ({
	link,
	message,
}) => (
	<div className="flex gap-3 md:gap-3.75">
		<img className="w-8 h-8" alt="b" src="/public/assets/icons/toast-success.png" />
		<section className="text-white-high">
			<h6 className="mb-2 text-base md:text-lg">Transaction Successful</h6>
			{message && <p className="text-xs md:text-sm">{message}</p>}
			<a target="__blank" href={link} className="text-xs md:text-sm inline hover:opacity-75 cursor-pointer">
				View explorer <img alt="link" src="/public/assets/icons/link.png" className="inline-block h-4 w-4 mb-0.75" />
			</a>
		</section>
	</div>
);
