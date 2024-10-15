import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FileInput,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import { Container } from "@src/components";
import Link from "@src/components/Link";
import { fileType } from "@src/config";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useCountries from "@src/hooks/useCountries";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { UploadService } from "@src/services/UploadService/UploadService";
import _, { isNil } from "lodash";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import getSchemaCv from "./FormCv.validation";

const FormCv = (props: any) => {
  const { isUpdate } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { stateVNOptions } = useCountries();

  const { industryOptions, workingTypeOptions, literacyOptions, experienceOptions, jobLevelOptions } =
    useRecruitmentMasterData();

  const defaultValues = {
    ..._.omit(props.data || {}, [
      "expectLevel",
      "currentLevel",
      "userExpLevel",
      "literacy",
      "workingType",
      "experience",
      "industries",
    ]),
    cvModel: isUpdate
      ? {
          name: props.data?.cvUrl,
        }
      : null,
    expectLevelId: isUpdate ? props.data?.expectLevel?.id : null,
    currentLevelId: isUpdate ? props.data?.currentLevel?.id : null,
    literacyId: isUpdate ? props.data?.literacy?.id : null,
    workingTypeId: isUpdate ? props.data?.workingType?.id : null,
    experienceId: isUpdate ? props.data?.experience?.id : null,
    name: isUpdate ? props.data?.name : "",
    careerObjective: isUpdate ? props.data?.careerObjective : "",
    industryIds: isUpdate ? props.data?.industries?.map((e) => _.toString(e.id)) : [],
    workplaces: isUpdate ? props.data?.workplaces?.map((e) => _.toString(e.stateId)) : [],
    isOpen: isUpdate ? props.data?.isOpen : true,
    isPublic: isUpdate ? props.data?.isPublic : true,
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaCv(t)),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const handleClickSubmit = () => {
    handleSubmit(async (data: any) => {
      setLoading(true);
      delete data.cvModel;
      const res = await RecruitmentService.cvSave({
        ...data,
        industryIds: data.industryIds?.map((e) => +e),
        workplaces: data.workplaces?.map((e) => ({ stateId: +e })),
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        router.push("/user/cv");
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const handleUpload = async (file: any) => {
    const isValid = validation(file);
    if (!isValid) {
      return null;
    }
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res?.data?.success && res?.data?.data?.url) {
      return res.data.data.url;
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    return null;
  };

  const validation = (file: any) => {
    let isValid = true;
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  return (
    <div className="pb-20">
      <Container>
        <Breadcrumbs
          data={[
            {
              href: `/`,
              title: t("Home"),
            },
            {
              href: "/user/cv",
              title: t("My CV"),
            },
            {
              title: isUpdate ? t("Update CV") : t("Create CV"),
            },
          ]}
        />
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Basic information")}</div>
            <div className="px-5 pb-5 pt-2 flex flex-col gap-5">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    withAsterisk
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Expected position")}
                  />
                )}
              />
              <div className="grid gap-5 lg:grid-cols-2">
                <Controller
                  name="cvModel"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      {...field}
                      error={errors.cvUrl?.message as string}
                      onChange={(file) => {
                        field.onChange(file);
                        if (file) {
                          handleUpload(file).then((fileUrl: any) => {
                            setValue("cvUrl", fileUrl, {
                              shouldValidate: true,
                            });
                          });
                        } else {
                          setValue("cvUrl", null, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      clearable
                      accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                      withAsterisk
                      label={t("Select CV")}
                    />
                  )}
                />
                <Controller
                  name="industryIds"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      data={industryOptions}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      label={t("Industry")}
                      maxSelectedValues={3}
                    />
                  )}
                />
                <Controller
                  name="currentLevelId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={jobLevelOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Current level")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="expectLevelId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={jobLevelOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Expected job level")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="expectSalary"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      withAsterisk
                      precision={2}
                      hideControls
                      decimalSeparator="."
                      thousandsSeparator=","
                      min={0}
                      max={1000}
                      classNames={{
                        rightSection: "w-[90px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                        input: "!pr-[98px]",
                      }}
                      rightSection={<div className="text-sm text-[#222]">{t("million VND")}</div>}
                      error={errors[field.name]?.message as string}
                      label={t("Salary")}
                    />
                  )}
                />
                <Controller
                  name="literacyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={literacyOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Education")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="experienceId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={experienceOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Years of experience")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="workplaces"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      data={stateVNOptions}
                      withAsterisk
                      searchable
                      error={errors[field.name]?.message as string}
                      label={t("Workplace")}
                      maxSelectedValues={3}
                    />
                  )}
                />
                <Controller
                  name="workingTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={workingTypeOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Type of employment")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="careerObjective"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      minRows={5}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Career Objective")}
                      placeholder={t("Please enter your career objective")}
                    />
                  )}
                />
              </div>

              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    searchable
                    creatable
                    clearable
                    label={
                      <div className="flex justify-between gap-5 flex-wrap">
                        <div>{t("Required skills") + " " + t("(optional)")}</div>
                        <div>{t("Up to 10 skills")}</div>
                      </div>
                    }
                    getCreateLabel={(query: any) => `+ ${t("Create")} ${query}`}
                    value={field.value}
                    data={field.value || []}
                    error={errors[field.name]?.message as string}
                    onChange={(value: any) => {
                      const listCurrentTag =
                        value?.map((_item: string) => {
                          const item = _.replace(_item, /,/g, "");
                          return FunctionBase.normalizeSpace(item);
                        }) || [];
                      const values = listCurrentTag.filter((item: string) => {
                        return FunctionBase.normalizeSpace(item).length > 0;
                      });
                      field.onChange(values);
                    }}
                    classNames={{ label: "w-full" }}
                    placeholder={t("Enter required skills for this position")}
                  />
                )}
              />
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    label={t("Make profile searchable")}
                    checked={field.value}
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
              <Controller
                name="isOpen"
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    label={t("Make is open for work")}
                    checked={field.value}
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
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
          </div>

          <div className="flex items-center justify-end gap-5">
            <Button size="md" variant="outline" onClick={() => router.push("/user/cv")}>
              {t("Cancel")}
            </Button>
            <Button size="md" loading={loading} onClick={handleClickSubmit}>
              {t("Save")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormCv;
