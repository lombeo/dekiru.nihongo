import React from "react";
import { useTranslation } from "next-i18next";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { Image } from "@mantine/core";

const BoxOurPride = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-[70px]">
      <Container size="xl">
        <div className="grid gap-7 md:grid-cols-[7fr_5fr]">
          <div className="flex items-center">
            <div className="max-w-[705px]">
              <h2 className="text-[30px] lg:text-[42px] font-[700] leading-[1.26] my-0">
                <Link href="/aboutus">{t("Our pride")}</Link>
              </h2>
              <div className="text-lg mt-4">
                {t(
                  "Dekiru develops a comprehensive ecosystem of courses, practice exercises and coding contests with multilingual support. We connect people who share the same passion for programming to build a strong programming community together."
                )}
              </div>
            </div>
          </div>
          <div>
            <Link href="/aboutus">
              <div className="max-w-[552px]">
                <Image src="/images/index/chung-tri-codelearn.png" alt="" withPlaceholder className="max-w-full" />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BoxOurPride;
