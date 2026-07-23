import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const tokensDirectory = path.join(projectRoot, "tokens");
const resolverPath = path.join(
	projectRoot,
	".terrazzo",
	"tokens.resolver.json",
);

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function slug(value) {
	return value
		.trim()
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
}

function cartesianProduct(groups) {
	return groups.reduce(
		(combinations, group) =>
			combinations.flatMap((combination) =>
				group.map((theme) => [...combination, theme]),
			),
		[[]],
	);
}

export function getThemeContexts() {
	const themes = readJson(path.join(tokensDirectory, "$themes.json"));
	const tokenSetOrder = readJson(
		path.join(tokensDirectory, "$metadata.json"),
	).tokenSetOrder;
	const themesByGroup = new Map();

	for (const theme of themes) {
		const groupThemes = themesByGroup.get(theme.group) ?? [];
		groupThemes.push(theme);
		themesByGroup.set(theme.group, groupThemes);
	}

	const groups = [...themesByGroup.entries()];
	const tokenSetIndex = new Map(
		tokenSetOrder.map((tokenSet, index) => [tokenSet, index]),
	);

	return cartesianProduct(groups.map(([, groupThemes]) => groupThemes)).map(
		(combination) => {
			const variableThemes = combination.filter(
				(theme) => themesByGroup.get(theme.group).length > 1,
			);
			const selectedTokenSets = new Set(
				combination.flatMap((theme) =>
					Object.entries(theme.selectedTokenSets)
						.filter(([, state]) => state !== "disabled")
						.map(([tokenSet]) => tokenSet),
				),
			);
			const tokenSets = [...selectedTokenSets].sort(
				(left, right) =>
					(tokenSetIndex.get(left) ?? Number.MAX_SAFE_INTEGER) -
						(tokenSetIndex.get(right) ?? Number.MAX_SAFE_INTEGER) ||
					left.localeCompare(right),
			);
			const colorMode = combination.find(
				(theme) => slug(theme.group) === "color-mode",
			)?.name;

			return {
				name:
					variableThemes
						.map((theme) => `${slug(theme.group)}-${slug(theme.name)}`)
						.join("--") || "default",
				colorScheme: colorMode ? slug(colorMode) : undefined,
				tokenSets,
			};
		},
	);
}

export function writeThemeResolver() {
	const contexts = Object.fromEntries(
		getThemeContexts().map((context) => [
			context.name,
			context.tokenSets.map((tokenSet) => ({
				$ref: path.relative(
					path.dirname(resolverPath),
					path.join(tokensDirectory, `${tokenSet}.json`),
				),
			})),
		]),
	);
	const resolver = {
		name: "Tokens Studio themes",
		version: "2025.10",
		resolutionOrder: [{ $ref: "#/modifiers/theme" }],
		modifiers: {
			theme: { contexts },
		},
	};

	fs.mkdirSync(path.dirname(resolverPath), { recursive: true });
	fs.writeFileSync(resolverPath, `${JSON.stringify(resolver, null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	writeThemeResolver();
}
