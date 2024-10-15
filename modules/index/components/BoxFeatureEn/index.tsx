import { Container } from "@src/components";
import Link from "next/link";
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { titleBoxFeatureVariants } from "../BoxFeature";
import clsx from "clsx";

const BoxFeatureEn: FC = () => {
  const data = [
    { title: "Learning", href: "/learning" },
    { title: "Training", href: "/training" },
    { title: "Fights", href: "/fights" },
    { title: "Evaluating", href: "/evaluating" },
    { title: "Discussion", href: "/discussion" },
    { title: "Leaders", href: "/leaderboard" },
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
              <span className="text-[#50EDD1]">Feature-rich</span>
              <span> platform</span>
            </div>
            <div className="w-full max-w-[525px]">
              <span className="text-lg leading-[28px] font-normal text-white">
                Programming is a complex language, so Codelearn focuses on &quot;learning by doing&quot; to help
                students develop comprehensive knowledge and skills.
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

export default BoxFeatureEn;
