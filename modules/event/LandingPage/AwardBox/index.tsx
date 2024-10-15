import BountyTopBox from "../BountyTopBox";
import clsx from "clsx";

export default function AwardBox({ attendFnc }) {
  const number = 10000000;

  const bountyArr = [
    { title: "top 02-03", number: 5000000 },
    { title: "top 04-10", number: 3000000 },
    { title: "top 11-20", number: 1000000 },
  ];

  return (
    <div className="flex flex-col items-center bg-[#304090] pt-20 pb-[140px]">
      <div className="relative w-[70%] sm:w-[40%] screen1024:w-[390px] lg:w-[500px] screen1440:w-max">
        <img src="/images/event/landing-award-title-wrapper.png" />
        <div
          className="absolute top-1/2 left-1/2 text-2xl screen1024:text-[32px] lg:text-[40px] screen1440:text-[52px] xl:text-[60px] font-bold text-white whitespace-nowrap uppercase"
          style={{
            transform: "translate(-50%,-50%)",
          }}
        >
          Giải thưởng
        </div>
      </div>

      <div className="relative whitespace-nowrap">
        <div className="invisible screen1024:visible text-[100px] lg:text-[120px] screen1440:text-[140px] xl:text-[200px] text-white uppercase font-black opacity-5">
          vòng khởi động
        </div>
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 text-[32px] screen1024:text-[40px] lg:text-[70px] xl:text-[100px]  uppercase font-black z-20 text-white",
            {
              "transparent-text-white": window.innerWidth >= 1024,
            }
          )}
          style={{ transform: "translate(-50%,-50%)" }}
        >
          vòng khởi động
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mt-4">
        <div className="w-[110px] xs:w-[130px] sm:w-[170px] md:w-[215px] screen1024:w-[290px] custom:w-max">
          <img src="/images/event/landing-award-top-2.png" />
        </div>
        <div className="w-[110px] xs:w-[130px] sm:w-[170px] md:w-[215px] screen1024:w-[290px] custom:w-max">
          <img src="/images/event/landing-award-top-1.png" />
        </div>
        <div className="w-[110px] xs:w-[130px] sm:w-[170px] md:w-[215px] screen1024:w-[290px] custom:w-max">
          <img src="/images/event/landing-award-top-3.png" />
        </div>
      </div>

      <div className="mt-[54px] w-[95%] xs:w-[90%] sm:w-[80%] screen1024:w-[894px] custom:w-[1184px]">
        <div className="flex flex-col screen1024:flex-row gap-4 screen1024:gap-5">
          <div
            className="flex justify-between items-center bg-white rounded-[24px] sm:rounded-[32px] gap-7 screen1024:gap-4 lg:gap-5 custom:gap-8 py-4 px-6 sm:py-6 sm:px-[32px] screen1024:px-[28px] screen1024:w-1/2"
            style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          >
            <div className="w-[70%] screen1024:w-[80%] screen1440:w-[70%]">
              <div className="text-base sm:text-[18px] screen1024:text-[18px] custom:text-2xl text-[#5BBF33] font-semibold">
                Học sinh hoàn thành mỗi thử thách và đạt từ 10 điểm trở lên
              </div>
              <div className="text-sm sm:text-base custom:text-[18px] text-[#111928] font-semibold mt-3">+ 10 gold</div>
            </div>
            <div className="w-[70px] sm:w-[80px] custom:w-[120px] shrink-0">
              <img src="/images/event/icons/LandingCoin.svg" className="w-full" />
            </div>
          </div>

          <div
            className="flex justify-between items-center bg-white rounded-[24px] sm:rounded-[32px] gap-7 screen1024:gap-4 lg:gap-5 custom:gap-8 py-4 px-6 sm:py-6 sm:px-[32px] screen1024:px-[28px] screen1024:w-1/2"
            style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          >
            <div className="w-[70%] screen1440:w-[60%]">
              <div className="text-base sm:text-[18px] screen1024:text-[18px] custom:text-2xl text-[#5BBF33] font-semibold">
                Hoàn thành mỗi thử thách và đạt từ 15 điểm trở lên
              </div>
              <div className="text-sm sm:text-base custom:text-[18px] text-[#111928] font-semibold mt-3">
                + 01 lượt quay “Vòng quay kỳ thú”
              </div>
            </div>
            <div className="w-[75px] sm:w-[85px] lg:w-[100px] custom:w-[118px]">
              <img src="/images/event/landing-lucky-spin.png" />
            </div>
          </div>
        </div>

        <div className="relative mt-4 w-full screen1024:w-[60%] custom:w-[45%] mx-auto">
          <div
            className="bg-white rounded-[24px] sm:rounded-[32px] gap-8 py-4 px-6 sm:py-6 sm:px-[38px] text-[#506CF0] text-base sm:text-[18px] text-center font-bold"
            style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
          >
            Gold được sử dụng để đổi quà hiện vật tại sự kiện “Đổi Gold nhận quà” của BTC sau khi chương trình kết thúc
          </div>
          <div
            className="hidden screen1024:flex absolute left-1/2 top-0 justify-between w-full screen1024:w-[80%]"
            style={{ transform: "translate(-50%,-66.67%)" }}
          >
            <div className="bg-[#E3DCDC] rounded-full w-[12px] h-[48px]"></div>
            <div className="bg-[#E3DCDC] rounded-full w-[12px] h-[48px]"></div>
          </div>
        </div>
      </div>

      <div className="relative whitespace-nowrap mt-[60px] screen1024:mt-[180px]">
        <div className="invisible screen1024:visible text-[100px] lg:text-[120px] screen1440:text-[140px] xl:text-[200px] text-white uppercase font-black opacity-5">
          vòng tăng tốc
        </div>
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 text-[32px] screen1024:text-[40px] lg:text-[70px] xl:text-[100px]  uppercase font-black z-20 text-white",
            {
              "transparent-text-white": window.innerWidth >= 1024,
            }
          )}
          style={{ transform: "translate(-50%,-50%)" }}
        >
          vòng tăng tốc
        </div>
      </div>

      <div className="w-[90%] md:w-[70%] screen1024:w-[800px] lg:w-[1000px]">
        <img src="/images/event/landing-certificate.png" />
      </div>

      <div className="relative whitespace-nowrap mt-[60px] screen1024:mt-[180px]">
        <div className="invisible screen1024:visible text-[100px] lg:text-[120px] screen1440:text-[140px] xl:text-[200px] text-white uppercase font-black opacity-5">
          vòng chung kết
        </div>
        <div
          className={clsx(
            "absolute top-1/2 left-1/2 text-[32px] screen1024:text-[40px] lg:text-[70px] xl:text-[100px]  uppercase font-black z-20 text-white",
            {
              "transparent-text-white": window.innerWidth >= 1024,
            }
          )}
          style={{ transform: "translate(-50%,-50%)" }}
        >
          vòng chung kết
        </div>
      </div>

      <div className="relative">
        <div className="w-[320px] sm:w-[290px] md:w-[366px] screen1024:w-[400px] lg:w-max">
          <img src="/images/event/landing-bounty-top-1.png" />
        </div>
        <div
          className="absolute left-1/2 bottom-[31%] md:bottom-[32%] lg:bottom-[33%] text-2xl sm:text-[22px] md:text-[28px] lg:text-[40px] text-[#F23030] flex items-center gap-1 md:gap-2 font-extrabold"
          style={{ transform: "translateX(-50%)" }}
        >
          <span>{number.toLocaleString("en-US")}</span>
          <span className="underline text-xl sm:text-[18px] md:text-xl lg:text-[30px] mb-1">đ</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-[60px] sm:gap-[40px] md:gap-[50px] screen1024:gap-[80px] screen1440:gap-[100px] xl:gap-[132px] -mt-[50px] md:-mt-[100px]">
        {bountyArr.map((item, index) => (
          <BountyTopBox key={index} title={item.title} number={item.number} />
        ))}
      </div>

      <button
        className="mt-[100px] rounded-[8px] bg-[#F56060] py-3 px-7 screen1024:py-4 screen1024:px-10 cursor-pointer"
        onClick={attendFnc}
      >
        <span className="text-sm screen1024:text-base lg:text-[18px] text-white">Tham gia ngay</span>
      </button>
    </div>
  );
}
