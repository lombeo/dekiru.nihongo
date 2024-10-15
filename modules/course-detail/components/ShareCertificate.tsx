import { Breadcrumbs, OverlayLoading } from "@edn/components";
import { Flex } from "@mantine/core";
import Certificate from "@src/components/Certificate/Certificate";
import { NotFound } from "@src/components/NotFound/NotFound";
import { LearnCourseService } from "@src/services";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";

interface ShareCertificateProps {
  enrolmentUniqueId?: any;
}
const ShareCertificate = (props: ShareCertificateProps) => {
  const { t } = useTranslation();
  const { enrolmentUniqueId } = props;

  const [courseTitleVN, setCourseTitleVN] = useState("");
  const [courseTitleEN, setCourseTitleEN] = useState("");

  const fetchDataUserCertificate = async () => {
    const response = await LearnCourseService.shareCertificate(enrolmentUniqueId);
    if (response) return response.data;
  };

  const { data: dataUserCertificate } = useQuery({
    queryKey: ["share-certificate"],
    queryFn: () => fetchDataUserCertificate(),
  });
  // const courseId = FunctionBase.getCourseIdInPermalink(dataUserCertificate?.data.permalink);
  const permalink = dataUserCertificate?.data.permalink;

  const getBreadcrumbs = () => {
    if (dataUserCertificate)
      return [
        {
          href: `/learning/${permalink}`,
          title: `${dataUserCertificate?.data.title}`,
        },
        {
          href: `/`,
          title: t("Certificate"),
        },
      ];
  };

  useEffect(() => {
    if (dataUserCertificate?.data && dataUserCertificate?.data?.multiLangData?.length) {
      const titleVN = dataUserCertificate?.data?.multiLangData.find((item) => item?.key === "vn");
      const titleEN = dataUserCertificate?.data?.multiLangData.find((item) => item?.key === "en");

      if (titleVN) {
        setCourseTitleVN(titleVN?.title);
      } else {
        setCourseTitleVN(dataUserCertificate?.data?.multiLangData[0]?.title);
      }
      if (titleEN) {
        setCourseTitleEN(titleEN?.title);
      } else {
        setCourseTitleEN(dataUserCertificate?.data?.multiLangData[0]?.title);
      }
    }
  }, [dataUserCertificate]);

  const userName: string = dataUserCertificate?.data?.owner?.displayName || dataUserCertificate?.data?.owner?.userName;

  if (!dataUserCertificate?.data) return <OverlayLoading />;

  if (!dataUserCertificate.data.isPass) return <NotFound />;

  return (
    <>
      <div className="pt-5">
        <Flex className="justify-center" align="center">
          <Breadcrumbs data={getBreadcrumbs()} />
        </Flex>
      </div>
      <div className="pb-12 pt-4">
        <Certificate
          isDone
          enrolmentUniqueId={enrolmentUniqueId}
          courseTitleVN={courseTitleVN}
          courseTitleEN={courseTitleEN}
          finishedTime={dataUserCertificate?.data.finishedTime}
          userNameShare={userName}
        />
      </div>
    </>
  );
};
export default ShareCertificate;
