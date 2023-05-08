import * as React from "react";

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: string) => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

// 初始状态
const initialState: ErrorBoundaryState = {
  error: null,
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = initialState;
  updatedWithError = false;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props;
    onError?.(error, errorInfo.componentStack);
  }

  componentDidUpdate() {
    const { error } = this.state;

    if (error !== null && !this.updatedWithError) {
      this.updatedWithError = true;
      return;
    }
  }

  reset = () => {
    this.updatedWithError = false;
    this.setState(initialState);
  };

  resetErrorBoundary = () => {
    const { onReset } = this.props;
    onReset?.();
    this.reset();
  };

  render() {
    const { fallback, children } = this.props;
    const { error } = this.state;

    if (error !== null) {
      if (React.isValidElement(fallback)) {
        return fallback;
      }

      throw new Error(
        "ErrorBoundary 组件需要传入 fallback, fallbackRender, FallbackComponent 其中一个"
      );
    }

    return children;
  }
}

/**
 * with 写法
 * @param Component 业务组件
 * @param errorBoundaryProps error boundary 的 props
 */
function withErrorBoundary(
  Component: React.ComponentType,
  errorBoundaryProps: ErrorBoundaryProps
): React.ComponentType {
  const Wrapped: React.ComponentType = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // DevTools 显示的组件名
  const name = Component.displayName || Component.name || "Unknown";
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}

/**
 * 自定义错误的 handler
 * @param givenError
 */
function useErrorHandler<P = Error>(
  givenError?: P | null | undefined
): React.Dispatch<React.SetStateAction<P | null>> {
  const [error, setError] = React.useState<P | null>(null);
  if (givenError) throw givenError;
  if (error) throw error;
  return setError;
}

export { ErrorBoundary, withErrorBoundary, useErrorHandler };
