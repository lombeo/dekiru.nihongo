import EventBox from "./EventBox";
import { Container } from "@src/components";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import ModalNoticeVerifyPhone from "./components/ModalNoticeVerifyPhone";
import { LOCAL_STORAGE } from "@src/constants/common.constant";

export default function EventPage() {
  const { t } = useTranslation();

  const [isShow, setIsShow] = useState(false);

  const eventList = [
    {
      image: "/images/event/event-page-item-7.png",
      title: "Codewar Junior - Warm-Up Round For High School Students",
      description: "The coding contest for high school students on CodeLearn",
      href: "https://codelearn.io/fights/detail/217",
    },
    {
      image: "/images/event/event-page-item-2.png",
      title: "FPT TECHDAY 2020_CODE WARRIOR_QUALIFYING ROUND_16th NOVEMBER",
      description: "The series of FPT TECHDAY contests to help improve your coding ability and assert yourself.",
      href: "https://codelearn.io/fights/detail/313",
    },
    {
      image: "/images/event/event-page-item-9.png",
      title: "Đấu trường Reinforcement Learning",
      description:
        "In this game, you have to control your character moving on a map represented as a two-dimensional matrix to overcome obstacles and dig for as much gold as possible. Pay close attention to the obsstacles on the map and be careful with your energy bar to come up with the right tactics!",
      href: "/event/reinforcement-learning-competition",
    },
    {
      image: "/images/event/event-page-item-5.png",
      title: "Can Tho Codewar 2019 - Make Your {code} Shine",
      description: "The coding contest for students in Can Tho and Vietnam's western region",
      href: "https://codelearn.io/fights/detail/113",
    },
    {
      image: "/images/event/event-page-item-6.png",
      title: "FPT Techday - Code Gladiator Contest",
      description: "The series of FPT TECHDAY contests to help improve your coding ability and assert yourself.",
      href: "https://codelearn.io/fights/detail/119",
    },
    {
      image: "/images/event/event-page-item-1.png",
      title: "Codeware 2019 {code} Your Life -  Cuder Arena",
      description: "The individual coding contest for college students in Vietnam",
      href: "https://codelearn.io/fights/detail/93",
    },
    {
      image: "/images/event/event-page-item-3.png",
      title: "DA NANG_CODE WAR 2019: ELIMINATION ROUND",
      description: "The coding contest for programming lovers in Da Nang and Vietnam's middle region",
      href: "https://codelearn.io/fights/detail/103",
    },
    {
      image: "/images/event/event-page-item-8.png",
      title: "FPT Codeware - Coding contest",
      description: "AI and coding contest for Japanese developers (only for Japan)",
      href: "https://codelearn.io/fights/detail/1",
    },
    {
      image: "/images/event/event-page-item-4.png",
      title: "FPT Code Ware - Pikalong War",
      description: "Coding contest for Japanese developers (only for Japan)",
      href: "https://codelearn.io/fights/detail/10",
    },
  ];

  const banner = useRef(null);

  const handleCheckShowPopup = () => {
    const content = localStorage.getItem(LOCAL_STORAGE.FIRST_TIME_LOAD_EVENT);
    if (!content) {
      localStorage.setItem(LOCAL_STORAGE.FIRST_TIME_LOAD_EVENT, "true");
      setIsShow(true);
    }
  };

  useEffect(() => {
    handleCheckShowPopup();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth < 640) {
      banner.current.setAttribute("src", "/images/event/event-page-banner-mobile.jpg");
    } else {
      banner.current.setAttribute("src", "/images/event/event-page-banner.jpg");
    }
  };

  return (
    <div className="bg-[#f6f7f8] pb-20">
      <div className="relative">
        <Link href="/event/duong-dua-lap-trinh-2024">
          <img ref={banner} src={`/images/event/event-page-banner.jpg`} className="w-full" />
        </Link>

        <Container size="xl" className="absolute left-0 top-0">
          <Breadcrumbs
            className="flex-wrap gap-y-3 py-3 md:py-5"
            separator={<ChevronRight color={"#FFFFFF"} size={15} />}
          >
            <Link href="/" className={`text-[#FFFFFF] text-[13px] hover:underline`}>
              {t("Home")}
            </Link>
            <span className="text-[#FFFFFF] text-[13px] max-w-[100px] sm:max-w-max text-ellipsis">{t("Event")}</span>
          </Breadcrumbs>
        </Container>
      </div>

      <Container className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 screen1024:grid-cols-3 gap-7 sm:gap-5 screen1024:gap-8">
          {eventList.map((item, index) => (
            <EventBox key={index} data={item} />
          ))}
        </div>
      </Container>
      {isShow && <ModalNoticeVerifyPhone onClose={() => setIsShow(false)} />}
    </div>
  );
}
