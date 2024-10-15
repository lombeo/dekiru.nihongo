import Certificate from "@src/components/Certificate";
import { Trans, useTranslation } from "next-i18next";
import Image from "next/image";
import { useState, useEffect } from "react";

interface BoxCertificateProps {
  data: any;
}

const BoxCertificate = (props: BoxCertificateProps) => {
  const { data } = props;

  const { t } = useTranslation();

  const percentageToComplete = data?.percentageToComplete || 90;

  const [courseTitleVN, setCourseTitleVN] = useState("");
  const [courseTitleEN, setCourseTitleEN] = useState("");

  useEffect(() => {
    if (data && data?.multiLangData?.length) {
      const titleVN = data?.multiLangData.find((item) => item?.key === "vn");
      const titleEN = data?.multiLangData.find((item) => item?.key === "en");

      if (titleVN) {
        setCourseTitleVN(titleVN?.title);
      } else {
        setCourseTitleVN(data?.multiLangData[0]?.title);
      }
      if (titleEN) {
        setCourseTitleEN(titleEN?.title);
      } else {
        setCourseTitleEN(data?.multiLangData[0]?.title);
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-6" id="certificate">
      <h3 className="my-0 font-semibold text-[24px]">{t("Certificate")}</h3>
      <div className="bg-navy-light5 overflow-hidden rounded-[12px] gap-6 lg:p-8 p-6 grid lg:grid-cols-[1fr_230px]">
        <div>
          <h4 className="my-0 font-semibold text-lg">{t("Certificate of learn completion")}</h4>
          <div className="max-w-[400px] mt-3 leading-[35px]">
            <Trans
              i18nKey="PERCENT_TO_COMPLETE_COURSE"
              t={t}
              values={{
                percent: `${percentageToComplete}%`,
              }}
              components={{ highlight: <span className="font-semibold text-[#13C296] text-[24px]" /> }}
            />
          </div>
        </div>
        <div className="lg:order-none order-first md:text-left text-center">
          <Image
            alt="certificate"
            src="/images/learning/certificate.png"
            width={216}
            height={164}
            className="w-full max-w-[216px]"
          />
        </div>
      </div>
      <Certificate
        percentageToComplete={percentageToComplete}
        isDone={data?.isPass}
        progress={data?.progress}
        courseTitleVN={courseTitleVN}
        courseTitleEN={courseTitleEN}
        finishedTime={data?.finishedTime}
        enrolmentUniqueId={data?.enrolmentUniqueId}
      />
    </div>
  );
};

export default BoxCertificate;
