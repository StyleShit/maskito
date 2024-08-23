export type Placeholders = Record<string, RegExp>;

const builtinPlaceholders = {
	0: /^\d$/,
	A: /^[A-z]$/,
} satisfies Placeholders;

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

	for (const char of format) {
		if (replacementIdx >= replacements.length) {
			break;
		}

		if (!(char in placeholders)) {
			out += char;
			continue;
		}

		const placeholderRegex =
			placeholders[char as keyof typeof placeholders];

		const replacement = replacements[replacementIdx] as string;

		if (!replacement.match(placeholderRegex)) {
			throw new Error(
				`Invalid replacement '${replacement}' for placeholder '${char}'`,
			);
		}

		replacementIdx++;

		out += replacement;
	}

	return out;
}
