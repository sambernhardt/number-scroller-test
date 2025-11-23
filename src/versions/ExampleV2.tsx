import { memo, useEffect, useMemo, useState } from "react";

const ANIMATION_DURATION = 400;

const NumberColumn = memo(({ value }: { value: number }) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  const activeTransform = useMemo(() => {
    if (!hasRendered) return `translateY(0)`;

    return `translateY(calc(${value} * -1em))`;
  }, [value, hasRendered]);

  return (
    <div
      data-value={value}
      data-transform={activeTransform}
      className="inline-block relative h-[1em] overflow-hidden"
    >
      <div
        className="flex flex-col text-inherit"
        style={{
          transform: activeTransform,
          transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(.02,1.02,.38,.93)`,
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="h-[1em]"
            style={{
              userSelect: value === index ? "text" : "none",
            }}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
});

const CharacterColumn = ({ char }: { char: string }) => {
  return <div className="inline-block h-[1em]">{char}</div>;
};

const NumberScroller = ({ value }: { value: number }) => {
  const formattedValue = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value),
    [value]
  );

  const numberColumns = formattedValue.split("").map((char, index) => {
    if (!isNaN(parseInt(char))) {
      return <NumberColumn key={index} value={parseInt(char)} />;
    }
    return <CharacterColumn key={index} char={char} />;
  });

  return (
    <div className="text-[size:inherit] flex items-baseline">
      {numberColumns}
    </div>
  );
};

const ExampleV1 = () => {
  const [value, setValue] = useState(3200);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 2000);
      setValue(randomValue);
    }, 3000);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-4xl">
        <NumberScroller value={value} />
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
          onClick={() => setValue(Math.floor(Math.random() * 4000) - 2000)}
        >
          Random
        </button>
      </div>
    </div>
  );
};

export default ExampleV1;
