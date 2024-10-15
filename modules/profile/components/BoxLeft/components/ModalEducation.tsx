import React, { useEffect, useState } from "react";
import { Autocomplete, Checkbox, Modal, Select, TextInput } from "@mantine/core";
import { Trans, useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { DatePickerInput } from "@mantine/dates";
import { Calendar } from "tabler-icons-react";
import { convertDate, FunctionBase } from "@src/helpers/fuction-base.helpers";
import Link from "@src/components/Link";
import { IdentityService } from "@src/services/IdentityService";
import useDebounce from "@src/hooks/useDebounce";

interface ModalEducationProps {
  onClose: () => void;
  onSuccess: () => void;
  data?: any;
}

const classList = [
  { label: "Khối 1", value: "Khối 1" },
  { label: "Khối 2", value: "Khối 2" },
  { label: "Khối 3", value: "Khối 3" },
  { label: "Khối 4", value: "Khối 4" },
  { label: "Khối 5", value: "Khối 5" },
  { label: "Khối 6", value: "Khối 6" },
  { label: "Khối 7", value: "Khối 7" },
  { label: "Khối 8", value: "Khối 8" },
  { label: "Khối 9", value: "Khối 9" },
  { label: "Khối 10", value: "Khối 10" },
  { label: "Khối 11", value: "Khối 11" },
  { label: "Khối 12", value: "Khối 12" },
  { label: "Khác", value: "Khác" },
];

const ModalEducation = (props: ModalEducationProps) => {
  const { onClose, data, onSuccess } = props;
  const { t } = useTranslation();

  const isUpdate = !!data;

  const handleGetGradeName = () => {
    let result = "";
    const classTemp = classList.find((item) => item.label === data?.grade);
    if (classTemp) result = data?.grade;
    else if (data?.grade) methodForm.setValue("class", "Khác");
    return result;
  };

  const initialValues: any = {
    ...(data || {}),
    college: data ? FunctionBase.htmlDecode(data.college) : "",
    title: data ? FunctionBase.htmlDecode(data.major) : "",
    grade: handleGetGradeName(),
    college_Id: data?.collegeId || null,
    fromDate: data ? convertDate(data.fromDate) : null,
    toDate: data ? convertDate(data.toDate) : null,
  };

  const [loading, setLoading] = useState(false);
  const [university, setUniversity] = useState([]);
  const [schoolList, setSchoolList] = useState([]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    resolver: yupResolver(
      yup.object().shape({
        college_Id: yup.string().when("grade", {
          is: (val: string) => val !== "Khác",
          then: yup.string().nullable().required(t("This field is required, do not be left blank")),
          otherwise: yup.string().nullable().notRequired(),
        }),
        college: yup.string().when("grade", {
          is: (val: string) => val === "Khác",
          then: yup.string().nullable().required(t("This field is required, do not be left blank")),
          otherwise: yup.string().notRequired(),
        }),
        grade: yup.string().nullable().required(t("This field is required, do not be left blank")),
        agree: yup
          .boolean()
          .nullable()
          .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
          .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = methodForm;

  const fetchUniversity = async (university: string) => {
    const res = await IdentityService.getSchoolOrUniversity({ keyword: university });
    const objectData = res?.data?.data;
    if (res?.data?.success && objectData) {
      setUniversity(Object.values(objectData));
      const arr = [];
      for (let key in objectData) {
        arr.push({ label: objectData[key], value: Number(key) });
      }
      setSchoolList(arr);
    }
  };

  const debounceUni = useDebounce(watch("college"));

  useEffect(() => {
    fetchUniversity(watch("college"));
  }, [debounceUni]);

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      const res = await IdentityService.saveUserEducation({
        ...data,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        setTimeout(() => {
          onSuccess?.();
        }, 500);
        onClose();
      }
    })();
  };

  return (
    <Modal
      classNames={{ title: "font-semibold uppercase text-lg" }}
      title={t("Education")}
      size="xl"
      centered
      onClose={onClose}
      opened
    >
      <div className="flex gap-4 flex-col py-6">
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={t("Grade_1")}
              placeholder={t("Select grade")}
              nothingFound={t("No result found")}
              data={classList}
              onChange={(e) => {
                field.onChange(e);
                methodForm.setValue("college", "");
                methodForm.setValue("college_Id", "");
                methodForm.setValue("title", "");
                methodForm.setValue("fromDate", null);
                methodForm.setValue("toDate", null);
              }}
              clearable
              searchable
              error={errors[field.name]?.message as string}
              size="md"
              required
            />
          )}
        />
        {watch("grade") !== "Khác" && (
          <Controller
            name="college_Id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={t("School")}
                placeholder={t("Select school")}
                nothingFound={t("No result found")}
                data={schoolList}
                clearable
                onSearchChange={(e) => {
                  methodForm.setValue("college", e);
                }}
                searchable
                error={errors[field.name]?.message as string}
                size="md"
                required
              />
            )}
          />
        )}

        {watch("grade") === "Khác" && (
          <>
            <div className="sm:flex sm:gap-4 sm:space-y-0 space-y-4">
              <Controller
                name="college"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    label={t("School")}
                    placeholder={t("Select or input school")}
                    required
                    maxDropdownHeight={200}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    size="md"
                    className="w-full"
                    data={university}
                  />
                )}
              />
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={t("Major")}
                    placeholder={t("Your graduated major")}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    className="w-full"
                    size="md"
                    disabled={!watch("college")}
                  />
                )}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <Controller
                name="fromDate"
                control={control}
                render={({ field }) => (
                  <DatePickerInput
                    {...field}
                    icon={<Calendar size={16} />}
                    clearable
                    size="md"
                    popoverProps={{
                      withinPortal: true,
                    }}
                    valueFormat="DD/MM/YYYY"
                    decadeLabelFormat="DD/MM/YYYY"
                    placeholder={t("From date")}
                    disabled={!watch("college")}
                    error={errors[field.name]?.message as string}
                    label={t("From")}
                  />
                )}
              />
              <Controller
                name="toDate"
                control={control}
                render={({ field }) => (
                  <DatePickerInput
                    {...field}
                    icon={<Calendar size={16} />}
                    clearable
                    size="md"
                    popoverProps={{
                      withinPortal: true,
                    }}
                    valueFormat="DD/MM/YYYY"
                    decadeLabelFormat="DD/MM/YYYY"
                    placeholder={t("To date")}
                    disabled={!watch("college")}
                    error={errors[field.name]?.message as string}
                    label={t("To")}
                  />
                )}
              />
            </div>
          </>
        )}
        <Controller
          name="agree"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              label={
                <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                  I agree to
                  <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                    Terms of Service and Privacy Policy
                  </Link>
                </Trans>
              }
              error={errors[field.name]?.message as string}
            />
          )}
        />
      </div>

      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={() => handleClickSubmit()}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalEducation;
