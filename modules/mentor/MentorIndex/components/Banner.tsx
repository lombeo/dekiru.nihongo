import React from "react";
import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "@src/hooks/useRouter";

const Banner = () => {
  const router = useRouter();
  const locale = router.locale;
  const isMobile = useMediaQuery("(max-width: 756px)");
  return (
    <div>
      {isMobile ? (
        <Image
          src={locale === "en" ? "/images/banner-mentor-sm-en.png" : "/images/banner-mentor-sm.png"}
          alt=""
          className="w-full aspect-[450/600]"
        />
      ) : (
        <Image
          src={locale === "en" ? "/images/banner-mentor-en.png" : "/images/banner-mentor.png"}
          alt=""
          className="w-full aspect-[1697/561]"
        />
      )}
    </div>
  );
};

export default Banner;
