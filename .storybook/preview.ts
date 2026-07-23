import { createElement } from "react";
import type { Preview } from "@storybook/react-vite";
import "../dist/tokens.css";
import "../src/styles.css";
import { themes } from "../src/themes";

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Terrazzo theme context",
			toolbar: {
				icon: "paintbrush",
				items: [...themes],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: themes[0],
	},
	decorators: [
		(Story, context) => {
			document.documentElement.dataset.theme = context.globals.theme as string;
			return createElement(Story);
		},
	],
};

export default preview;
