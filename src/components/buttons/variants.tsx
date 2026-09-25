import Button, { type ButtonProps } from "./Button";

type VariantProps = Omit<ButtonProps, "variant">;

export const PrimaryButton = (props: VariantProps) => <Button {...props} variant="primary" />;

export const SecondaryButton = (props: VariantProps) => <Button {...props} variant="secondary" />;

export const DangerButton = (props: VariantProps) => <Button {...props} variant="danger" />;

export const GhostButton = (props: VariantProps) => <Button {...props} variant="ghost" />;

export const TextButton = (props: VariantProps) => <Button {...props} variant="text" />;
