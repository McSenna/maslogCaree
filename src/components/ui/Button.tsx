import type { ReactNode } from "react";

import { Pressable, Text, View } from "react-native";

export type ButtonVariant = "primary" | "accent" | "secondary" | "danger" | "ghost";

export type ButtonProps = {
  children?: ReactNode;
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const Button = ({
  children,
  title,
  onPress,
  disabled,
  variant = "primary",
  className = "",
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const isGhost = variant === "ghost";

  const variantClasses =
    variant === "primary"
      ? "bg-mc-primary"
      : variant === "accent"
        ? "bg-mc-accent"
        : variant === "secondary"
          ? "bg-white border border-slate-200"
          : variant === "danger"
            ? "bg-rose-500"
            : "bg-transparent";

  const textClasses =
    variant === "secondary"
      ? "text-slate-800"
      : variant === "ghost"
        ? "text-mc-primary"
        : "text-white";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={[
        "w-full flex-row items-center justify-center rounded-2xl px-4 py-3",
        "active:opacity-80",
        "shadow-sm shadow-black/5",
        variantClasses,
        disabled ? "opacity-60" : "",
        isGhost ? "shadow-none" : "",
        className,
      ].join(" ")}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
      {children ? (
        <>{children}</>
      ) : (
        <Text className={["text-base font-semibold", textClasses].join(" ")}>{title}</Text>
      )}
      {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
    </Pressable>
  );
};

export default Button;

