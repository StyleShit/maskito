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
		let regexIdx = 0;

		for (let i = 0; i < value.length; i++) {
			const char = value[i] as string;
			const regex = maskRegexes[regexIdx];

			if (!regex || !char.match(regex)) {
				continue;
			}

			out += char;
			regexIdx++;
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
	return mask.split('').reduce<RegExp[]>((acc, char) => {
		if (char in placeholders) {
			const regex = placeholders[char] as RegExp;

			acc.push(regex);
		}

		return acc;
	}, []);
}
