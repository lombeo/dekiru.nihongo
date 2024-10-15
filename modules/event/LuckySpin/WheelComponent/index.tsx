import styles from "./styles.module.scss";
import { useState, useEffect, useRef } from "react";
import LuckyWheelResultModal from "../LuckyWheelResultModal";
import CodingService from "@src/services/Coding/CodingService";
import { GiftType } from "@src/constants/event/event.constant";
import { Notify } from "@src/components/cms";
import { useTranslation } from "next-i18next";

export default function WheelComponent({ segments, spinTurnNumber, setSpinTurnNumber, onSpinDone }) {
  const angleMeasurement = useRef(360 / segments.length);

  const [segmentBorderTopValue, setSegmentBorderTopValue] = useState(null);
  const [segmentBorderHorizonValue, setSegmentBorderHorizonValue] = useState(null);
  const [leftDistace, setLeftDistance] = useState(null);
  const [spinning, setSpinning] = useState<boolean | null>(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const wheelWrapper = useRef(null);
  const wheelDecor = useRef(null);
  const wheelContainer = useRef(null);

  const { t } = useTranslation();
  useEffect(() => {
    if (wheelContainer.current) {
      getWheelContainerWidth();
      window.addEventListener("resize", getWheelContainerWidth);
    }
  }, [wheelContainer.current]);

  useEffect(() => {
    if (spinning === null) {
      resetLuckyWheel();
    }
  }, [spinning]);

  const getWheelContainerWidth = () => {
    if (wheelContainer.current) {
      const styles = getComputedStyle(wheelContainer.current);
      const borderWidth = parseFloat(styles.borderLeftWidth);
      const wheelTrueWidth = wheelContainer.current.offsetWidth - 2 * borderWidth;

      let wheelWrapperDistance = 35;
      let wheelDecorDistance = 24;

      if (window.innerWidth < 640) {
        wheelWrapperDistance = 30;
        wheelDecorDistance = 18;
      }

      wheelWrapper.current.style.width = wheelContainer.current.offsetWidth + wheelWrapperDistance + "px";
      wheelWrapper.current.style.height = wheelContainer.current.offsetWidth + wheelWrapperDistance + "px";

      wheelDecor.current.style.width = wheelContainer.current.offsetWidth + wheelDecorDistance + "px";
      wheelDecor.current.style.height = wheelContainer.current.offsetWidth + wheelDecorDistance + "px";

      setSegmentBorderTopValue(wheelTrueWidth / 2);

      const borderHorizon = Math.round(
        (wheelTrueWidth * Math.tan((angleMeasurement.current / 2) * (Math.PI / 180))) / 2
      );

      setSegmentBorderHorizonValue(borderHorizon);

      const distance = wheelTrueWidth / 2 - borderHorizon / 2;
      setLeftDistance(distance - borderHorizon / 2);
    }
  };

  const spinWheel = async () => {
    if (spinTurnNumber > 0) {
      if (!spinning) {
        setSpinning(true);

        const params = { eventId: 1 };
        const res = await CodingService.handleGetGiftLuckySpin(params);
        const data = res?.data?.data;

        if (data) {
          setSpinTurnNumber((prev) => prev - 1);
          const indexFounded = segments.findIndex((item) => item.id === res?.data?.data?.id);

          // quay 5 vòng + góc nghiêng của ô quà
          const rotateDegrees = 1800 + indexFounded * angleMeasurement.current;

          wheelContainer.current.classList.remove("lucky-spin__rotate-evenly");
          setTimeout(() => {
            wheelContainer.current.style.transition = "transform 4s ease-out";
            wheelContainer.current.style.transform = `rotate(${rotateDegrees}deg)`;
          }, 30);

          setTimeout(() => {
            setSpinning(false);
            setSelectedItem(segments[indexFounded]);
            onSpinDone(data);
          }, 4000);
        } else if (res?.data?.message) Notify.error(t(res?.data?.message));
      }
    }
  };

  const resetLuckyWheel = () => {
    wheelContainer.current.classList.add("lucky-spin__rotate-evenly");
    wheelContainer.current.style.transition = "unset";
    wheelContainer.current.style.transform = "unset";
    setSelectedItem(null);
  };

  const onCloseUpdateProfileModal = () => {
    resetLuckyWheel();
    setSpinning(null);
  };

  const renderSegmentContent = (seg) => {
    if (seg?.type === GiftType.None) {
      return (
        <div className="w-[35px] sm:w-[40px] screen1440:w-[50px]">
          <img src={seg?.imageUrl} className="w-full" />
        </div>
      );
    } else if (seg?.type === GiftType.Coin) {
      return (
        <div className="flex flex-col items-center">
          <div
            className="text-sm xs:text-base sm:text-[20px] screen1440:text-[26px] text-[#F56060] whitespace-nowrap"
            style={{ textShadow: "0 4px 4px #00000026" }}
          >
            {seg?.coin}
          </div>
          <div className="w-[25px] sm:w-[35px] mt-2">
            <img src="/images/event/lucky-spin-gold.png" />
          </div>
        </div>
      );
    }
    return (
      <div className="w-[38px] xs:w-[45px] sm:w-[55px] screen1440:w-[55px]">
        <img src={seg?.imageUrl} className="w-full" />
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <div ref={wheelWrapper} className="rounded-full overflow-hidden relative z-10">
          <div className="relative bg-[#5B78FF] w-full h-full flex items-center justify-center">
            <div ref={wheelDecor} className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
              <img src="/images/event/lucky-spin-border.png" className="w-fulll" />
            </div>
            <div
              ref={wheelContainer}
              className="relative w-[290px] h-[290px] xs:w-[330px] xs:h-[330px] sm:w-[380px] sm:h-[380px] screen1440:w-[450px] screen1440:h-[450px] rounded-full border-[7px] sm:border-[10px] border-[#4A68F5] overflow-hidden"
            >
              {segments.map((item, index) => (
                <div
                  key={index}
                  className={styles["wheel-segment"]}
                  style={{
                    borderTopColor: item?.backgroundColor || "white",
                    borderWidth: `${segmentBorderTopValue}px ${segmentBorderHorizonValue}px 0`,
                    left: `${leftDistace}px`,
                    transform: `rotate(-${index * angleMeasurement.current}deg)`,
                  }}
                >
                  <div
                    className="absolute top-[-120px] xs:top-[-140px] sm:top-[-160px] screen1440:top-[-180px] left-1/2 text-center font-bold leading-none"
                    style={{ transform: "translateX(-50%)" }}
                  >
                    {renderSegmentContent(item)}
                  </div>
                </div>
              ))}
            </div>

            {/* wheel center  */}
            <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
              <div
                className="flex justify-center items-center w-[60px] h-[60px] xs:w-[70px] xs:h-[70px] sm:w-[80px] sm:h-[80px] screen1440:w-[100px] screen1440:h-[100px] bg-gradient-to-b from-[#FE7171] to-[#E94141] rounded-full cursor-pointer"
                onClick={spinWheel}
              >
                <div className="absolute -top-[23px] left-1/2 flex -z-[1]" style={{ transform: "translateX(-50%)" }}>
                  <div
                    style={{ borderWidth: "0 0 27px 15px", borderColor: "transparent transparent #F56060 transparent" }}
                  ></div>
                  <div
                    style={{ borderWidth: "0 15px 27px 0", borderColor: "transparent transparent #E34242 transparent" }}
                  ></div>
                </div>

                <div
                  className="flex justify-center items-center w-[50px] h-[50px] xs:w-[60px] xs:h-[60px] sm:w-[70px] sm:h-[70px] screen1440:w-[85px] screen1440:h-[85px] text-xs xs:text-base sm:text-[18px] screen1440:text-[22px] uppercase text-white w-fit rounded-full border-[2px] border-[#CE2929] font-bold"
                  style={{ textShadow: "0px 4px 4px #00000040" }}
                >
                  Quay
                </div>
              </div>
            </div>
            {/* --------------------------------------------------- */}
          </div>
        </div>

        {/* plinth */}
        <div
          className="w-[290px] xs:w-[330px] sm:w-[330px] screen1440:w-[420px] absolute bottom-[5%] left-1/2"
          style={{ transform: "translate(-50%,60%)" }}
        >
          <img src="/images/event/lucky-spin-plinth.png" className="w-full" />
        </div>
        {/* --------------------------------------------------------- */}
      </div>

      {spinning === false && (
        <LuckyWheelResultModal
          spinTurnNumber={spinTurnNumber}
          selectedItem={selectedItem}
          onCloseUpdateProfileModal={onCloseUpdateProfileModal}
          spinWheel={spinWheel}
        />
      )}
    </>
  );
}

WheelComponent.defaultProps = {
  segments: [],
};
