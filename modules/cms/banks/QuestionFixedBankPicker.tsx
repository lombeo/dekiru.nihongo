import { NotFound } from "@src/components/NotFound/NotFound";
import CmsService from "@src/services/CmsService/CmsService";
import { AppPagination, Button, FormActionButton, Modal, Select, TextInput } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { QuestionBankFilterInput } from "./QuestionBankFilterInput";
import { QuizInfoList } from "./quiz/QuizInfoList";

let filter = {
  text: "",
  pageIndex: 1,
  pageSize: 10,
};

export const QuestionFixedBankPicker = (props: any) => {
  const { isOpen, onConfirm, onDiscard, excludedUniqueIds = [], excludeNoAnswers = true, courseId, sectionId } = props;
  const { t } = useTranslation();
  const [listSelected, setListSelected] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [pagination, setPagination] = useState<any>([]);

  const { register, getValues, setValue, reset, control } = useForm({});

  useEffect(() => {
    onLoadData();
    return () => {
      setListSelected([]);
      filter = {
        text: "",
        pageIndex: 1,
        pageSize: 10,
      };
      reset();
    };
  }, [isOpen]);

  useEffect(() => {
    reset({
      ...getValues(),
      visibility: courseId ? "private" : "public",
    });
  }, [courseId]);

  const onLoadData = () => {
    if (isOpen) {
      let filterState = getValues();
      filterState.text = filterState.text ? filterState.text.trim() : "";
      CmsService.getAllQuiz(
        {
          ...filter,
          ...filterState,
          courseId: courseId,
          sectionId: sectionId,
        },
        excludedUniqueIds,
        excludeNoAnswers
      ).then((x: any) => {
        if (x) {
          const pagination = x.paging;
          const listQuizs = x.items;
          setData(listQuizs);
          setPagination(pagination);
        }
      });
    }
  };

  const onSelectQuestionBank = (questionBank: any, value: boolean) => {
    if (value) {
      setListSelected([...listSelected, questionBank]);
    } else {
      const index = listSelected.findIndex((x: any) => x.id == questionBank.id);
      if (index !== -1) {
        let newArr = [...listSelected];
        newArr.splice(index, 1);
        setListSelected(newArr);
      }
    }
  };

  const isSelected = (id: any) => {
    const isFound = listSelected.findIndex((x: any) => x.id == id);
    if (isFound == -1) {
      return false;
    }
    return true;
  };

  const onSaveData = () => {
    onConfirm && onConfirm(listSelected);
  };

  const onChangePage = (pageNumber: any) => {
    filter = {
      ...filter,
      pageIndex: pageNumber,
    };
    onLoadData();
  };

  const onSubmit = () => {
    filter = {
      ...filter,
      pageIndex: 1,
    };
    onLoadData();
  };

  const onSelectBank = (bank: any) => {
    if (bank) {
      setValue("bankId", bank.id);
    } else {
      // reset({
      //   text: getValues('text'),
      // })
    }
  };

  const visibleOptions = [
    {
      value: "public",
      label: t("Public"),
    },
    {
      value: "private",
      label: t("In course"),
    },
  ];

  return (
    <Modal size="lg" opened={isOpen} onClose={() => onDiscard()} title={t(LocaleKeys["Select question from bank"])}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <TextInput className="w-1/2" placeholder={t("Search question")} {...register("text")} />
          <Visible visible={sectionId && courseId ? true : false}>
            <Controller
              name={"visibility"}
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    {...field}
                    size="sm"
                    data={visibleOptions}
                    className="w-1/2"
                    defaultValue={field.value ? field.value : visibleOptions[0].value}
                  />
                );
              }}
            />
          </Visible>
          {/* <Visible visible={watch('visibility') == 'public'}> */}
          <QuestionBankFilterInput onSelect={onSelectBank} />
          {/* </Visible> */}
          <Button onClick={onSubmit}>{t(LocaleKeys["Search"])}</Button>
        </div>
      </div>
      <Visible visible={pagination.totalItems}>
        <div className="flex flex-col mt-3 divide-y divide-dashed">
          <QuizInfoList isSelected={isSelected} selectable={true} onSelect={onSelectQuestionBank} data={data} />
        </div>
        <div className="mt-5">
          <AppPagination
            onChange={onChangePage}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            currentPageSize={data.length}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            label={t("question")}
          />
        </div>
      </Visible>
      <Visible visible={!pagination.totalItems}>
        <NotFound>{t("No Question Found")}</NotFound>
      </Visible>
      <div className="mt-4">
        <FormActionButton
          onDiscard={onDiscard}
          onSave={onSaveData}
          saveDisabled={!pagination.totalItems || !listSelected.length}
          size="md"
        />
      </div>
    </Modal>
  );
};
