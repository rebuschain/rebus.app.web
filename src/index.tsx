import env from '@beam-australia/react-env';

const publicPath = env('PUBLIC_PATH');

if (publicPath) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	__webpack_public_path__ = publicPath;
}

import { ThemeProvider, Theme, StyledEngineProvider, createTheme, makeStyles } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import React, { FunctionComponent, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { Loader } from 'src/components/common/loader';
import { ROUTES } from './constants/routes';
import 'react-toastify/dist/ReactToastify.css';

import 'tippy.js/dist/tippy.css';
import { ToastProvider } from './components/common/toasts';
import { NotFoundPage } from './pages/not-found';
import { StoreProvider } from './stores';
import './styles/globals.scss';
import './styles/index.scss';
import { Terms } from './terms';
import { IBCHistoryNotifier } from './provider';
import { AccountConnectionProvider } from 'src/hooks/account/context';
import styled from '@emotion/styled';
import '@mui/styles';

import { store } from './reducers/store';
import { RouteWrapper } from './components/layouts/route-wrapper';

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

const LoaderStyled = styled(Loader)`
	width: 6rem;
	height: 6rem;
	@media (min-width: 768px) {
		width: 12.5rem;
		height: 12.5rem;
	}
`;

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);

const queryClient = new QueryClient();
const theme = createTheme();

const Router: FunctionComponent = () => {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<QueryClientProvider client={queryClient}>
						<Provider store={store}>
							<StoreProvider>
								<ToastProvider>
									<AccountConnectionProvider>
										<IBCHistoryNotifier />
										<Terms />
										<div className="h-screen z-0">
											<BrowserRouter>
												<RouteWrapper>
													<Suspense fallback={() => <LoaderStyled />}>
														<Switch>
															<Route exact path="/">
																<Redirect to={ROUTES.ASSETS} />
															</Route>
															<Route
																exact
																path={ROUTES.IBC_TRANSFER}
																component={lazy(() => import('./pages/ibc-transfer'))}
															/>
															<Route exact path={ROUTES.NFT_ID} component={lazy(() => import('./pages/nft-id'))} />
															<Route exact path={ROUTES.TOOLS} component={lazy(() => import('./pages/tools'))} />
															<Route exact path={ROUTES.ASSETS} component={lazy(() => import('./pages/assets'))} />
															<Route exact path={ROUTES.AIRDROP} component={lazy(() => import('./pages/airdrop'))} />
															<Route exact path={ROUTES.STAKE} component={lazy(() => import('./pages/home'))} />
															<Route exact path={ROUTES.VOTE} component={lazy(() => import('./pages/proposals'))} />
															<Route
																exact
																path={`${ROUTES.VOTE}/:proposalId`}
																component={lazy(() => import('./pages/proposal-details'))}
															/>
															<Route
																exact
																path={ROUTES.WALLET_CONNECT}
																component={lazy(() => import('./pages/wallet-connect'))}
															/>
															<Route>
																<NotFoundPage />
															</Route>
														</Switch>
													</Suspense>
												</RouteWrapper>
											</BrowserRouter>
										</div>
										<ToastContainer transition={Bounce} />
									</AccountConnectionProvider>
								</ToastProvider>
							</StoreProvider>
						</Provider>
					</QueryClientProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

ReactDOM.render(<Router />, document.getElementById('app'));
