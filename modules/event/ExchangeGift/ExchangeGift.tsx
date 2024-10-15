import { Breadcrumbs } from "@edn/components";
import { Container, Image, Tabs } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const ImgInfo = [
  {
    src: "/images/event/star.png",
    width: 40,
    className: "absolute -top-12 left-2",
    id: "1",
  },
  {
    src: "/images/event/star_1.png",
    width: 40,
    className: "absolute -top-12 right-2",
    id: "2",
  },
  {
    src: "/images/event/star.png",
    width: 40,
    className: "absolute top-0 -right-12",
    id: "3",
  },
  {
    src: "/images/event/object.png",
    width: 120,
    className: "absolute -bottom-24 -right-12",
    id: "4",
  },
  {
    src: "/images/event/star_1.png",
    width: 40,
    className: "absolute -bottom-12 left-12",
    id: "5",
  },
  {
    src: "/images/event/object_1.png",
    width: 150,
    className: "absolute -bottom-12 -left-12",
    id: "6",
  },
  {
    src: "/images/event/star.png",
    width: 40,
    className: "absolute bottom-8 -left-12",
    id: "7",
  },
];

const ExchangeGift = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("0");
  return (
    <Container size="lg">
      <Breadcrumbs
        data={[
          {
            href: "/",
            title: t("Home"),
          },
          { href: "/event", title: t("Event") },
          {
            title: t("Exchange rewards"),
          },
        ]}
      />
      <div className="text-center p-2 sm:p-8 sm:pb-24 pb-12 space-y-8">
        <div className=" font-semibold text-2xl text-blue-600">{t("Reward booth")}</div>
        <div className="flex justify-center">
          <Tabs
            value={activeTab}
            radius="lg"
            color="indigo"
            variant="pills"
            onTabChange={(value) => setActiveTab(value)}
            classNames={{
              tabsList: "w-auto gap-1",
              tabLabel: "text-[15px] font-semibold",
              panel: "p-8 rounded-2xl sm:w-[50vw] sm:h-[50vh] bg-white relative",
            }}
          >
            <Tabs.List className="flex justify-center p-4 item">
              <Tabs.Tab value="0">{t("Gifts in kind")}</Tabs.Tab>
              <Tabs.Tab value="1">{t("Course vouchers")}</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="0">
              {ImgInfo.map((img) => (
                <Image key={img.id} src={img.src} className={img.className} width={img.width} alt={img.id} />
              ))}
              <div className="flex justify-center sm:mt-10">
                <Image src="/images/event/gift-box-1.png" width={200} alt="gift" />
              </div>
              <span className="text-red-600">{t("The event will be released in the near future")}</span>
            </Tabs.Panel>
            <Tabs.Panel value="1">
              {ImgInfo.map((img) => (
                <Image key={img.id} src={img.src} className={img.className} width={img.width} alt={img.id} />
              ))}
              <div className="flex justify-center sm:mt-10">
                <Image src="/images/event/gift-box-1.png" width={200} alt="gift" />
              </div>
              <span className="text-red-600">{t("The event will be released in the near future")}</span>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </Container>
  );
};

export default ExchangeGift;
