import { type Placeholders, tsprintf } from './tsprintf';

export function createMask(mask: string, placeholders?: Placeholders) {
	const format = (value: string) => {
		try {
			return tsprintf(mask, value.split(''), placeholders);
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e);

			throw new Error(
				`Failed to format value '${value}' with mask '${mask}': ${message}`,
				{
					cause: e,
				},
			);
		}
	};

	return {
		mask,
		format,
	};
}
