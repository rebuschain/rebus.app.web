import colors from 'src/colors';

export const darkTheme = {
	background: colors.deepBlack,
	text: colors.white,
	gray: {
		lightest: colors.gray2,
		lighter: colors.gray3,
		light: colors.gray4,
		medium: colors.gray5,
		dark: colors.gray6,
		darker: colors.gray7,
		darkest: colors.gray8,
	},
	primary: colors.primary,
	linearGradient: colors.linearGradient,
	error: colors.error,
};

export const lightTheme = {
	background: colors.white,
	text: colors.trueBlack,
	gray: {
		lightest: colors.gray8,
		lighter: colors.gray7,
		light: colors.gray6,
		medium: colors.gray5,
		dark: colors.gray4,
		darker: colors.gray3,
		darkest: colors.gray2,
	},
	primary: colors.primary,
	linearGradient: colors.linearGradient,
	error: colors.error,
};
