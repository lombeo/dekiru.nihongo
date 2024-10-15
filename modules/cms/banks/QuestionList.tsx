import { Text } from "@mantine/core";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { CreateQuestionButton } from "./CreateQuestionButton";
import QuestionBankTable from "./QuestionBankTable";

export const QuestionList = (props: any) => {
  const { questionBankId, data, onDelete, onClickEditQuestion, onViewDetail, isAllowToEdit, pagination } = props;
  const { t } = useTranslation();

  const firstRowOnPage = (pagination?.pageIndex - 1) * pagination?.pageSize + 1;

  return (
    <>
      <div className="pt-5 pb-5 flex justify-between">
        <Text weight={"bold"}>
          {t("Question list")} ({pagination?.totalItems})
        </Text>
        <Visible visible={isAllowToEdit}>
          <CreateQuestionButton questionBankId={questionBankId} />
        </Visible>
      </div>
      <div>
        <QuestionBankTable
          data={data}
          isAllowToEdit={isAllowToEdit}
          onEdit={onClickEditQuestion}
          onDelete={onDelete}
          onView={onViewDetail}
          startIndex={firstRowOnPage}
        />
      </div>
    </>
  );
};
