import { expect, afterEach, vitest } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

global.ResizeObserver = vitest.fn().mockImplementation(() => ({
	observe: vitest.fn(),
	unobserve: vitest.fn(),
	disconnect: vitest.fn(),
}));
