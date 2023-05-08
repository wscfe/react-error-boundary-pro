import React from "react";
export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * 出错后现时的组件
 * @param error
 * @param resetErrorBoundary
 * @constructor
 */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>出错啦</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
