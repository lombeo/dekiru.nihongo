export default function ReceiveValueBox({
  title,
  circleBackgroundColor,
  circleBoderColor,
  iconUrl,
  content,
}: {
  title: string;
  circleBackgroundColor: string;
  circleBoderColor: string;
  iconUrl: string;
  content: any;
}) {
  return (
    <>
      {/* desktop */}
      <div className="relative hidden screen1024:block">
        <div
          className="absolute left-1/2 top-0 flex items-center bg-white gap-[10px]"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <div className="w-2 h-2 screen1440:w-3 screen1440:h-3 rounded-full bg-[#5BBF33]"></div>
          <div className="text-[#304090] text-xl screen1440:text-2xl font-bold whitespace-nowrap">{title}</div>
          <div className="w-2 h-2 screen1440:w-3 screen1440:h-3 rounded-full bg-[#5BBF33]"></div>
        </div>
        <div className="border border-[#5BBF33] rounded-full w-full overflow-hidden pl-9 pr-6 h-[140px] lg:h-[160px] screen1440:h-[174px]">
          <div className="flex gap-3 translate-y-[19%] lg:translate-y-[15%]">
            <div className="relative w-fit">
              <div
                className="screen1024:w-[150px] screen1024:h-[150px] lg:w-[180px] lg:h-[180px] screen1440:w-[232px] screen1440:h-[232px] rounded-full boder border-opacity"
                style={{
                  borderWidth: "10px",
                  borderColor: circleBoderColor,
                  backgroundColor: circleBackgroundColor,
                }}
              ></div>
              <div className="absolute top-0 -left-[15%] lg:-left-[11%] screen1440:-left-[2%] w-[50px] lg:w-max">
                <img src="/images/event/icons/Clouds.svg" />
              </div>
              <div
                className="absolute top-[34px] left-1/2 h-[70px] lg:h-[80px] screen1440:h-[100px]"
                style={{ transform: "translateX(-50%)" }}
              >
                <img src={iconUrl} className="h-full" />
              </div>
            </div>

            <div className="h-fit text-[#404040] font-semibold text-sm lg:text-base screen1440:text-[18px] screen1440:mt-2">
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* tablet and mobile */}
      <div className="flex flex-col items-center screen1024:hidden">
        <div className="relative w-fit">
          <div
            className="w-[100px] h-[100px] rounded-full boder border-opacity flex justify-center items-center"
            style={{
              borderWidth: "5px",
              borderColor: circleBoderColor,
              backgroundColor: circleBackgroundColor,
            }}
          >
            <div className="h-[46px]">
              <img src={iconUrl} className="h-full" />
            </div>
          </div>
          <div className="absolute top-0 -left-[17%] w-[30px]">
            <img src="/images/event/icons/Clouds.svg" />
          </div>
        </div>

        <div className="text-xl mt-[10px] text-[#304090] font-bold whitespace-nowrap">{title}</div>
        <div className="mt-[10px] h-fit text-[#404040] text-center">{content}</div>
      </div>
    </>
  );
}
