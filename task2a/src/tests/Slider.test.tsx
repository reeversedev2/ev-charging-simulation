import { render, fireEvent, screen } from '@testing-library/react';
import Slider from '../components/Slider';
import { describe, expect, it, vitest } from 'vitest';

describe('Slider', () => {
	const defaultProps = {
		label: 'Test Slider',
		minRange: '0',
		maxRange: '100',
		value: 50,
		setValue: vitest.fn(),
		unit: '%',
	};

	it('renders with all required props', () => {
		render(<Slider {...defaultProps} />);

		expect(screen.getByText('Test Slider')).toBeInTheDocument();
		expect(screen.getByRole('slider')).toHaveValue('50');
		expect(screen.getByText('0%')).toBeInTheDocument();
		expect(screen.getByText('50%')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('renders without unit prop', () => {
		const propsWithoutUnit = {
			...defaultProps,
			unit: undefined,
		};
		render(<Slider {...propsWithoutUnit} />);

		expect(screen.getByText('0')).toBeInTheDocument();
		expect(screen.getByText('50')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument();
	});

	it('calls setValue when slider value changes', () => {
		render(<Slider {...defaultProps} />);

		const slider = screen.getByRole('slider');
		fireEvent.change(slider, { target: { value: '75' } });

		expect(defaultProps.setValue).toHaveBeenCalledWith(75);
	});

	it('respects min and max range values', () => {
		render(<Slider {...defaultProps} />);

		const slider = screen.getByRole('slider');
		expect(slider).toHaveAttribute('min', '0');
		expect(slider).toHaveAttribute('max', '100');
	});
});
