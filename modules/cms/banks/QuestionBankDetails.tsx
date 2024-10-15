import { Space } from "@mantine/core";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { Base64, FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { AppPagination, Notify, confirmAction } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useRouter } from "hooks/useRouter";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { useEffect, useState } from "react";
import { QuestionBankService } from "services/question-bank";
import { FilterBankDetails } from "./FilterBankDetails";
import { QuestionBankInfo } from "./QuestionBankInfo";
import { QuestionList } from "./QuestionList";
import { QuestionModal } from "./QuestionModal";
import { QuestionBankForm } from "./form/QuestionBankForm";

export const QuestionBankDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { questionBankId } = router.query;
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState<any>();
  const { profile } = useProfileContext();
  const [isLoading, setIsLoading] = useState(false);
  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [tag, setTag] = useState("");
  const [pageIndex, setPageIndex] = useState(1);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  // const params = new URLSearchParams(router.asPath.split("?")[1]);
  // const questionId = params.get("questionId");

  useEffect(() => {
    fetchData();
    const token = PubSub.subscribe("QUESTIONLIST_CHANGED", () => fetchData());
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [questionContent, questionType, tag, pageIndex]);

  const onSearch = ({ questionContent, questionType, tag }: any) => {
    const validateQuestionContent = (questionContent: string) => {
      if (
        questionContent?.match?.(`<*script[^>]*>(.*?)<*/*script>`) ||
        questionContent?.match?.(`<*html[^>]*>(.*?)<*/*html>`)
      ) {
        return questionContent.replace(/<[^>]*>?/gm, "");
      }
      return questionContent;
    };

    setQuestionContent(validateQuestionContent(questionContent));
    setQuestionType(questionType);
    setTag(tag);

    if (data?.paging?.totalPages > 1) {
      onChangePage(1);
    }
  };

  const onChangePage = (page: number) => {
    setPageIndex(page);
  };

  const fetchData = () => {
    CmsService.getQuestionBank(questionBankId, true, false, 10, pageIndex, questionContent, tag, questionType).then(
      (x: any) => {
        if (x) {
          setData(x.data);
        }
      }
    );
  };

  const onEdit = () => {
    setIsEdit(true);
  };

  const getQuestions = () => {
    return data?.questions;
  };

  const onSaveQuestionBank = (data: any) => {
    setIsLoading(true);
    data.questions = [];
    //Encode base64
    data.descriptionEncode =
      data.description && data.description.trim().length > 0 ? Base64.encode(data.description) : "";
    if (data.descriptionEncode.trim().length > 0) {
      data.description = "";
    }
    if (data?.visibility) {
      data.visibility = parseInt(data.visibility);
    }
    QuestionBankService.saveOrUpdateQuestionBank(data)
      .then((res) => {
        if (res) {
          Notify.success(t(data.id ? "Update question bank successfully" : "Save question bank successfully"));
          PubSub.publish("QUESTIONBANK_CHANGED", data);
          fetchData();
          setIsEdit(false);
        }
      })
      .finally(() => {
        setIsEdit(false);
        setIsLoading(false);
      });
  };

  const onCloseEdit = () => {
    setIsEdit(false);
    fetchData();
  };

  const onClickEditQuestion = (questionId: any) => {
    router.push(`/cms/question-bank/${questionBankId}?questionId=${questionId}&type=${questionType}`).then(() => {
      onCloseEdit();
    });
  };

  const onViewDetail = (questionId: any) => {
    router.push(`/cms/question-bank/${questionBankId}?questionId=${questionId}&isView=true`).then(() => {
      onCloseEdit();
    });
  };

  const onSubmitQuestion = (data: any) => {
    CmsService.saveOrUpdateQuestion(data).then((res: any) => {
      if (res) {
        Notify.success(t("Save question successfully!"));
        fetchData();
        router.push(`/cms/question-bank/${questionBankId}`);
      }
    });
  };

  const onDeleteQuestion = (data: any) => {
    const onConfirm = () => {
      CmsService.deleteQuestion(data?.id).then(() => {
        Notify.success(t("Delete question successfully"));
        fetchData();
      });
    };

    confirmAction({
      message: t(LocaleKeys["Are you sure to delete this question"]),
      onConfirm,
    });
  };

  const allowToEdit = FunctionBase.ruleOperation(data?.ownerId == parseInt(profile?.userId), isManagerContent, "or");

  if (!data) return <></>;

  return (
    <>
      <Space h="sm" />
      <Visible visible={isEdit}>
        <QuestionBankForm isLoading={isLoading} data={data} onSave={onSaveQuestionBank} onClose={onCloseEdit} editable={allowToEdit} />
      </Visible>

      <Visible visible={!isEdit}>
        <QuestionBankInfo data={data} isAllowToEdit={allowToEdit} onEdit={onEdit} />

        <FilterBankDetails onSearch={onSearch} />
        <Space h="sm" />
        <QuestionList
          isAllowToEdit={allowToEdit}
          onDelete={onDeleteQuestion}
          onClickEditQuestion={onClickEditQuestion}
          onViewDetail={onViewDetail}
          questionBankId={data?.id}
          data={getQuestions()}
          pagination={data?.paging}
        />
        {data.questions && data.questions.length > 0 && (
          <>
            {data?.paging && (
              <div className="mt-5">
                <AppPagination
                  onChange={onChangePage}
                  pageIndex={data.paging.pageIndex}
                  pageSize={data.paging.pageSize}
                  currentPageSize={data.questions.length}
                  totalItems={data.paging.totalItems}
                  totalPages={data.paging.totalPages}
                  label={t("question")}
                />
              </div>
            )}
          </>
        )}

        <QuestionModal
          isAllowToEdit={allowToEdit}
          questionBankId={questionBankId}
          onSubmitQuestion={onSubmitQuestion}
          data={getQuestions()}
        />
      </Visible>
    </>
  );
};
