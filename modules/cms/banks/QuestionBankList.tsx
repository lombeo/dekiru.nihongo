import { NotFound } from "@src/components/NotFound/NotFound";
import { AppPagination } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { CreateQuestionBankButton } from "./CreateQuestionBankButton";
import styles from "./QuestionBank.module.scss";
import { QuestionBankListItem } from "./QuestionBankListItem";

export const QuestionBankList = (props: any) => {
  const { t } = useTranslation();
  const {
    data,
    pagination,
    onChangePage,
    onClickDelete,
    onClickEdit,
    selectable,
    isSelected,
    onSelectChange,
    isCourseBank,
    courseId,
    sessionData,
    isQuizForm,
    onReset,
  } = props;
  const items =
    data &&
    data.map((x: any) => (
      <QuestionBankListItem
        isQuizForm={isQuizForm}
        isSelected={isSelected}
        onSelectChange={onSelectChange}
        selectable={selectable}
        key={x.id}
        data={x}
        isCourseBank={isCourseBank}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
      />
    ));

  const cardContainerClassName = (() => {
    if (isQuizForm) {
      return "";
    }
    return isCourseBank ? styles.itemgridCourseBank : styles.itemgrid + " mb-5";
  })();

  return (
    <>
      <div className="text-base font-semibold mb-4 flex gap-1 items-center justify-between">
        {pagination?.totalItems > 0 ? (
          <div className="flex gap-1">
            {t(LocaleKeys["Question bank list"])}
            <span className="text-blue-500">({pagination?.totalItems ? pagination?.totalItems : 0})</span>
          </div>
        ) : (
          <></>
        )}
        <Visible visible={isCourseBank}>
          <CreateQuestionBankButton
            courseId={courseId}
            onReset={onReset}
            isCourseBank={isCourseBank}
            sessionData={sessionData}
          />
        </Visible>
      </div>
      {!data ||
        (data?.length == 0 && (
          <NotFound size="page" className="mt-10">
            {t("You have no bank")}
          </NotFound>
        ))}
      {data && data.length > 0 && (
        <>
          <div className={cardContainerClassName}>{items}</div>
          {pagination && (
            <div className="mt-5">
              <AppPagination
                onChange={onChangePage}
                pageIndex={pagination.pageIndex}
                pageSize={pagination.pageSize}
                currentPageSize={data.length}
                totalItems={pagination.totalItems}
                totalPages={pagination.totalPages}
                label={pagination.totalItems > 1 ? t("banks") : t("bank")}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
