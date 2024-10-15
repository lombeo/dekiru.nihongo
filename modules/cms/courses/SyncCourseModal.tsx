import Table, { TableColumn } from "@edn/components/Table/Table";
import { yupResolver } from "@hookform/resolvers/yup";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import CmsService from "@src/services/CmsService/CmsService";
import { Form, FormActionButton, Modal, MultiSelect, Notify, ValidationNotification } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { NotificationLevel } from "constants/cms/common.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SyncCourseSchema } from "validations/cms/course.schemal";

export const SyncCourseModal = (props: any) => {
  const { opened = true, onClose } = props;
  const { t } = useTranslation();

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    return () => {
      setData([]);
    };
  }, [opened]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SyncCourseSchema),
    defaultValues: {
      courseCodes: [],
    },
  });

  const onSync = (data: any) => {
    const courseCodes = data?.courseCodes;
    CmsService.syncCourseByListCourse(courseCodes).then((x: any) => {
      if (x && x.length) {
        const response = courseCodes.map((code: any, idx: any) => {
          return {
            code: code,
            ...x[idx],
          };
        });
        setData(response);
        setValue("courseCodes", []);
      }
    });
  };

  const columns: TableColumn[] = [
    {
      title: t(LocaleKeys["Course code"]),
      dataIndex: "code",
      headClassName: "text-left",
      className: "text-left",
    },
    {
      title: t(LocaleKeys["Status"]),
      dataIndex: "status",
      headClassName: "text-left",
      className: "text-left",
      render: (params: any) => (
        <>
          {params.status ? (
            <div className="text-success font-semibold">{t(LocaleKeys["Successful"])}</div>
          ) : (
            <div className="text-critical font-semibold">{t(LocaleKeys["Fail"])}</div>
          )}
        </>
      ),
    },
    {
      title: t(LocaleKeys["Note"]),
      dataIndex: "fullName",
      headClassName: "text-left",
      className: "text-left",
      render: (params: any) => (
        <>
          <Visible visible={!params.status && params.error == "NOT_FOUND"}>
            <span className="text-critical font-semibold">{t(LocaleKeys["Wrong code"])}</span>
          </Visible>
          <Visible visible={!params.status && params.error !== "NOT_FOUND"}>
            <span className="text-black font-semibold">{t(LocaleKeys["Error"])}</span>
          </Visible>
        </>
      ),
    },
  ];

  return (
    <Modal title="Sync Course" size="lg" closeOnClickOutside={false} opened={opened} onClose={onClose}>
      <Form onSubmit={handleSubmit(onSync)}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Controller
              name="courseCodes"
              control={control}
              render={({ field }) => {
                return (
                  <MultiSelect
                    {...field}
                    data={field.value ?? []}
                    label={t(LocaleKeys["Course codes"])}
                    placeholder={t(LocaleKeys.D_ENTER_SPECIFIC, {
                      name: t(LocaleKeys["Course code"]).toLowerCase(),
                    })}
                    onChange={(value: any) => {
                      value = value.map((item: string) => FunctionBase.normalizeSpace(item));
                      const values = value.filter((item: string, pos: number) => {
                        return FunctionBase.normalizeSpace(item).length > 0 && value.indexOf(item) == pos;
                      });
                      if (value.length > 5) {
                        Notify.error(t("You are only allowed to create a maximum of 5 course code"));
                      } else {
                        setValue && setValue("courseCodes", values);
                      }
                    }}
                    size="md"
                    searchable
                    creatable
                    clearable
                    // maxSelectedValues={5}
                    nothingFound={t(
                      LocaleKeys["You have not entered a course code or the course code has been added to the list"]
                    )}
                    getCreateLabel={(query: any) => `+ Create ${query}`}
                    classNames={{
                      label: `overflow-visible`,
                      value: "bg-blue-primary text-white ",
                      defaultValueRemove: "text-white",
                    }}
                    styles={{
                      searchInput: {
                        width: "100%",
                        maxWidth: "180px",
                        minWidth: "60px",
                        outline: "none !important",
                      },
                    }}
                  />
                );
              }}
            />
            <ValidationNotification
              message={t((errors.courseCodes as any)?.message as any)}
              type={NotificationLevel.ERROR}
            />
          </div>

          <Visible visible={data?.length > 0}>
            <div>{t("Result")}</div>
            <Table
              className="table-auto w-full"
              wrapClassName="mb-6"
              data={data}
              columns={columns}
              // isLoading={isLoading}
            ></Table>
          </Visible>

          <div>
            <FormActionButton
              onDiscard={onClose}
              saveDisabled={watch("courseCodes").length == 0}
              textDiscard="Cancel"
              textSave={"Sync"}
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
};
