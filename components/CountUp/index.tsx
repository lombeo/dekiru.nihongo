import { FC, useState } from "react";
import { default as CountUpLib } from "react-countup";

type CountUpProps = {
  numberStart: number;
  numberEnd: number;
  duration?: number;
  decimals?: number;
  hasPlus?: boolean;
  prefix: string;
  className?: string;
};

const CountUp: FC<CountUpProps> = (props: CountUpProps) => {
  const { numberStart, numberEnd, duration = 3, decimals = 0, hasPlus = false, prefix, className } = props;
  const [isShowPlus, setIsShowPlus] = useState<boolean>(false);

  return (
    <div className={`flex flex-row ${className}`}>
      <CountUpLib
        start={numberStart}
        end={numberEnd}
        duration={duration}
        decimals={decimals}
        decimal="."
        enableScrollSpy
        scrollSpyOnce
        prefix={prefix}
        onEnd={() => {
          setIsShowPlus(true);
        }}
        onStart={() => {}}
      />
      {hasPlus && isShowPlus && <span>+</span>}
    </div>
  );
};

export default CountUp;
