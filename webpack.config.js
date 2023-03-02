/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fs = require('fs');

const isEnvDevelopment = process.env.NODE_ENV !== 'production';
console.log('========\n', 'isEnvDevelopment', isEnvDevelopment, '\n========');
const isEnvAnalyzer = process.env.ANALYZER === 'true';
const commonResolve = dir => ({
	extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
	alias: {
		assets: path.resolve(__dirname, dir),
	},
	plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
});

const sassRule = {
	test: /(\.s?css)|(\.sass)$/,
	exclude: /node_modules/,
	oneOf: [
		{
			test: /\.(s?css)|(sass)$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'postcss-loader',
				{
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
					},
				},
			],
		},
		// if ext includes module as prefix, it perform by css loader.
		{
			test: /.module(\.s?css)|(\.sass)$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: {
							localIdentName: '[local]-[hash:base64]',
						},
						localsConvention: 'camelCase',
					},
				},
				{
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
					},
				},
			],
		},
		{
			use: [
				'style-loader',
				{ loader: 'css-loader', options: { modules: false } },
				{
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
					},
				},
			],
		},
	],
};

const cssRule = {
	test: /\.css$/,
	use: ['style-loader', 'css-loader'],
};

const tsRule = {
	test: /\.tsx?$/,
	exclude: /node_modules/,
	use: [
		{
			loader: require.resolve('ts-loader'),
			options: {
				transpileOnly: true,
			},
		},
	],
};
const jsxRule = {
	test: /\.(js|jsx)$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
	},
};
const fileRule = {
	test: /\.(svg|png|jpe?g|gif|woff|woff2|eot|ttf)$/i,
	exclude: /node_modules\/(?!svg-country-flags)/,
	use: [
		{
			loader: 'file-loader',
			options: {
				name: '[name].[ext]',
				publicPath: '/assets',
				outputPath: 'assets',
			},
		},
	],
};

//  https://webpack.js.org/guides/public-path/
const ASSET_PATH = process.env.ASSET_PATH || '/';
const webConfig = () => {
	return {
		mode: isEnvDevelopment ? 'development' : 'production',

		// In development environment, turn on source map.
		devtool: isEnvDevelopment ? 'source-map' : false,
		// In development environment, webpack watch the file changes, and recompile
		devServer: {
			static: {
				directory: path.join(__dirname, 'dist'),
			},
			port: 8080,
			historyApiFallback: true,
			hot: true,
		},
		entry: {
			main: ['./src/index.tsx'],
		},
		output: {
			path: path.resolve(__dirname, isEnvDevelopment ? 'dist' : 'prod'),
			filename: '[name].[contenthash].bundle.js',
			publicPath: ASSET_PATH,
			crossOriginLoading: 'anonymous',
		},
		performance: {
			hints: false,
			maxEntrypointSize: 512000,
			maxAssetSize: 512000,
		},
		resolve: commonResolve('src/assets'),
		module: {
			rules: [sassRule, cssRule, tsRule, jsxRule, fileRule],
		},
		optimization: {
			minimize: !isEnvDevelopment,
			usedExports: true,
		},
		plugins: [
			// Remove all and write anyway
			// TODO: Optimizing build process
			new NodePolyfillPlugin(),
			new CleanWebpackPlugin(),
			new CopyWebpackPlugin({
				patterns: [{ from: 'public', to: 'public' }],
			}),
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					memoryLimit: 4096,
				},
			}),
			new MiniCssExtractPlugin({
				filename: 'styles.css',
				chunkFilename: '[name].css',
			}),
			new HtmlWebpackPlugin({
				inject: false,
				filename: 'index.html',
				chunks: ['main'],
				templateContent: ({ htmlWebpackPlugin }) => {
					const htmlTemplate = fs.readFileSync(path.resolve(__dirname, 'src/index.html'), 'utf8');

					htmlWebpackPlugin.tags.headTags.forEach(tag => {
						if (tag.tagName === 'script' || tag.tagName === 'link') tag.attributes.crossorigin = 'anonymous';
					});

					return htmlTemplate
						.replace('</head>', htmlWebpackPlugin.tags.headTags + '\n</head>')
						.replace('</body>', htmlWebpackPlugin.tags.bodyTags + '\n</body>');
				},
			}),
			new WriteFilePlugin(),
			new webpack.EnvironmentPlugin(['NODE_ENV']),
			isEnvAnalyzer &&
				new BundleAnalyzerPlugin({
					analyzerMode: isEnvAnalyzer ? 'server' : 'disabled',
				}),
			// This makes it possible for us to safely use env vars on our code
			new webpack.DefinePlugin({
				'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
			}),
		].filter(Boolean),
		stats: {
			colors: true,
			hash: false,
			version: false,
			timings: false,
			assets: false,
			chunks: false,
			modules: false,
			reasons: false,
			children: false,
			source: false,
			errors: true,
			errorDetails: true,
			warnings: true,
			publicPath: false,
		},
	};
};

module.exports = webConfig;
