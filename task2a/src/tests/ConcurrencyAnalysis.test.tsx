import { render, screen } from '@testing-library/react';
import ConcurrencyAnalysis from '../components/ConcurrencyAnalysis';
import { describe, expect, it } from 'vitest';

describe('ConcurrencyAnalysis', () => {
	it('renders component with title and description', () => {
		render(<ConcurrencyAnalysis chargePoints={10} />);
		expect(screen.getByText('Concurrency Factor Analysis')).toBeInTheDocument();
		expect(
			screen.getByText(
				'How the concurrency factor changes with number of charging points'
			)
		).toBeInTheDocument();
	});

	it('renders with no charge points', () => {
		render(<ConcurrencyAnalysis chargePoints={0} />);
		expect(screen.getByText('Concurrency Factor Analysis')).toBeInTheDocument();
	});
});
