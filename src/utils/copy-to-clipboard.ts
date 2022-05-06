const fallbackCopyTextToClipboard = (text: string) => {
	const textArea = document.createElement('textarea');
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');

		if (successful) {
			document.body.removeChild(textArea);
			return successful;
		}
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
		document.body.removeChild(textArea);
		return false;
	}
};

export const copyTextToClipboard = (text: string, onSuccess: () => void = () => null) => {
	if (!navigator.clipboard && fallbackCopyTextToClipboard(text) && onSuccess) {
		onSuccess();
	}

	navigator.clipboard.writeText(text).then(
		() => {
			if (onSuccess) {
				onSuccess();
			}
		},
		err => {
			console.error('Async: Could not copy text: ', err);
		}
	);
};
