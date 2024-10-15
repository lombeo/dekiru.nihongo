import { NotFound } from "@src/components/NotFound/NotFound";
import CmsService from "@src/services/CmsService/CmsService";
import { FormActionButton, Modal } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { QuizInfoBankDetailsList } from "./QuizInfoBankDetailsList";
import { QuizInfoList } from "./QuizInfoList";

export const QuizPreviewPopup = (props: any) => {
  const { data, isOpen, onDiscard, type } = props;
  const { title, settings } = data;
  const { questionConfigs = [], bankConfigs = [] } = settings;
  const { t } = useTranslation();
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [questionByBank, setQuestionByBank] = useState<any>(null);

  const isRandom = type == "random";

  useEffect(() => {
    if (isRandom) {
      const bankIds = bankConfigs.map((x: any) => x.bankId);
      getBanksByIds(bankIds);
    } else {
      const questionUniqueIds = questionConfigs.map((x: any) => x.uniqueId);
      getQuestionsByUniqueIds(questionUniqueIds);
    }
  }, []);

  const getQuestionsByUniqueIds = (ids: [number]) => {
    CmsService.getQuestionByIds(ids).then((res: any) => {
      setListQuestion(res);
    });
  };

  const getBanksByIds = (bankIds: number[]) => {
    bankIds.forEach((bankId) => {
      CmsService.searchQuestion({
        bankId: bankId,
        pageIndex: 1,
        pageSize: 10,
      }).then((res: any) => {
        if (res?.data?.items) {
          setQuestionByBank((prev: any) => (prev ? [...prev, ...res.data.items] : res.data.items));
        }
      });
    });
  };

  const getListQuestion = () => {
    const getQuestionInfo = (bankId: any): any => {
      const item = bankConfigs.find((x: any) => x.bankId == bankId);
      if (!item) return null;
      return item;
    };
    return listQuestion.map((x: any) => {
      const info: any = getQuestionInfo(x.bankId);
      return {
        ...x,
        mark: info?.mark,
        bankTitle: info?.bankTitle,
      };
    });
  };

  const getQuestionBanks = () => {
    return bankConfigs.map((bc: any) => {
      const questions = questionByBank?.filter((b: any) => bc.bankId == b.bankId);
      return {
        ...bc,
        questions: questions,
      };
    });
  };

  const isBlank = (() => {
    if (isRandom) {
      if (!questionByBank || questionByBank.length == 0) {
        return true;
      }
    } else {
      if (!listQuestion?.length) {
        return true;
      }
    }
    return false;
  })();

  const isCollapse = (() => {
    if (isRandom) {
      if (bankConfigs?.length == 1) {
        return true;
      }
    }
    return false;
  })();

  return (
    <>
      <Modal size="lg" opened={isOpen} onClose={() => onDiscard()} title={t(LocaleKeys["Preview Quiz"])}>
        <div className="quiz-preview">
          {!isRandom && (
            <div className="font-semibold p-2">
              <div>{`${title} (${listQuestion.length} questions)`}</div>
            </div>
          )}
          <div className="divide-y divide-dashed space-y-1">
            <Visible visible={!isBlank}>
              <QuizInfoList data={getListQuestion()} collapse={false} />
            </Visible>
            <Visible visible={!isBlank}>
              <QuizInfoBankDetailsList data={getQuestionBanks()} collapse={isCollapse} />
            </Visible>
            <Visible visible={isBlank}>
              <NotFound size="section">{t("There are no questions in this quiz!")}</NotFound>
            </Visible>
          </div>
          <FormActionButton textDiscard={t(LocaleKeys["Close"])} onDiscard={onDiscard} enableSave={false} />
        </div>
      </Modal>
    </>
  );
};
