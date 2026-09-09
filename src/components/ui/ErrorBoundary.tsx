import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional label so a nested boundary can name the area that failed. */
  area?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Catches render-time exceptions so a bug in one screen shows a recoverable
 * message instead of a blank app.
 *
 * React error boundaries only catch errors thrown while rendering, in
 * lifecycle methods, and in constructors below them — not errors inside event
 * handlers or async callbacks. Those are handled where they occur, via
 * normalizeApiError.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Developer detail only. The user sees the safe copy rendered below.
    console.error("[ErrorBoundary]", this.props.area ?? "app", {
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = typeof __DEV__ !== "undefined" && __DEV__;

    return (
      <View className="flex-1 items-center justify-center bg-white px-6 py-10">
        <ScrollView
          contentContainerClassName="items-center"
          className="w-full max-w-md grow-0"
        >
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Text className="text-2xl">!</Text>
          </View>

          <Text className="mb-2 text-center text-lg font-semibold text-slate-900">
            Something went wrong on this screen
          </Text>

          <Text className="mb-6 text-center text-sm leading-5 text-slate-500">
            The page could not be displayed. You can try again, and no
            information you already saved has been lost.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={this.handleRetry}
            className="rounded-xl bg-mc-primary px-6 py-3 active:opacity-80"
          >
            <Text className="text-sm font-semibold text-white">Try again</Text>
          </Pressable>

          {/* Technical detail is for developers and stays out of production builds. */}
          {isDev && this.state.message ? (
            <Text className="mt-6 text-center text-xs text-slate-400">
              {this.state.message}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

export default ErrorBoundary;
