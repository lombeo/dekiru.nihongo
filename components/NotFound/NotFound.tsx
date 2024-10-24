import { Button } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { Image } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { PropsWithChildren } from "react";
import Link from "../Link";

interface NotFoundProps {
  className?: string;
  size?: "default" | "page" | "section";
}

export const NotFound = ({ size = "default", className = "", children }: PropsWithChildren<NotFoundProps>) => {
  const { t } = useTranslation();
  const sizeOnType = {
    default: {
      img: "",
      text: "",
    },
    page: {
      img: "w-60 h-60",
      text: "mt-4 font-semibold",
    },
    section: {
      img: "w-40 h-40",
      text: "mt-2 font-normal",
    },
  };

  let src = "/images/error/not-found.png";
  return (
    <>
      <div className={`flex flex-col items-center text-center ${className}`}>
        {children || (
          <>
            <Image src={src} alt="CodeLearn" width="auto" />
            <div className={`mt-0 mx-auto text-gray ${sizeOnType[size].text}`}>
              {t("Page not found. Please try again")}
              <div className="flex mt-4 gap-x-8 justify-center">
                {/* <Button variant="light">
              <div className="flex gap-x-2">
                <Icon name="contact-support"></Icon>
                {t("Contact us")}
              </div>
            </Button> */}
                <Link href="/">
                  <Button variant="filled">
                    <div className="flex gap-x-1 items-center">
                      <Icon name="home" size={20}></Icon>
                      {t("Back to home")}
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
