import React, { FunctionComponent } from 'react';
import cn from 'clsx';
import { Container } from '../../containers';
import { LAYOUT, TSIDEBAR_ITEM, TSIDEBAR_SELECTED_CHECK } from '../../../constants';
import { mapKeyValues } from '../../../utils/scripts';
import { SidebarItem } from './sidebar-item';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarBottom } from './sidebar-bottom';
import isArray from 'lodash-es/isArray';
import useWindowSize from 'src/hooks/use-window-size';
import { observer } from 'mobx-react-lite';
import { useStore } from 'src/stores';
import styled from 'styled-components';
import Logo from './logo';

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
		<SideBarStyled>
			{isOpenSidebar && <div className="fixed z-20 w-full h-full md:hidden" onClick={closeSidebar} />}
			<div
				className={`w-full max-w-sidebar-open min-w-sidebar-open pointer-events-none h-full z-100 absolute md:relative ${
					isOpenSidebar ? 'block' : 'hidden'
				} md:block`}>
				<div className="fixed h-full">
					<Container className={cn('transition-all pointer-events-auto fixed min-w-sidebar-open max-w-sidebar-open')}>
						<div className="w-full h-full p-5 md:py-6 flex flex-col justify-between">
							<div>
								<section className="mb-15 flex flex-row items-center">
									<div className="flex justify-center container">
										<Logo onClick={() => navigate('/')} />
									</div>
								</section>
								<section>
									{mapKeyValues(LAYOUT.SIDEBAR, (_: string, sidebarItem: TSIDEBAR_ITEM) => sidebarItem)
										.filter((sidebarItem: TSIDEBAR_ITEM) => {
											if (sidebarItem.TYPE === 'assets') {
												return featureFlagStore.featureFlags.assetsPage;
											}

											if (sidebarItem.TYPE === 'ibc-transfer') {
												return featureFlagStore.featureFlags.ibcTransferPage;
											}

											if (sidebarItem.TYPE === 'nft-id') {
												return featureFlagStore.featureFlags.nftIdPage;
											}

											if (['evm', 'explorer'].includes(sidebarItem.TYPE)) {
												return featureFlagStore.featureFlags.sidebarIntegration;
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
											<React.Fragment key={sidebarItem.TEXT}>
												{sidebarItem.LINK ? (
													<a href={sidebarItem.LINK} target="blank" rel="noopener noreferrer">
														<SidebarItem sidebarItem={sidebarItem} closeSidebar={closeSidebar} />
													</a>
												) : (
													<div className="flex justify-between">
														<SidebarItem
															key={sidebarItem.TEXT}
															selected={pathnameCheck(pathname, sidebarItem.SELECTED_CHECK)}
															sidebarItem={sidebarItem}
															closeSidebar={closeSidebar}
														/>
														{sidebarItem.SUBLAYOUT && (
															<SubMenuIconStyled selected={pathnameCheck(pathname, sidebarItem.SELECTED_CHECK)}>
																<p className="ml-auto">&#62;</p>
															</SubMenuIconStyled>
														)}
													</div>
												)}
												{sidebarItem.TYPE === 'tools' &&
													pathnameCheck(pathname, sidebarItem.SELECTED_CHECK) &&
													generateSublayout(LAYOUT.SIDEBAR.TOOLS.SUBLAYOUT, pathname, closeSidebar)}
												{sidebarItem.TYPE === 'explorer' &&
													pathnameCheck(pathname, sidebarItem.SELECTED_CHECK) &&
													generateSublayout(LAYOUT.SIDEBAR.EXPLORER.SUBLAYOUT, pathname, closeSidebar)}
												{sidebarItem.TYPE === 'evm' &&
													pathnameCheck(pathname, sidebarItem.SELECTED_CHECK) &&
													generateSublayout(LAYOUT.SIDEBAR.EVM.SUBLAYOUT, pathname, closeSidebar)}
											</React.Fragment>
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
				className={`fixed z-20 top-0 left-0 p-5 md:py-6 w-full flex justify-between items-center md:hidden ${
					isOnTop || isOpenSidebar ? 'bg-opacity-0' : 'bg-opacity-75'
				} ${!isOpenSidebar ? 'transition-colors duration-300' : ''}`}>
				<div className="flex justify-center container">
					<Logo onClick={() => navigate('/')} />
				</div>
				<img
					className="h-10 -mr-2.5"
					src={`/public/assets/icons/${isOpenSidebar ? 'close' : 'menu'}.svg`}
					alt="hamburger menu"
					onClick={() => setIsOpenSidebar(!isOpenSidebar)}
				/>
			</div>
		</SideBarStyled>
	);
});

function generateSublayout(sidebarItems: Record<string, TSIDEBAR_ITEM>, pathname: string, closeSidebar: () => void) {
	return (
		<ul className="pl-2">
			{mapKeyValues(sidebarItems, (_: string, subsectionItem: TSIDEBAR_ITEM) => (
				<React.Fragment key={subsectionItem.TEXT}>
					{subsectionItem.LINK ? (
						<a href={subsectionItem.LINK} target="_self" rel="noopener noreferrer">
							<SidebarItem sidebarItem={subsectionItem} closeSidebar={closeSidebar} />
						</a>
					) : (
						<SidebarItem
							key={subsectionItem.TEXT}
							selected={pathnameCheck(pathname, subsectionItem.SELECTED_CHECK as TSIDEBAR_SELECTED_CHECK)}
							sidebarItem={subsectionItem}
							closeSidebar={closeSidebar}
						/>
					)}
				</React.Fragment>
			))}
		</ul>
	);
}

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

const SideBarStyled = styled.div`
	background: ${props => props.theme.background};
`;

const SubMenuIconStyled = styled.p<{ selected: boolean }>`
	color: ${props => (props.selected ? 'transparent' : props.theme.text)};
	background-image: ${props => (props.selected ? props.theme.linearGradient : 'none')};
	background-clip: ${props => (props.selected ? 'text' : 'initial')};
	-webkit-background-clip: ${props => (props.selected ? 'text' : 'initial')};
	display: flex;
	align-items: center;
`;
