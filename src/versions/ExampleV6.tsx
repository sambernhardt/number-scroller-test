import { useEffect, useState } from "react";
import { NumberScroller } from "./ExampleV4";

const ExampleV6 = () => {
  const [value, setValue] = useState(320000);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 4000) - 2000;
      setValue((prev) => prev + randomValue);
    }, 3000);
    return () => clearInterval(interval);
  }, [value]);

  const formatter = (value: number) => {
    const randomSuffix = Math.random() > 0.5 ? "ETH" : "BTC";
    return (
      new Intl.NumberFormat("en-US", {}).format(value) + " " + randomSuffix
    );
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col gap-2">
        <NumberScroller
          value={value}
          className="text-4xl"
          formatter={formatter}
        />
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="rounded-md bg-text/40 px-2 flex items-center"
          onClick={() => setValue(value - 1)}
        >
          -
        </button>
        <button
          className="rounded-md bg-text/40 px-2 flex items-center"
          onClick={() => setValue(value + 1)}
        >
          +
        </button>
        <button
          className="rounded-md bg-text/40 px-2 flex items-center"
          onClick={() =>
            setValue((prev) => prev + Math.floor(Math.random() * 4000) - 2000)
          }
        >
          Random
        </button>
      </div>
    </div>
  );
};

export default ExampleV6;
