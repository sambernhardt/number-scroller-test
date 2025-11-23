import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ANIMATION_DURATION = 400;

const NumberColumn = memo(({ value }: { value: number }) => {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  const activeTransform = useMemo(() => {
    if (!hasRendered) return `translateY(0)`;

    return `translateY(calc(${value} * -1.2em))`;
  }, [value, hasRendered]);

  return (
    <div
      data-value={value}
      data-transform={activeTransform}
      className="inline-block relative h-[1.2em] overflow-hidden"
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
            className="h-[1.2em] text-center"
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

const CharacterColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="inline-block h-[1.2em]">{children}</div>;
};

export const NumberScroller = ({
  value,
  className,
  formatter,
}: {
  value: number;
  className?: string;
  formatter?: (value: number) => string;
}) => {
  const lastValueRef = useRef<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formattedValue = useMemo(
    () => (formatter ? formatter(value) : String(value)),
    [value]
  );

  useLayoutEffect(() => {
    const textElement = textRef.current;
    textElement?.classList.remove("positive-change");
    textElement?.classList.remove("negative-change");
    textElement?.style.setProperty("transition", "");

    if (lastValueRef.current !== null && value > lastValueRef.current) {
      textElement?.classList.add("positive-change");
      timeoutRef.current = setTimeout(() => {
        textElement?.classList.remove("positive-change");
        textElement?.style.setProperty("transition", "color 1500ms ease-out");
        setTimeout(() => {
          textElement?.style.setProperty("transition", "");
        }, 1000);
      }, 10);
    } else if (lastValueRef.current !== null && value < lastValueRef.current) {
      textElement?.classList.add("negative-change");
      timeoutRef.current = setTimeout(() => {
        textElement?.classList.remove("negative-change");
        textElement?.style.setProperty("transition", "color 1500ms ease-out");
        setTimeout(() => {
          textElement?.style.setProperty("transition", "");
        }, 1000);
      }, 10);
    }

    lastValueRef.current = value;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const numberColumns = formattedValue.split("").map((char, index) => {
    if (!isNaN(parseInt(char))) {
      return <NumberColumn key={index} value={parseInt(char)} />;
    } else if (char === " ") {
      return <CharacterColumn key={index}>&nbsp;</CharacterColumn>;
    } else {
      return <CharacterColumn key={index}>{char}</CharacterColumn>;
    }
  });

  return (
    <div ref={textRef} className={`flex items-baseline ${className}`}>
      {numberColumns}
    </div>
  );
};

NumberScroller.displayName = "NumberScroller";

const ExampleV4 = () => {
  const [value, setValue] = useState(320000);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomValue = Math.floor(Math.random() * 2000);
  //     setValue(randomValue);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [value]);

  return (
    <div className="flex flex-col items-center gap-10">
      <NumberScroller
        value={value}
        className="text-4xl"
        formatter={(val) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            compactDisplay: "short",
          }).format(val)
        }
      />
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

export default ExampleV4;
