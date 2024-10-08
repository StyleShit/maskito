import { describe, expect, expectTypeOf, it } from 'vitest';
import { createMask } from '../index';

describe('Maskito', () => {
	it('should fully format a string based on a mask', () => {
		// Arrange.
		const { format } = createMask('AAA (000)-000-000');

		// Act.
		const result = format('USA1234567890');

		// Assert.
		expect(result).toBe('USA (123)-456-789');
	});

	it('should partially format a string based on a mask', () => {
		// Arrange.
		const { format } = createMask('AAA (000)-000-000');

		// Act.
		const result = format('USA1234');

		// Assert.
		expect(result).toBe('USA (123)-4');
	});

	it('should support additional placeholders', () => {
		// Arrange.
		const { format } = createMask('D00.0', {
			D: /^\$$/,
		});

		// Act.
		const result = format('$123');

		// Assert.
		expect(result).toBe('$12.3');
	});

	it('should throw when a replacement does not match the placeholder', () => {
		// Arrange.
		const { format } = createMask('A00');

		// Act & Assert.
		expect(() => format('USA')).toThrowError(
			"Failed to format value 'USA' with mask 'A00': Invalid replacement 'S' for placeholder '0' at index 1",
		);
	});

	it('should unformat a string based on a mask', () => {
		// Arrange.
		const { unformat } = createMask('AAA (000)-000');

		// Act.
		const fullyMasked = unformat('USA (123)-4');
		const partiallyMasked = unformat('USA(123 4');
		const unmasked = unformat('USA1234');

		// Assert.
		expect(fullyMasked).toBe('USA1234');
		expect(partiallyMasked).toBe('USA1234');
		expect(unmasked).toBe('USA1234');
	});

	it('should expose the mask', () => {
		// Arrange.
		const { mask } = createMask('000');

		// Assert.
		expect(mask).toBe('000');
	});

	it('should have proper types', () => {
		// Assert.
		expectTypeOf(createMask).toEqualTypeOf<
			(
				mask: string,
				placeholders?: Record<string, RegExp>,
			) => {
				mask: string;
				format: (value: string) => string;
				unformat: (value: string) => string;
			}
		>();
	});
});
