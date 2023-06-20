import React, { FunctionComponent } from 'react';
import cn from 'clsx';
import { Container } from '../../containers';
import { TCardTypes } from '../../../interfaces';
import { LAYOUT, TSIDEBAR_ITEM, TSIDEBAR_SELECTED_CHECK } from '../../../constants';
import { mapKeyValues } from '../../../utils/scripts';
import { SidebarItem } from './sidebar-item';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarBottom } from './sidebar-bottom';
import isArray from 'lodash-es/isArray';
import useWindowSize from 'src/hooks/use-window-size';
import { observer } from 'mobx-react-lite';
import { useStore } from 'src/stores';

export const Sidebar: FunctionComponent<React.PropsWithChildren<unknown>> = observer(function SideBar() {
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location?.pathname;

	const [isOpenSidebar, setIsOpenSidebar] = React.useState<boolean>(false);

	const [isOnTop, setIsOnTop] = React.useState<boolean>(true);

	const { isMobileView } = useWindowSize();

	const { chainStore, queriesStore, featureFlagStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const { claimEnabled } = queries.rebus.queryClaimParams;

	const closeSidebar = () => setIsOpenSidebar(false);

	React.useEffect(() => {
		const checkAndSetWindowIsOnTop = () => {
			const newIsOnTop = window.scrollY === 0;
			setIsOnTop(newIsOnTop);
		};

		window.addEventListener('scroll', checkAndSetWindowIsOnTop);
		checkAndSetWindowIsOnTop();

		return () => window.removeEventListener('scroll', checkAndSetWindowIsOnTop);
	}, []);

	return (
		<React.Fragment>
			{isOpenSidebar && (
				<div className="fixed z-20 w-full h-full bg-black bg-opacity-75 md:hidden" onClick={closeSidebar} />
			)}
			<div
				className={`w-full overflow-x-visible max-w-sidebar-open min-w-sidebar-open pointer-events-none h-full z-100 absolute md:relative ${
					isOpenSidebar ? 'block' : 'hidden'
				} md:block`}>
				<div className="fixed h-full">
					<Container
						className={cn(
							'backdrop-blur-lg h-full transition-all pointer-events-auto fixed overflow-x-hidden min-w-sidebar-open max-w-sidebar-open'
						)}
						type={TCardTypes.TRANSPARENT}>
						<div className="w-full h-full p-5 md:py-6 flex flex-col justify-between">
							<div>
								<section className="mb-15 flex flex-row items-center">
									<div className="flex justify-center container">
										<img
											className="cursor-pointer h-10"
											src="/public/assets/main/rebus-logo.svg"
											alt="rebus logo"
											onClick={() => navigate('/')}
										/>
									</div>
								</section>
								<section>
									{mapKeyValues(LAYOUT.SIDEBAR, (_: string, sidebarItem: TSIDEBAR_ITEM) => sidebarItem)
										.filter((sidebarItem: TSIDEBAR_ITEM) => {
											if (sidebarItem.TYPE === 'airdrop') {
												return claimEnabled;
											}

											if (sidebarItem.TYPE === 'assets') {
												return featureFlagStore.featureFlags.assetsPage;
											}

											if (sidebarItem.TYPE === 'ibc-transfer') {
												return featureFlagStore.featureFlags.ibcTransferPage;
											}

											if (sidebarItem.TYPE === 'nft-id') {
												return featureFlagStore.featureFlags.nftIdPage;
											}

											return true;
										})
										/*.filter(sidebarItem => {
											if (isMobileView && (sidebarItem.TEXT === 'Stake' || sidebarItem.TEXT === 'Vote')) {
												return false;
											}
											return true;
										})*/
										.map(sidebarItem => (
											<SidebarItem
												key={sidebarItem.TEXT}
												selected={pathnameCheck(pathname, sidebarItem.SELECTED_CHECK)}
												sidebarItem={sidebarItem}
												closeSidebar={closeSidebar}
											/>
										))}
								</section>
							</div>
							<div>
								<SidebarBottom />
							</div>
						</div>
					</Container>
				</div>
			</div>
			<div
				className={`fixed z-20 top-0 left-0 p-5 md:py-6 w-full flex justify-between items-center md:hidden bg-black ${
					isOnTop || isOpenSidebar ? 'bg-opacity-0' : 'bg-opacity-75'
				} ${!isOpenSidebar ? 'transition-colors duration-300' : ''}`}>
				<img
					className="h-10 ml-3"
					src="/public/assets/main/rebus-logo.svg"
					alt="rebus-logo"
					onClick={() => navigate('/')}
				/>
				<img
					className="h-10 -mr-2.5"
					src={`/public/assets/icons/${isOpenSidebar ? 'close' : 'menu'}.svg`}
					alt="hamburger menu"
					onClick={() => setIsOpenSidebar(!isOpenSidebar)}
				/>
			</div>
		</React.Fragment>
	);
});

const pathnameCheck = (str: string, routes: TSIDEBAR_SELECTED_CHECK) => {
	if (isArray(routes)) {
		for (const route of routes) {
			if (route instanceof RegExp) {
				if (route.test(str)) return true;
			} else if ((route as string) === str) return true;
		}
	} else {
		if (str === (routes as string)) return true;
	}
	return false;
};
