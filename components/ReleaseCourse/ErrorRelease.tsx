import { useTranslation } from "next-i18next";
import React from "react";
import BankNotFound from "./BankNotFound";
import NoActivity from "./NoActivity";
import NoSchedule from "./NoSchedule";
import NoSection from "./NoSection";

const ErrorRelease = (props: any) => {
  const { message, courseId, code } = props;
  const { t } = useTranslation();

  const itemsRender = () => {
    if (message == "BANK_NOT_FOUND") {
      return <BankNotFound courseId={courseId} code={code} />;
    }
    if (message == "A schedule have no sections") {
      return <NoSection courseId={courseId} />;
    } else if (message == "Course not have any schedule") {
      return <NoSchedule courseId={courseId} />;
    } else {
      return <NoActivity courseId={courseId} />;
    }
  };
  return <>{itemsRender()}</>;
};

export default ErrorRelease;
