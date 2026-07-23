import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export function Button({
	children,
	className,
	type = "button",
	...props
}: ButtonProps) {
	const buttonClassName = ["button", className].filter(Boolean).join(" ");

	return (
		<button className={buttonClassName} type={type} {...props}>
			{children}
		</button>
	);
}
