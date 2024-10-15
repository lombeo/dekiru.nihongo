import { Alert, Button, Divider } from "@mantine/core";
import { useTranslation } from "next-i18next";

const BankNotFound = (props: any) => {
  const { t } = useTranslation();
  const { code, courseId } = props;
  return (
    <>
      <Alert className="mt-3">
        <h2 className="text-lg font-semibold">{t("Release course")}</h2>
        <h2 className="text-md">
          {t("Course Code")}: {code}
        </h2>
        <p>{t("The quiz is not included in question bank")}</p>
        <Divider className="my-5" />
        <div className="flex justify-end">
          <Button
            onClick={() => {
              window.location.href = `/cms/course/${courseId}`;
            }}
          >
            {t("Back to course")}
          </Button>
        </div>
      </Alert>
    </>
  );
};

export default BankNotFound;
