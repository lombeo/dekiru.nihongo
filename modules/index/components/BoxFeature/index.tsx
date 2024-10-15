import { Container } from "@src/components";
import { Variants, motion } from "framer-motion";
import Link from "next/link";
import { FC, useState } from "react";
import clsx from "clsx";

export const titleBoxFeatureVariants: Variants = {
  offscreen: {
    y: 200,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const BoxFeature: FC = () => {
  const data = [
    { title: "Học tập ngay", href: "/learning" }
  ];

  const [listItemHovered, setListItemHovered] = useState<{}>({});

  const hasHoveredElement = Object.values(listItemHovered).some((item) => item === true);

  return (
    <div className="bg-[#19395E] w-full -mt-1 py-[64px] sm:py-[84px] md:py-[104px] relative">
      <Container size="xl">
        <div className="w-full max-w-[1200px] m-auto relative z-[2] flex flex-col gap-[42px] md:gap-[62px]">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            variants={titleBoxFeatureVariants}
          >
            <div className="text-3xl leading-10 gmd:text-[48px] gmd:leading-[60px] font-semibold text-white mb-4">
              <span>Nền tảng </span>
              <span className="text-[#50EDD1]">đa dạng tính năng</span>
            </div>
            <div className="w-full max-w-[525px]">
              <span className="text-lg leading-[28px] font-normal text-white">
                Tiếng Nhật là một ngôn ngữ thú vị nhưng cũng khó để thành thạo, bởi vậy, Dekiru chú trọng vào việc &quot;học đi đôi với hành&quot;
                giúp học viên phát triển toàn diện về khiến thức và kĩ năng.
              </span>
            </div>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {data.map((item, index) => (
              <div
                key={`feature-${index}`}
                onMouseEnter={() =>
                  setListItemHovered((prev) => {
                    return { ...prev, [index]: true };
                  })
                }
                onMouseLeave={() =>
                  setListItemHovered((prev) => {
                    return { ...prev, [index]: false };
                  })
                }
                className={`bg-white rounded-md w-full h-[100px] border-b-4 border-[#506CF0] flex items-center justify-center font-bold text-lg leading-[26px] text-[#fff] uppercase transition-all duration-300 ${
                  hasHoveredElement && listItemHovered[index] === true
                    ? "scale-125 !bg-[#506CF0]"
                    : hasHoveredElement && !listItemHovered[index] === true
                    ? "scale-75"
                    : "scale-100"
                }`}
              >
                <Link href={item.href}>
                  <a
                    className={clsx("w-full h-full flex items-center justify-center", {
                      "text-white": hasHoveredElement && listItemHovered[index] === true,
                    })}
                  >
                    {item.title}
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
      <div
        style={{ clipPath: "polygon(0 80%, 100% 30%, 100% 100%, 0 100%)" }}
        className="bg-[#EDF0FD] absolute top-0 left-0 z-1 w-full h-full"
      />
    </div>
  );
};

export default BoxFeature;
