import { render, screen } from '@testing-library/react';
import DailyPowerProfile from '../components/DailyPowerProfile';
import { describe, expect, it } from 'vitest';

describe('DailyPowerProfile', () => {
	it('renders the component title correctly', () => {
		render(<DailyPowerProfile />);
		expect(screen.getByText('Daily Power Profile')).toBeInTheDocument();
	});

	it('matches snapshot', () => {
		const { container } = render(<DailyPowerProfile />);
		expect(container).toMatchSnapshot();
	});

	it('renders with correct styling classes', () => {
		render(<DailyPowerProfile />);
		expect(screen.getByTestId('daily-power-profile')).toHaveClass(
			'bg-white',
			'rounded-lg'
		);
	});
});
