import { colors } from 'src/colors';

export const darkTheme = {
	background: colors.deepBlack,
	text: colors.white,
	gray: {
		lightest: colors.black,
		lighter: colors.gray2,
		light: colors.gray3,
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
		dark: colors.gray3,
		darker: colors.gray2,
		darkest: colors.black,
	},
	primary: colors.primary,
	linearGradient: colors.linearGradient,
	error: colors.error,
};
