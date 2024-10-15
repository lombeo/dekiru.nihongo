import { useNextQueryParam } from "@src/helpers/query-utils";
import { useActionPage } from "@src/hooks/useActionPage";
import CmsService from "@src/services/CmsService/CmsService";
import { Button } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useRef, useState } from "react";
import { Plus } from "tabler-icons-react";
import { CreateQuestionBankPopup } from "./CreateQuestionBankPopup";

export const CreateQuestionBankButton = (props: any) => {
  const { isCourseBank = false, courseId, sessionData, onReset } = props;
  const [isShowPopup, setIsShowPopup] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const actionRouter = useActionPage();

  const [data, setData] = useState(null);

  const questionBankId = useNextQueryParam("questionBankId");

  const refIsCreated = useRef(false);

  const fetchData = () => {
    CmsService.getQuestionBankSkipError(questionBankId, true, isCourseBank).then((x: any) => {
      if (x && x?.data) {
        let processData: any = x.data;
        let courseId;
        let sectionIds: any = [];
        let bankUsages: any[] = processData?.bankUsages ? processData?.bankUsages : [];
        bankUsages.forEach((x: any) => {
          const entityId = x.entityId;
          if (x.entityType == 1) {
            courseId = entityId;
          }
          if (x.entityType == 2) {
            sectionIds.push(entityId);
          }
        });

        let resData = { ...processData };

        if (courseId) {
          resData = {
            ...resData,
            courseId: courseId,
          };
        }

        setData({
          ...resData,
          sectionIds: sectionIds,
        });
        refIsCreated.current = false;
        setIsShowPopup(true);
      } else {
        PubSub.publish("QUESTIONBANK_CHANGED", x);
      }
    });
  };

  useEffect(() => {
    if (!questionBankId) {
      return;
    }
    fetchData();
  }, [questionBankId]);

  const onClickClose = () => {
    setIsShowPopup(false);
    if (!isCourseBank) {
      router.push("/cms/question-bank");
    } else {
      actionRouter.pushResetUrl("pageIndex");
    }
  };

  const goToPage = (page: number) => {
    router.push(`/cms/question-bank?pageIndex=${page}`);
  };

  return (
    <>
      {isShowPopup && (
        <CreateQuestionBankPopup
          courseId={courseId}
          data={refIsCreated.current ? null : data}
          sessionData={sessionData}
          onClose={onClickClose}
          isCourseBank={isCourseBank}
          goToPage={goToPage}
        />
      )}

      <Visible visible={isCourseBank}>
        <Button
          size="xs"
          title={t(LocaleKeys.D_CREATE_NEW_SPECIFIC_ITEM, {
            name: t(LocaleKeys.Bank).toLowerCase(),
          })}
          leftIcon={<Plus width={20} height={20} />}
          onClick={() => {
            refIsCreated.current = true;
            setIsShowPopup(true);
            onReset && onReset();
          }}
        >
          {t("Create Bank")}
        </Button>
      </Visible>

      <Visible visible={!isCourseBank}>
        <Button
          preset="primary"
          size="lg"
          onClick={() => {
            refIsCreated.current = true;
            setIsShowPopup(true);
            onReset && onReset();
          }}
          title={t(LocaleKeys.D_CREATE_NEW_SPECIFIC_ITEM, {
            name: t(LocaleKeys.Bank).toLowerCase(),
          })}
        >
          {t("Create Bank")}
        </Button>
      </Visible>
    </>
  );
};
