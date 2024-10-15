import { Image } from "@mantine/core";
import { Container } from "@src/components";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";

const BoxOutstanding = () => {
  const { t } = useTranslation();
  const refIsDirty = useRef(false);

  const data = [
    {
      title: t("Modern programming learning system"),
      thumbnail: "/images/index/icon-code.png",
      image: "/images/index/he-thong-hoc-code-manh-me.png",
      color: "#F4EBEB",
    },
    {
      title: t("Comprehensible and detailed content"),
      thumbnail: "/images/index/icon-hoc.png",
      image: "/images/index/noi-dung-bai-hoc-de-hieu.png",
      color: "#F1F8EC",
    },
    {
      title: t("Interesting and fun events"),
      thumbnail: "/images/index/icon-chung-nhan.png",
      image: "/images/index/su-kien-lap-trinh.png",
      color: "#F8F4EB",
    },
    {
      title: t("Large and active community"),
      thumbnail: "/images/index/icon-cong-dong.png",
      image: "/images/index/cong-dong-lap-trinh.png",
      color: "#EDEDF8",
    },
    {
      title: t("Specialized support team"),
      thumbnail: "/images/index/icon-doi-ngu-codelearn.png",
      image: "/images/index/doi-ngu-ho-tro-codelearn.png",
      color: "#F4E8EF",
    },
  ];

  const [activeItem, setActiveItem] = useState(data[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refIsDirty.current) {
        clearInterval(interval);
        return;
      }
      setActiveItem((prev: any) => {
        const lastIndex = data.findIndex((e) => e.thumbnail === prev.thumbnail) || 0;
        const newIndex = lastIndex >= data.length - 1 ? 0 : lastIndex + 1;
        return data[newIndex];
      });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="py-[70px] transition-all duration-300" style={{ backgroundColor: activeItem.color }}>
      <Container size="xl">
        <h2 className="text-[30px] lg:text-[42px] font-[700] leading-[1.26] text-center my-0">
          {t("CodeLearn")} <br /> {t("Outstanding advantages")}
        </h2>
        <div className="mt-[40px] grid gap-7 lg:grid-cols-[8fr_4fr] md:grid-cols-[7fr_5fr]">
          <div>
            <img src={activeItem.image} className="max-w-full" />
          </div>
          <div className="text-[#455880] leading-[1.15] justify-center text-lg font-semibold flex flex-col gap-3">
            {data.map((item) => (
              <OutstandingItem
                isActive={item.thumbnail === activeItem.thumbnail}
                key={item.title}
                onClick={() => {
                  refIsDirty.current = true;
                  setActiveItem(item);
                }}
                data={item}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxOutstanding;

const OutstandingItem = (props: any) => {
  const { data, onClick, isActive } = props;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-lg cursor-pointer items-center p-[15px_18px] hover:bg-white gap-4 grid grid-cols-[38px_auto]",
        {
          "bg-white": isActive,
        }
      )}
    >
      <Image src={data.thumbnail} width={38} height={38} />
      <div>{data.title}</div>
    </div>
  );
};
