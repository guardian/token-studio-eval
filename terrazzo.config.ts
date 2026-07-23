import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";
import { getThemeContexts } from "./scripts/terrazzo-themes.mjs";

const themeContexts = getThemeContexts();

export default defineConfig({
	tokens: ["./.terrazzo/tokens.resolver.json"],
	outDir: "./dist",
	plugins: [
		css({
			filename: "tokens.css",
			variableName: (token) => `--${token.id.replace(/\./g, "-")}`,
			permutations: themeContexts.map(
				(theme: { name: string; colorScheme?: string }, index: number) => ({
					input: { theme: theme.name },
					prepare: (contents: string) => {
						const selector =
							index === 0
								? `:root, [data-theme="${theme.name}"]`
								: `[data-theme="${theme.name}"]`;
						const colorScheme = theme.colorScheme
							? `\n  color-scheme: ${theme.colorScheme};`
							: "";

						return `${selector} {${colorScheme}\n  ${contents}\n}`;
					},
				}),
			),
			legacyHex: true,
		}),
	],
	ignore: {
		tokens: [
			"component.avatar.shared.color.outlined.background",
			"component.button.tertiary.shared.backgroundColor",
			"component.button.tertiary.shared.disabled.backgroundColor",
			"component.checkbox.input.shared.indicator.svg.fill",
		],
	},
	lint: {
		rules: {
			"core/valid-color": ["error", { legacyFormat: true }],
		},
	},
});
