import env from '@beam-australia/react-env';

const publicPath = env('PUBLIC_PATH');

if (publicPath) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	__webpack_public_path__ = publicPath;
}

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import React, { FunctionComponent, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { Loader } from 'src/components/common/Loader';
import { ROUTES } from './constants/routes';
import 'react-toastify/dist/ReactToastify.css';

import 'tippy.js/dist/tippy.css';
import { ToastProvider } from './components/common/toasts';
import { NotFoundPage } from './pages/NotFound';
import { StoreProvider } from './stores';
import './styles/globals.scss';
import './styles/index.scss';
import { Terms } from './terms';
import { IBCHistoryNotifier } from './provider';
import { AccountConnectionProvider } from 'src/hooks/account/context';
import styled from '@emotion/styled';

/* Insync Code */
import reducer from './reducers';
import { RouteWrapper } from './components/layouts/RouteWrapper';

const LoaderStyled = styled(Loader)`
	width: 6rem;
	height: 6rem;
	@media (min-width: 768px) {
		width: 12.5rem;
		height: 12.5rem;
	}
`;

const store = createStore(
	reducer,
	composeWithDevTools({
		trace: true,
	})(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof store.getState>;
/* End Insync Code */

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);

const queryClient = new QueryClient();

const Router: FunctionComponent = () => {
	return (
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
												<Route exact path={ROUTES.TOOLS} component={lazy(() => import('./pages/tools'))} />
												{/*<Route exact path={ROUTES.POOLS} component={lazy(() => import('./pages/pools'))} />
												<Route path="/pool/:id" component={lazy(() => import('./pages/pool'))} />
												<Route exact path="/governance" component={lazy(() => import('./pages/governance'))} />
												<Route exact path="/governance/:id" component={lazy(() => import('./pages/governance/[id]/GovernanceDetailsPage'))} /> */}
												<Route exact path={ROUTES.ASSETS} component={lazy(() => import('./pages/assets'))} />
												<Route exact path={ROUTES.AIRDROP} component={lazy(() => import('./pages/airdrop'))} />
												{/* <Route exact path={'/bootstrap'} component={lazy(() => import('./pages/bootstrap'))} /> */}
												<Route exact path={ROUTES.STAKE} component={lazy(() => import('./pages/Home'))} />
												<Route exact path={ROUTES.VOTE} component={lazy(() => import('./pages/Proposals'))} />
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
	);
};

ReactDOM.render(<Router />, document.getElementById('app'));
