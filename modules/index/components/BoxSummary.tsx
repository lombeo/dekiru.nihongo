import { Image } from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";

const BoxSummary = () => {
  const { t } = useTranslation();

  const dataInfo = [
    {
      image: "/images/index/phat-trien-tu-duy-sang-tao.png",
      content: t(
        "Learning to code helps you improve logical thinking and take you to a new level in solving problems."
      ),
      title: t("Develop creative thinking"),
    },
    {
      image: "/images/index/lam-quen-cong-nghe.png",
      content: t("Learning to code to step into the world of Information Technology and adapt to the Industry 4.0."),
      title: t("Get to know the technology world"),
    },
    {
      image: "/images/index/mo-rong-co-hoi-nghe-nghiep.png",
      content: t(
        "Programming jobs are growing 50% faster than the overall job market with an average salary of 30% higher than that of other jobs."
      ),
      title: t("Get more job opportunities"),
    },
  ];

  const dataSummary = [
    {
      count: 60000,
      sub: "+",
      label: t("registered students"),
    },
    {
      count: 10000,
      sub: "+",
      label: t("awarded certificates"),
    },
    {
      count: "5",
      label: t("countries in the world"),
    },
  ];

  return (
    <div>
      <div className="py-[70px]">
        <Container size="xl">
          <h2 className="text-[32px] lg:text-[42px] font-[700] leading-[1.26] my-0 text-center">
            {t("Programming")} <br />
            {t("is the in-demand skill for the future")}
          </h2>
          <div className="mt-[80px] grid lg:grid-cols-[1fr_1fr] md:grid-cols-[5fr_7fr] gap-7">
            <Image src="/images/chia-khoa-lap-trinh.png" withPlaceholder width="100%" />
            <div>
              <div className="lg:ml-[15%] h-full justify-center flex flex-col gap-10">
                {dataInfo.map((item) => (
                  <div key={item.title}>
                    <div className="flex items-center gap-4">
                      <Image alt="" withPlaceholder fit="contain" src={item.image} width={42} height={42} />
                      <h3 className="my-0 font-[700] text-[26px]">{item.title}</h3>
                    </div>
                    <div className="mt-2 text-lg font-[500] leading-[1.47]">{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-[url('/images/index/bg-statistic.png')] text-white bg-no-repeat bg-fixed bg-cover py-[60px]">
        <Container size="xl">
          <div className="flex flex-col gap-[50px]">
            <div className="grid lg:grid-cols-3">
              {dataSummary.map((item) => (
                <SummaryItem key={item.label} data={item} />
              ))}
            </div>
            <Link
              href="/learning"
              className="bg-[#e8505b] hover:bg-[#b21010] text-lg mx-auto p-[18px_25px] font-[700] rounded-md text-white"
            >
              {t("Learn to code, now!")}
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BoxSummary;

const SummaryItem = (props: any) => {
  const { data } = props;
  return (
    <div className="flex ml-[18%] flex-col gap-[20px]">
      <div className="relative before:content-[''] before:bg-white before:w-[50px] before:absolute before:h-[6px] before:bottom-0 before:left-0 before:rounded-[4px] font-[700] text-[48px] pb-[6px]">
        {data.count}&nbsp;{data.sub}
      </div>
      <h3 className="font-semibold text-[24px] leading-[1.25px]">{data.label}</h3>
    </div>
  );
};
