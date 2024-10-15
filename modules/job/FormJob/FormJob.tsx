import { Breadcrumbs, RichEditor } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, MultiSelect, NumberInput, Select, Text, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Container } from "@src/components";
import { FunctionBase, convertDate } from "@src/helpers/fuction-base.helpers";
import useCountries from "@src/hooks/useCountries";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import _, { isNil } from "lodash";
import moment from "moment/moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Calendar, Plus, Trash } from "tabler-icons-react";
import getSchemaJobManagement from "./FormJob.validation";

const FormJob = (props: any) => {
  const { isUpdate } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);

  const { stateVNOptions } = useCountries();

  const fetchCompany = async () => {
    const res = await RecruitmentService.companyList({
      pageIndex: 1,
      pageSize: 0,
    });
    const data = res?.data?.data;
    setCompanyOptions(data);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const { industryOptions, workingTypeOptions, literacyOptions, experienceOptions, jobLevelOptions, genderOptions } =
    useRecruitmentMasterData();

  const defaultValues = {
    ..._.omit(props.data || {}, [
      "jobLevel",
      "literacy",
      "workingType",
      "company",
      "experience",
      "gender",
      "industries",
    ]),
    isNoSalary: isUpdate ? props.data?.minSalary === 0 && props.data?.maxSalary === 0 : false,
    isNegotiateSalary: isUpdate ? !!props.data?.isNegotiateSalary : false,
    submissionDeadline: isUpdate ? convertDate(props.data?.submissionDeadline) : null,
    jobLevelId: isUpdate ? props.data?.jobLevel?.id : null,
    literacyId: isUpdate ? props.data?.literacy?.id : null,
    workingTypeId: isUpdate ? props.data?.workingType?.id : null,
    experienceId: isUpdate ? props.data?.experience?.id : null,
    genderId: isUpdate ? props.data?.gender?.id : null,
    title: isUpdate ? props.data?.title : "",
    permalink: isUpdate ? props.data?.permalink : "",
    externalink: isUpdate ? props.data?.externalink : "",
    industryIds: isUpdate ? props.data?.industries?.map((e) => _.toString(e.id)) : [],
    workplaces: isUpdate
      ? props.data?.workplaces
      : [
          {
            countryId: 0,
            address: "",
          },
        ],
    contactInfo: isUpdate ? props.data?.contactInfo : {},
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues,
    shouldUnregister: false,
    resolver: yupResolver(getSchemaJobManagement(t)),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const workplacesField = useFieldArray({
    control,
    name: "workplaces",
  });

  const handleClickSubmit = () => {
    handleSubmit(async (data: any) => {
      setLoading(true);
      const res = await RecruitmentService.jobSave({
        ...data,
        industryIds: data.industryIds?.map((e) => +e),
        externalink: data.externalink || null,
        minSalary: data.isNegotiateSalary || data.isNoSalary ? 0 : data.minSalary,
        maxSalary: data.isNegotiateSalary || data.isNoSalary ? 0 : data.maxSalary,
        probationDuration: data.probationDuration || 0,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        router.push("/job/management");
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };
  const companyParents = companyOptions
    ?.filter((e) => !e.parentId)
    ?.map((item) => ({ label: item.name, value: _.toString(item.id) }));
  const subCompanies = companyOptions
    ?.filter((e) => e.parentId == watch("parentCompanyId") && watch("parentCompanyId"))
    ?.map((item) => ({ label: item.name, value: _.toString(item.id) }));

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
              href: `/job/management`,
              title: t("List of job post"),
            },
            {
              title: isUpdate ? t("Update job post") : t("Create job post"),
            },
          ]}
        />
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Basic information")}</div>
            <div className="px-5 pb-5 pt-2 flex flex-col gap-5">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    withAsterisk
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    placeholder={t("Display location of job posting")}
                    label={t("Title")}
                    id="title"
                    onBlur={() => {
                      const title = (document.getElementById("title") as any)?.value;
                      setValue("permalink", FunctionBase.slugify(title), {
                        shouldValidate: true,
                      });
                    }}
                  />
                )}
              />
              <div className="grid gap-5 lg:grid-cols-2">
                {/*<Controller*/}
                {/*  name="permalink"*/}
                {/*  control={control}*/}
                {/*  render={({ field }) => (*/}
                {/*    <TextInput*/}
                {/*      {...field}*/}
                {/*      withAsterisk*/}
                {/*      error={errors[field.name]?.message as string}*/}
                {/*      autoComplete="off"*/}
                {/*      label={t("Permalink")}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*/>*/}
                <Controller
                  name="parentCompanyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      searchable
                      clearable
                      data={companyParents}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => {
                        field.onChange(value ? +value : null);
                        setValue("subCompanyId", null);
                      }}
                      error={errors[field.name]?.message as string}
                      label={t("Company")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="subCompanyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      searchable
                      clearable
                      disabled={isNil(watch("parentCompanyId"))}
                      data={subCompanies}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(value ? +value : null)}
                      error={errors[field.name]?.message as string}
                      label={t("Sub company")}
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
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
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
                      label={t("Degree")}
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
                      label={t("Experience")}
                      withAsterisk
                    />
                  )}
                />

                <Controller
                  name="jobLevelId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={jobLevelOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Job level")}
                      withAsterisk
                    />
                  )}
                />
                <div className="grid gap-5 lg:grid-cols-2">
                  <Controller
                    name="minAge"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        value={isNil(watch("minAge")) ? "" : watch("minAge")}
                        classNames={{
                          rightSection: "w-[80px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                          input: "!pr-[88px]",
                        }}
                        rightSection={<div className="text-sm text-[#222]">{t("years old")}</div>}
                        error={errors[field.name]?.message as string}
                        label={t("Minimum age")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("maxAge");
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="maxAge"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        value={isNil(watch("maxAge")) ? "" : watch("maxAge")}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("minAge");
                        }}
                        label={t("Maximum age")}
                        classNames={{
                          rightSection: "w-[80px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                          input: "!pr-[88px]",
                        }}
                        rightSection={<div className="text-sm text-[#222]">{t("years old")}</div>}
                        error={errors[field.name]?.message as string}
                      />
                    )}
                  />
                </div>
                <Controller
                  name="genderId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={genderOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Gender requirement")}
                      withAsterisk
                    />
                  )}
                />

                <Controller
                  name="numberOfRecruitment"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={watch("numberOfRecruitment")}
                      label={t("Number of recruitment")}
                      error={errors[field.name]?.message as string}
                      withAsterisk
                      placeholder={t("Numbers only. Eg:") + " 10"}
                    />
                  )}
                />
                <Controller
                  name="probationDuration"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={watch("probationDuration")}
                      label={t("Probation duration")}
                      error={errors[field.name]?.message as string}
                      classNames={{
                        rightSection: "w-[80px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                        input: "!pr-[88px]",
                      }}
                      min={0}
                      rightSection={<div className="text-sm text-[#222]">{t("month")}</div>}
                      placeholder={t("Numbers only. Eg:") + " 1"}
                    />
                  )}
                />
                <Controller
                  name="submissionDeadline"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      {...field}
                      onChange={(val) => {
                        field.onChange(val ? moment(val).startOf("day").toDate() : null);
                      }}
                      placeholder={t("dd/mm/yyyy")}
                      valueFormat="DD/MM/YYYY"
                      decadeLabelFormat="DD/MM/YYYY"
                      minDate={new Date()}
                      icon={<Calendar size={16} />}
                      clearable
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      label={t("Submission deadline")}
                    />
                  )}
                />
              </div>
              <Controller
                name="externalink"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Externalink")}
                  />
                )}
              />

              <div className="mt-4 font-semibold">{t("Workplace")}</div>
              <div className="flex flex-col gap-2">
                {workplacesField.fields?.map((item, index) => (
                  <div key={item.id} className="bg-[#F6F6F6]">
                    <div className="text-sm font-semibold flex items-center justify-between border-b px-5 py-3">
                      <div>
                        {t("Address")} {index + 1}
                      </div>
                      {workplacesField.fields.length > 1 && (
                        <ActionIcon color="indigo" size="sm" onClick={() => workplacesField.remove(index)}>
                          <Trash />
                        </ActionIcon>
                      )}
                    </div>
                    <div className="px-5 pt-2 pb-5 grid lg:grid-cols-2 gap-5">
                      <Controller
                        name={`workplaces.${index}.stateId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            searchable
                            clearable
                            withAsterisk
                            data={stateVNOptions}
                            allowDeselect={false}
                            error={errors.workplaces?.[index]?.stateId?.message}
                            value={isNil(field.value) ? null : field.value.toString()}
                            onChange={(value) => field.onChange(+value)}
                            label={t("Province/City")}
                          />
                        )}
                      />
                      <Controller
                        name={`workplaces.${index}.address`}
                        control={control}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            withAsterisk
                            autoComplete="off"
                            error={errors.workplaces?.[index]?.address?.message}
                            label={t("House number, road name")}
                          />
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Button
                  onClick={() => {
                    if (workplacesField.fields.length >= 10) {
                      Notify.error(t("maximum 10 locations"));
                      return;
                    }
                    workplacesField.append({ countryId: 0, address: "" });
                  }}
                  className="hover:bg-transparent font-semibold"
                  variant="subtle"
                  color="blue"
                  leftIcon={<Plus />}
                >
                  {t("Add workplace")}
                </Button>
                <div className="font-semibold text-xs text-gray-500">{t("maximum 10 locations")}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Salary & Skills")}</div>
            <div className="px-5 pb-5 pt-2 flex flex-col gap-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <Select
                  data={[
                    {
                      label: t("In range"),
                      value: "0",
                    },
                    {
                      label: t("Negotiable"),
                      value: "1",
                    },
                    {
                      label: t("No salary"),
                      value: "2",
                    },
                  ]}
                  allowDeselect={false}
                  value={watch("isNegotiateSalary") ? "1" : watch("isNoSalary") ? "2" : "0"}
                  onChange={(value) => {
                    setValue("isNegotiateSalary", value === "1");
                    if (value === "2") {
                      setValue("minSalary", 0);
                      setValue("maxSalary", 0);
                      setValue("isNoSalary", true);
                    } else {
                      trigger("minSalary");
                      trigger("maxSalary");
                      setValue("isNoSalary", false);
                    }
                  }}
                  label={t("Salary")}
                  withAsterisk
                />
                <Controller
                  name="minSalary"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      disabled={watch("isNegotiateSalary") || watch("isNoSalary")}
                      withAsterisk
                      precision={2}
                      hideControls
                      decimalSeparator="."
                      thousandsSeparator=","
                      min={0}
                      classNames={{
                        rightSection: "w-[90px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                        input: "!pr-[98px]",
                      }}
                      rightSection={<div className="text-sm text-[#222]">{t("million VND")}</div>}
                      error={errors[field.name]?.message as string}
                      label={t("Minimum salary")}
                      placeholder={t("Numbers only. Eg:") + " 10"}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger("maxSalary");
                      }}
                    />
                  )}
                />
                <Controller
                  name="maxSalary"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={watch("maxSalary")}
                      disabled={watch("isNegotiateSalary") || watch("isNoSalary")}
                      withAsterisk
                      precision={2}
                      hideControls
                      decimalSeparator="."
                      thousandsSeparator=","
                      label={t("Maximum salary")}
                      placeholder={t("Numbers only. Eg:") + " 10"}
                      classNames={{
                        rightSection: "w-[90px] border-l rounded-r py-1 bg-[#F7F7FA] m-[1px]",
                        input: "!pr-[98px]",
                      }}
                      rightSection={<div className="text-sm text-[#222]">{t("million VND")}</div>}
                      error={errors[field.name]?.message as string}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger("minSalary");
                      }}
                    />
                  )}
                />
              </div>

              <Controller
                name="requiredSkill"
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
                      const values = _.uniq(
                        listCurrentTag.filter((item: string) => {
                          return FunctionBase.normalizeSpace(item).length > 0;
                        })
                      );
                      field.onChange(values);
                    }}
                    classNames={{ label: "w-full" }}
                    placeholder={t("Enter required skills for this position")}
                  />
                )}
              />
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Job descriptions")}</div>
            <div className="px-5 pb-5 pt-2 flex flex-col gap-5">
              {/*<Controller*/}
              {/*  name="shortDescription"*/}
              {/*  control={control}*/}
              {/*  render={({ field }) => (*/}
              {/*    <TextInput*/}
              {/*      {...field}*/}
              {/*      withAsterisk*/}
              {/*      error={errors[field.name]?.message as string}*/}
              {/*      autoComplete="off"*/}
              {/*      label={t("Short descriptions")}*/}
              {/*    />*/}
              {/*  )}*/}
              {/*/>*/}
              <div>
                <label className="text-sm">
                  {t("Job descriptions")} <span className="text-[#fa5252]">*</span>
                </label>
                <RichEditor
                  value={watch("fullDescription")}
                  onChange={(value) =>
                    setValue("fullDescription", value, {
                      shouldValidate: true,
                    })
                  }
                />
                <Text color="red" size="xs">
                  {(errors as any)?.fullDescription?.message}
                </Text>
              </div>
              <div>
                <label className="text-sm">
                  {t("Job requirements")} <span className="text-[#fa5252]">*</span>
                </label>
                <RichEditor
                  value={watch("requirement")}
                  onChange={(value) =>
                    setValue("requirement", value, {
                      shouldValidate: true,
                    })
                  }
                />
                <Text color="red" size="xs">
                  {(errors as any)?.requirement?.message}
                </Text>
              </div>
              <div>
                <label className="text-sm">
                  {t("Benefits")} <span className="text-[#fa5252]">*</span>
                </label>
                <RichEditor
                  value={watch("benefits")}
                  onChange={(value) =>
                    setValue("benefits", value, {
                      shouldValidate: true,
                    })
                  }
                />
                <Text color="red" size="xs">
                  {(errors as any)?.benefits?.message}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Contact information")}</div>
            <div className="px-5 pb-5 pt-2 flex flex-col gap-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <Controller
                  name="contactInfo.fullName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={(errors?.contactInfo as any)?.fullName?.message as string}
                      autoComplete="off"
                      label={t("Full name")}
                    />
                  )}
                />
                <Controller
                  name="contactInfo.email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={(errors?.contactInfo as any)?.email?.message as string}
                      autoComplete="off"
                      label={t("Email")}
                    />
                  )}
                />
                <Controller
                  name="contactInfo.phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={(errors?.contactInfo as any)?.phoneNumber?.message as string}
                      autoComplete="off"
                      label={t("Phone number")}
                    />
                  )}
                />
              </div>

              <Controller
                name="contactInfo.address"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    withAsterisk
                    error={(errors?.contactInfo as any)?.address?.message as string}
                    autoComplete="off"
                    className="max-w-[782px]"
                    label={t("Address")}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-5">
            <Button size="md" variant="outline" onClick={() => router.push("/job/management")}>
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

export default FormJob;
