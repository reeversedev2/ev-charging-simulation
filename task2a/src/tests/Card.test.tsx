import { render, screen } from '@testing-library/react';
import Card from '../components/Card';
import { describe, expect, it } from 'vitest';

describe('Card Component', () => {
	it('renders with correct stats and children', () => {
		render(<Card stats={100}>Battery Level</Card>);

		expect(screen.getByText('Battery Level')).toBeInTheDocument();
		expect(screen.getByText('100 kWh')).toBeInTheDocument();
	});

	it('displays stats with kWh unit', () => {
		render(<Card stats={75}>Power Stats</Card>);
		expect(screen.getByText('75 kWh')).toBeInTheDocument();
	});

	it('applies correct styling classes', () => {
		render(<Card stats={25}>Test Card</Card>);
		const cardElement = screen.getByTestId('card');
		expect(cardElement).toHaveClass(
			'bg-white',
			'rounded-lg',
			'shadow-sm',
			'border',
			'border-gray-200',
			'p-4'
		);
	});
});
