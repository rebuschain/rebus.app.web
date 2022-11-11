declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.png' {
	const value: any;
	export = value;
}

declare module 'image-screenshot';
