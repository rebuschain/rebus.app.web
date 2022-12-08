import env from '@beam-australia/react-env';

const publicPath = env('PUBLIC_PATH');

if (publicPath) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	__webpack_public_path__ = publicPath;
}

import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
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

import { store } from './reducers/store';
import { RouteWrapper } from './components/layouts/route-wrapper';

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
const theme = createMuiTheme();

const Router: FunctionComponent = () => {
	return (
		<ThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={DayJsUtils}>
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
																											<Route
														exact
														path={[ROUTES.NFT_ID, ROUTES.NFT_ID_EDIT]}
														component={lazy(() => import('./pages/nft-id'))}
													/>
													<Route
														exact
														path={ROUTES.NFT_ID_VIEW}
														component={lazy(() => import('./pages/nft-id-view'))}
													/>
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
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	);
};

ReactDOM.render(<Router />, document.getElementById('app'));
