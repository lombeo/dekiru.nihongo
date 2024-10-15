import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import ErrorRelease from "@src/components/ReleaseCourse/ErrorRelease";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import ReleaseCourseForm from "./components/ReleaseCourseForm";

const ReleaseView = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const id: any = FunctionBase.getParameterByName("id");
  const code: any = FunctionBase.getParameterByName("code");

  const [errorCodeMessage, setErrorCodeMessage] = useState({
    code: 200,
    message: null,
    success: true,
  });

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!code) return;
    LearnCourseService.checkExistCourse({ code }).then((res) => {
      if (!res?.data) return;
      const data = res.data.data;
      setErrorCodeMessage({ code: res.data.code, message: res.data.message, success: res.data.success });
      if (!data) return;
      setData(data);
    });
  }, [code]);

  return (
    <div className="pb-20 border-b">
      <Container>
        <Breadcrumbs
          data={[
            {
              href: "/",
              title: t("Home"),
            },
            {
              title: t("Release course"),
            },
          ]}
        />
        <div>
          {!errorCodeMessage.success && <ErrorRelease message={errorCodeMessage.message} courseId={id} code={code} />}
          {errorCodeMessage.success && data ? (
            <ReleaseCourseForm setErrorCodeMessage={setErrorCodeMessage} data={data} />
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default ReleaseView;
