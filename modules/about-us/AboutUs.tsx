import React from "react";
import { Container } from "@src/components";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { Breadcrumbs } from "@edn/components";

const AboutUs = () => {
  const { t } = useTranslation();

  const timelines = [
    {
      title: t("First idea"),
      date: t("April 2018"),
      content: (
        <>
          {t("In early 2018, the first idea of a learning and training system came to Cao Van Viet.")}
          <br />
        </>
      ),
      image: "/images/about-us/5.jpg",
    },
    {
      title: t("Launching"),
      date: t("June 2018"),
      content: t("After 2 months, the development team launched the first testing version with more than 100 users."),
      image: "/images/about-us/6.jpg",
    },
    {
      title: "FPT CodeWar",
      date: t("August – December 2018"),
      content: t(
        "In August 2018, the system successfully supported CodeWar competitions organized by FPT software in August 2018."
      ),
      image: "/images/about-us/7.jpg",
    },
    {
      title: t("Introducing"),
      date: t("January 2019"),
      content: t("The system is now officially named CodeLearn and gradually completed by the project members."),
      image: "/images/about-us/8.jpg",
    },
    {
      title: t("Implemented in internal FPT Software"),
      date: t("March 2019"),
      content: t("CodeLearn has been used in some units in FPT Software for the purpose of training and practicing."),
      image: "/images/about-us/9.jpg",
    },
    {
      title: t("Golive"),
      date: t("May 2019"),
      content: t(
        "The first completed CodeLearn version is launched nationwide with a lot of benefits and advantageous functions.\n"
      ),
      image: "/images/about-us/10.jpg",
    },
  ];
  const members = [
    {
      name: "Cao Van Viet",
      position: t("Product Owner"),
      imageUrl: "/images/about-us/VietCV.jpg",
    },
    {
      name: "Le Anh Dung",
      position: t("Specialist Consultant"),
      imageUrl: "/images/about-us/DungLA.jpg",
    },
    {
      name: "Nguyen Hoai Huong",
      position: t("Public Relations Supporter"),
      imageUrl: "/images/about-us/HuongNH.jpg",
    },
    {
      name: "Bui Binh Minh",
      position: t("Public Relations Supporter"),
      imageUrl: "/images/about-us/MinhBB.jpg",
    },
    {
      name: "Nguyen Duy Quan",
      position: t("Software Developer"),
      imageUrl: "/images/about-us/QuanND.jpg",
    },
    {
      name: "Nguyen Van Doan",
      position: t("Software Developer"),
      imageUrl: "/images/about-us/DoanNV.jpg",
    },
    {
      name: "Ha Hai Duong",
      position: t("Software Developer"),
      imageUrl: "/images/about-us/DuongHH.jpg",
    },
    {
      name: "Nguyen Thi Oanh",
      position: t("Product Designer"),
      imageUrl: "/images/about-us/OanhNT.jpg",
    },
    {
      name: "Tran Thi Minh Nguyet",
      position: t("Software Tester"),
      imageUrl: "/images/about-us/NguyetTTM.jpg",
    },
    {
      name: "Nguyen Thi Nhu Quynh",
      position: t("Software Tester"),
      imageUrl: "/images/about-us/QuynhNTN.jpg",
    },
    {
      name: "Le Khanh Hoa",
      position: t("Business Analyst"),
      imageUrl: "/images/about-us/HoaLK.jpeg",
    },
    {
      name: "Bui Thi Thu",
      position: t("Content Marketing Writer"),
      imageUrl: "/images/about-us/ThuBT.jpg",
    },
    {
      name: "Dinh Xuan Cong",
      position: t("Content Creator"),
      imageUrl: "/images/about-us/CongDX.jpg",
    },
    {
      name: "Tran Cong Minh",
      position: t("Content Creator"),
      imageUrl: "/images/about-us/MinhTC.jpg",
    },
    {
      name: "Tran Van Linh",
      position: t("Content Creator"),
      imageUrl: "/images/about-us/LinhTV.jpg",
    },
    {
      name: "Lai Quoc Tuan",
      position: t("Content Creator"),
      imageUrl: "/images/about-us/TuanLQ.jpg",
    },
  ];

  return (
    <div>
      <Container size="lg">
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              title: t("About us"),
            },
          ]}
        />
      </Container>
      <h1 className="hidden">
        CodeLearn is an online interactive platform that enables users to learn, practice and evaluate their programming
        skills and connect with each others.
      </h1>
      {/* Banner */}
      <header className="bg-[url('/images/about-us/Code-Learn-Banner.jpg')] bg-no-repeat min-h-[150px] md:min-h-[470px] bg-top-center bg-[length:100%]" />
      {/* Who we are */}
      <section id="who-we">
        <Container size="lg">
          <div className="grid gap-7 lg:grid-cols-[5fr_7fr] md:grid-cols-2">
            <div className="md:mt-[-70px]">
              <img
                className="shadow-[0_2px_4px_0_rgba(192,192,192,.5)] max-w-full w-[457px] border-4 border-solid border-[#fff]"
                src="/images/about-us/Code-Learn.jpg?v=rk1"
                alt=""
              />
            </div>
            <div>
              <h3 className="text-[#4d96ff] text-[32px] font-[500] uppercase mt-[55px] leading-[38px] mb-[10px]">
                {t("WHO WE ARE?")}
              </h3>
              <div className="text-[#333] leading-[26px]">
                {t(
                  "CodeLearn is a system and an online interactive platform that enables users to learn, practice and evaluate their programming skills through practicing exercises, coding contests with automatically scoring function so that users could improve their skills and increase productivity."
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Vision */}
      <section id="vision">
        <Container>
          <div className="grid gap-7 md:grid-cols-2">
            <div>
              <h3 className="text-[#4d96ff] text-[32px] font-[500] uppercase mt-[55px] leading-[38px] mb-[10px]">
                {t("VISION")}
              </h3>
              <div className="text-[#333] leading-[26px]">
                {t(
                  "Whoever you are, CodeLearn will always help you to discover the limits of your own. We promise to bring a channel to developers to share computer science knowledge not only in Vietnam but also in Southeast Asia and the whole of Asia."
                )}
              </div>
            </div>
            <div>
              <img className="max-w-full h-auto" src="/images/about-us/3.png" alt="" />
            </div>
          </div>
        </Container>
      </section>
      {/* Missions */}
      <section id="missions">

        <Container>
          <div className="grid gap-7 md:grid-cols-2">
            <div className="img mt-14">
              <img className="max-w-full h-auto" src="/images/about-us/4.png" alt="" />
            </div>
            <div>
              <h3 className="text-[#4d96ff] text-[32px] font-[500] uppercase mt-[55px] leading-[38px] mb-[10px]">
                {t("MISSIONS")}
              </h3>
              <div className="text-[#333] leading-[26px]">
                {t(
                  "We focus on developing a comprehensive ecosystem with the basic-to-advanced courses and practicing challenges that are appropriate for everyone. With the rich and diverse courses and challenges which support a variety of coding languages, CodeLearn helps users to learn and practice programming easily and effectively."
                )}
                <br />
                {t(
                  "We connect all the people who share the passion for computer science domains then build a strong community together."
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Values */}
      <section id="values" className="bg-[#F4F4F4] pb-10">
        <Container>
          <div>
            <div className="text-center">
              <h3 className="text-[#4d96ff] text-[32px] font-[500] uppercase pt-[55px] leading-[38px] mb-8">
                {t("VALUES")}
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  image: "/images/about-us/k1.svg",
                  title: t("Knowledge"),
                  content: t(
                    "Basic-to-advanced online courses for practising and learning purpose of varied types of users."
                  ),
                },
                {
                  image: "/images/about-us/k2.svg",
                  title: t("Brain training playground"),
                  content: t(
                    "A huge amount of algorithm challenges that encourages users to create solutions in various languages."
                  ),
                },
                {
                  image: "/images/about-us/k3.svg",
                  title: t("Connection"),
                  content: t(
                    "The community for developers to come, solve problems together and learn from each other."
                  ),
                },
                {
                  image: "/images/about-us/k4.svg",
                  title: t("Customer delight"),
                  content: t(
                    "A trusted companion to provide contests for organizations and support individuals to archive their goals."
                  ),
                },
              ].map((item) => (
                <div className="bg-white p-5 flex gap-5" key={item.image}>
                  <div className="flex-none  w-[55px]">
                    <img className="max-w-full h-auto" src={item.image} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="my-0">{item.title}</h4>
                    <div>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      {/* Our Story */}
      <section id="out-story" className="pb-[70px]">
        <Container>
          <div>
            <div className="text-center">
              <h3 className="text-[#4d96ff] text-[32px] font-[500] uppercase mt-[55px] leading-[38px] mb-[10px]">
                {t("OUR STORY")}
              </h3>
            </div>
          </div>
          {timelines.map((item, index) => {
            const isRight = index % 2 !== 0;
            return (
              <div key={item.title} className="grid lg:grid-cols-2">
                {isRight ? <div className="hidden lg:block" /> : null}
                <div
                  className={clsx("relative px-4", {
                    "text-left": isRight,
                    "lg:text-right": !isRight,
                  })}
                >
                  {isRight ? (
                    <>
                      <div className="hidden lg:block absolute top-0 left-[-1px] h-full bg-[#c8c8c8] w-[1px]" />
                      <span className="hidden lg:block absolute top-[5px] left-[-3.5px] rounded-full bg-[#4d96ff] w-[5px] h-[5px] z-30" />
                      <span className="hidden lg:block absolute top-[2.5px] left-[-5.5px] rounded-full bg-[rgba(77,150,255,.3)] w-[10px] h-[10px] z-20" />
                      <span className="hidden lg:block absolute top-0 left-[-8px] rounded-full bg-[rgba(77,150,255,.1)] w-[15px] h-[15px] z-10" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block absolute top-0 right-0 h-full bg-[#c8c8c8] w-[1px]" />
                      <span className="hidden lg:block absolute top-[5px] right-[-1.5px] rounded-full bg-[#4d96ff] w-[5px] h-[5px] z-30" />
                      <span className="hidden lg:block absolute top-[2.5px] right-[-4.5px] rounded-full bg-[rgba(77,150,255,.3)] w-[10px] h-[10px] z-20" />
                      <span className="hidden lg:block absolute top-0 right-[-7px] rounded-full bg-[rgba(77,150,255,.1)] w-[15px] h-[15px] z-10" />
                    </>
                  )}

                  <div className="text-[#898989] text-sm mt-10 lg:mt-0">{item.date}</div>
                  <h4 className="text-[#4d96ff] text-[24px] font-[500] mt-0 leading-[38px] mb-[10px]">{item.title}</h4>
                  <div className="text-sm mb-[10px]">{item.content}</div>
                  <img
                    className="max-w-full h-auto max-h-[187px] border-4 border-[#fff] border-solid rounded-[3px] shadow-[0_0_6px_0_rgba(192,192,192,.5)] "
                    src={item.image}
                  />
                </div>
              </div>
            );
          })}
        </Container>
      </section>
      {/* 30 Day of code */}
      <section id="join-us" className="relative bg-[url('/images/about-us/23.jpg')] bg-center bg-cover bg-no-repeat">
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.6)]" />
        <div className="z-10 relative">
          <Container>
            <div className="min-h-[300px] flex flex-col gap-4 items-center justify-center text-center">
              <h4 className="text-[#fff] text-[32px] font-[500] uppercase leading-[38px] my-0">{t("WE’RE HIRING!")}</h4>
              <div className="text-[#fff] text-[24px] my-0 text-center">
                {t("Help us to build a comprehensive ecosystem of code learning and developer connecting.")}
              </div>
              <div className="rounded-sm text-center py-2 text-white px-5 cursor-pointer bg-[linear-gradient(90deg,#4d96ff_0%,#9570ee_100%)]">
                {t("Join Us")}
              </div>
            </div>
          </Container>
        </div>
      </section>
      {/* Our team */}
      <section id="out-team" className="border-b-2 border-b-solid pb-20">
        <Container>
          <div>
            <div className="text-center">
              <h3 className="text-[#4d96ff] text-[26px] lg:text-[32px] font-[500] uppercase mt-[55px] leading-[38px] mb-[10px]">
                {t("OUR TEAM")}
              </h3>
            </div>
            <div className="grid gap-7 lg:grid-cols-4 md:grid-cols-2 mt-10">
              {members.map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2">
                  <div>
                    <img
                      className="max-w-full object-cover rounded-full overflow-hidden h-[170px] w-[170px]"
                      src={item.imageUrl}
                      alt={item.name}
                    />
                  </div>
                  <div className="">{item.name}</div>
                  <div className="text-sm text-[#898989]">{item.position}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
