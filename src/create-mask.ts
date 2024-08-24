import { type Placeholders, tsprintf, builtinPlaceholders } from './tsprintf';

export function createMask(
	mask: string,
	additionalPlaceholders?: Placeholders,
) {
	const format = (value: string) => {
		try {
			return tsprintf(mask, value.split(''), additionalPlaceholders);
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

	const unformat = (value: string) => {
		const placeholders = {
			...builtinPlaceholders,
			...additionalPlaceholders,
		};

		const maskRegexes = maskToRegexes(mask, placeholders);

		let out = '';

		for (let i = 0; i < value.length; i++) {
			const char = value[i] as string;
			const [placeholder, regex] = maskRegexes.shift() ?? [];

			if (!placeholder || !regex) {
				continue;
			}

			if (!char.match(regex)) {
				throw new Error(
					`Failed to unformat value '${value}' with mask '${mask}': Invalid replacement '${char}' for placeholder '${placeholder}' at index ${String(i)}`,
				);
			}

			out += char;
		}

		return out;
	};

	return {
		mask,
		format,
		unformat,
	};
}

function maskToRegexes(mask: string, placeholders: Placeholders) {
	return mask.split('').map<[string, RegExp | null]>((char) => {
		if (char in placeholders) {
			const regex = placeholders[char] as RegExp;

			return [char, regex];
		}

		return [char, null];
	});
}
