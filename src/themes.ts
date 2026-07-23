export const themes = [
	"color-mode-light--brand-default",
	"color-mode-light--brand-sr",
	"color-mode-dark--brand-default",
	"color-mode-dark--brand-sr",
] as const;

export type Theme = (typeof themes)[number];
