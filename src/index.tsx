import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { ROUTES } from './constants/routes';
import 'react-toastify/dist/ReactToastify.css';

import 'tippy.js/dist/tippy.css';
import { ToastProvider } from './components/common/toasts';
import { RouteWrapper } from './components/layouts/RouteWrapper';
import { AirdropPage } from './pages/airdrop';
import { AssetsPage } from './pages/assets';
import { BootstrapPage } from './pages/bootstrap';
import { GovernancePage } from './pages/governance';
import { GovernanceDetailsPage } from './pages/governance/[id]/GovernanceDetailsPage';
import { NotFoundPage } from './pages/NotFound';
import { PoolPage } from './pages/pool';
import { PoolsPage } from './pages/pools';
import { ToolsPage } from './pages/tools';
import { StoreProvider } from './stores';
import './styles/globals.scss';
import './styles/index.scss';
import { Terms } from './terms';
import { IBCHistoryNotifier } from './provider';
import { AccountConnectionProvider } from 'src/hooks/account/context';

/* Insync Code */
import reducer from './reducers';
import { InsyncWrapper } from './components/insync/InsyncWrapper';
import Home from './pages/Home';
import Proposals from './pages/Proposals';
import './styles/insync.scss';

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
									<Switch>
										<Route exact path="/">
											<Redirect to={ROUTES.POOLS} />
										</Route>
										<Route exact path={ROUTES.TOOLS}>
											<RouteWrapper>
												<ToolsPage />
											</RouteWrapper>
										</Route>
										<Route exact path={ROUTES.POOLS}>
											<RouteWrapper>
												<PoolsPage />
											</RouteWrapper>
										</Route>
										<Route path="/pool/:id">
											<RouteWrapper>
												<PoolPage />
											</RouteWrapper>
										</Route>
										<Route exact path="/assets">
											<RouteWrapper>
												<AssetsPage />
											</RouteWrapper>
										</Route>
										<Route exact path="/governance">
											<RouteWrapper>
												<GovernancePage />
											</RouteWrapper>
										</Route>
										<Route exact path="/governance/:id">
											<RouteWrapper>
												<GovernanceDetailsPage />
											</RouteWrapper>
										</Route>
										<Route exact path="/airdrop">
											<RouteWrapper>
												<AirdropPage />
											</RouteWrapper>
										</Route>
										<Route exact path={'/bootstrap'}>
											<RouteWrapper>
												<BootstrapPage />
											</RouteWrapper>
										</Route>
										<Route exact path={'/staking'}>
											<RouteWrapper>
												<InsyncWrapper>
													<Home />
												</InsyncWrapper>
											</RouteWrapper>
										</Route>
										<Route exact path={'/proposals'}>
											<RouteWrapper>
												<InsyncWrapper>
													<Proposals />
												</InsyncWrapper>
											</RouteWrapper>
										</Route>
										<Route>
											<RouteWrapper>
												<NotFoundPage />
											</RouteWrapper>
										</Route>
									</Switch>
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
