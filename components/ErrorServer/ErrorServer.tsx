import React from "react";
import Icon from "@edn/font-icons/icon";
import { useTranslation } from "next-i18next";
import { Button, Image } from "@mantine/core";
import ExternalLink from "@src/components/ExternalLink";

interface NotPermissionProps {
  children?: any;
  className?: string;
  size?: "default" | "page" | "section";
  isShowButton?: boolean;
  message?: string;
}

export const ErrorServer = ({ size = "default", className = "", isShowButton = true, message }: NotPermissionProps) => {
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

  let src = "/images/error/error-server.png";
  return (
    <>
      <div className={`flex flex-col items-center text-center ${className}`}>
        <Image src={src} alt="CodeLearn" width="auto" />
        <div className={`mt-4 mx-auto text-gray ${sizeOnType[size].text}`}>
          {t(message)}
          <div className="flex mt-4 gap-x-8 justify-center">
            {/* <Button variant="light">
              <div className="flex gap-x-2">
                <Icon name="contact-support"></Icon>
                {t("Contact us")}
              </div>
            </Button> */}
            {isShowButton && (
              <>
                <ExternalLink href={`/`}>
                  <Button variant="filled">
                    <div className="flex gap-x-1 items-center">
                      <Icon name="home" size={20}></Icon>
                      {t("Back to home")}
                    </div>
                  </Button>
                </ExternalLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
