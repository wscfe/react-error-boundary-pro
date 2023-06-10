// @ts-nocheck
import React, { useState, useEffect } from "react";
import ErrorBoundary, { useErrorHandler } from "./ErrorBoundary";
import MakeError from "../Error/MakeError";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ReactComponentLibrary/ErrorBoundary",
  component: ErrorBoundary,
};

const AsyncError = () => {
  const handleError = useErrorHandler();

  const [number, setNumber] = useState<number>(0);

  const randomlyFetchData = async () => {
    return Math.random();
  };

  useEffect(() => {
    randomlyFetchData()
      .then((number) => {
        if (number > 0.5) {
          throw new Error("async 大于 0.5");
        } else {
          setNumber(number);
        }
      })
      .catch(handleError);
  }, []);

  return <div>{number}</div>;
};

const MakeError = () => {
  useEffect(() => {
    const number = Math.random();
    if (number > 0.5) {
      throw new Error("大于0.5");
    }
  }, []);

  return <div />;
};

const FallbackExample = () => {
  const [hasError, setHasError] = useState(false);

  const onError = (error: Error) => {
    // 日志上報
    console.log(error);
    setHasError(true);
  };

  const onReset = () => {
    console.log("尝试恢复错误");
    setHasError(false);
  };

  return (
    <ErrorBoundary
      fallback={<div>出错啦</div>}
      onError={onError}
      onReset={onReset}
    >
      {!hasError ? <MakeError /> : null}
    </ErrorBoundary>
  );
};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <FallbackExample {...args} />;

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {};
