import React from 'react';
import { Button } from './button';

interface ButtonProps {
	toggleTheme: () => void;
	isDark: boolean;
}

export const ThemeToggleButton: React.FC<ButtonProps> = ({ toggleTheme, isDark }) => {
	return (
		<Button
			backgroundStyle="ghost"
			onClick={toggleTheme}
			style={{
				position: 'fixed',
				top: '10px',
				right: '10px',
				zIndex: 1000,
				padding: '10px',
			}}>
			{isDark ? (
				<img alt="dark mode" src="/public/assets/icons/dark-mode.svg" />
			) : (
				<img alt="light mode" src="/public/assets/icons/light-mode.svg" style={{ filter: 'invert(1)' }} />
			)}
		</Button>
	);
};
