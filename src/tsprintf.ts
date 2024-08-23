export type Placeholders = Record<string, RegExp>;

export const builtinPlaceholders = Object.freeze({
	0: /^\d$/,
	A: /^[A-z]$/,
}) satisfies Placeholders;

// Inspired by PHP's `sprintf`, with slight modifications.
export function tsprintf(
	format: string,
	replacements: string[],
	additionalPlaceholders: Placeholders = {},
) {
	const placeholders = {
		...builtinPlaceholders,
		...additionalPlaceholders,
	};

	let out = '';
	let replacementIdx = 0;

	for (let i = 0; i < format.length; i++) {
		if (replacementIdx >= replacements.length) {
			break;
		}

		const char = format[i] as string;

		if (!(char in placeholders)) {
			out += char;
			continue;
		}

		const placeholderRegex =
			placeholders[char as keyof typeof placeholders];

		const replacement = replacements[replacementIdx] as string;

		if (!replacement.match(placeholderRegex)) {
			throw new Error(
				`Invalid replacement '${replacement}' for placeholder '${char}' at index ${String(i)}`,
			);
		}

		replacementIdx++;

		out += replacement;
	}

	return out;
}
