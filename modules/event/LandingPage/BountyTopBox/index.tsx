export default function BountyTopBox({ title, number }: { title: string; number: number }) {
  return (
    <div>
      <div className="relative">
        <div className="w-[216px] sm:w-[180px] md:w-[200px] screen1024:w-[250px] lg:w-[350px] screen1440:w-max">
          <img src="/images/event/landing-bounty-frame.png" />
        </div>
        <div
          className="absolute left-1/2 top-[35%] screen1024:top-[36.5%] lg:top-[39%] text-xl sm:text-[17px] md:text-xl screen1024:text-[28px] screen1440:text-[34px] uppercase text-white font-extrabold whitespace-nowrap"
          style={{ textShadow: "2px 4px 0px #35950E", transform: "translateX(-50%)" }}
        >
          {title}
        </div>
        <div
          className="absolute left-1/2 bottom-[4%] sm:bottom-[5%] lg:bottom-[9%] text-2xl sm:text-xl md:text-2xl screen1024:text-[28px] lg:text-[32px] screen1440:text-[40px] text-[#F23030] flex items-center gap-1 md:gap-2 font-extrabold"
          style={{ transform: "translateX(-50%)" }}
        >
          <span>{number?.toLocaleString("en-US")}</span>
          <span className="underline text-xl sm:text-base sm:text-[17px] md:text-xl lg:text-[30px] mb-1">đ</span>
        </div>
      </div>
      <div className="mt-4 text-base md:text-[18px] font-bold text-white uppercase text-center">+ Giấy chứng nhận</div>
    </div>
  );
}
