/*
 * List test case
 */
import { Button } from "components/cms";
import { ActivityCodeTypeEnum } from "constants/cms/activity-code/activity-code.constant";
import { useTranslation } from "next-i18next";
import { TestCaseItem } from "./TestCaseItem";

export const ListTestCase = (props: any) => {
  const {
    codeType,
    data,
    onAddNew,
    onDelete,
    register,
    errors,
    watch,
    onEditTestCase,
    removeItem,
    actionType,
    disabled,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      {(data.length > 0 ||
        codeType !== ActivityCodeTypeEnum.SQL ||
        (codeType == ActivityCodeTypeEnum.SQL && actionType != "create")) && (
        <>
          {" "}
          <div className="mb-1">
            {t("Test cases")} <span style={{ color: "#F03E3E" }}>*</span>
          </div>
          {!disabled && (
            <Button className="mb-5" preset="primary" onClick={() => onAddNew()}>
              {t("Add test case")}
            </Button>
          )}
        </>
      )}

      {data &&
        data.map((x: any, idx: any) => (
          <TestCaseItem
            remove={removeItem}
            onEditTestCase={onEditTestCase}
            watch={watch}
            key={idx}
            idx={idx}
            register={register}
            codeType={codeType}
            onDelete={onDelete}
            data={x}
            errors={errors}
            disabled={disabled}
          />
        ))}
    </>
  );
};
