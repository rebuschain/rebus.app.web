//Colors for Redesign

export const colors = {
	primary: 'linear-gradient(74.53deg, #679AFD 0%, #6A4BE7 44.8%, #E950CB 100%)',
	linearGradient: 'linear-gradient(74.53deg, #679AFD 0%, #6A4BE7 65.1%)',
	trueBlack: '#000000',
	black: '#313846',
	deepBlack: '#2D2C34',
	white: '#FFFFFF',
	error: '#E14E3A',
	gray2: '#58667C',
	gray3: '#778193',
	gray4: '#959EAD',
	gray5: '#B5BAC5',
	gray6: '#D3D7DD',
	gray7: '#E8EBEF',
	gray8: '#F2F3F6',
	gray9: '#F8F9FA',
};

export function hexToRgb(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
