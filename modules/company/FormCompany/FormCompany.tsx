import { Breadcrumbs, RichEditor } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, FileInput, MultiSelect, Select, Text, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import { fileType } from "@src/config";
import { REGEX_PHONE } from "@src/constants/common.constant";
import useCountries from "@src/hooks/useCountries";
import useRecruitmentMasterData from "@src/hooks/useRecruitmentMasterData";
import { RecruitmentService } from "@src/services/RecruitmentService/RecruitmentService.ts";
import { UploadService } from "@src/services/UploadService/UploadService";
import _, { isEmpty, isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash } from "tabler-icons-react";
import * as yup from "yup";

const FormCompany = (props: any) => {
  const { isUpdate, data } = props;
  const { t } = useTranslation();

  const router = useRouter();

  const { businessAreaOptions, industryOptions, companySizeOptions } = useRecruitmentMasterData();

  const { stateVNOptions } = useCountries();

  const [loading, setLoading] = useState(false);

  const [parentCompanies, setParentCompanies] = useState([]);

  const parentCompanyOptions = parentCompanies
    ?.filter((e) => e.id !== data?.id)
    ?.map((e: any) => ({ label: e.name, value: _.toString(e.id) }));

  const fetchParentCompaniesParents = async () => {
    const res = await RecruitmentService.companyList({
      pageIndex: 1,
      pageSize: 0,
    });
    if (res?.data?.success) {
      setParentCompanies(res?.data?.data);
    }
  };

  useEffect(() => {
    fetchParentCompaniesParents();
  }, []);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: {
      ..._.omit(data || {}, ["businessArea", "companySize", "industries", "jobs"]),
      logoModel: isUpdate
        ? {
            name: data?.logo,
          }
        : null,
      bannerModel: isUpdate
        ? {
            name: data?.banner,
          }
        : null,
      shortName: isUpdate ? props.data?.shortName : "",
      industryIds: isUpdate ? props.data?.industries?.map((e) => _.toString(e.id)) : [],
      workingTypeId: isUpdate ? props.data?.workingType?.id : null,
      businessAreaId: isUpdate ? props.data?.businessArea?.id : null,
      companySizeId: isUpdate ? props.data?.companySize?.id : null,
      addresses: isUpdate
        ? data.addresses
        : [
            {
              address: "",
            },
          ],
    },
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        name: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Name") }))
          .trim(t("{{name}} must not be blank", { name: t("Name") }))
          .min(5, t("{{name}} must be more than 5 characters.", { name: t("Name") }))
          .max(
            200,
            t("Please enter no more than {{count}} characters.", {
              count: 200,
            })
          ),
        shortName: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Short name") }))
          .trim(t("{{name}} must not be blank", { name: t("Short name") }))
          .max(
            200,
            t("Please enter no more than {{count}} characters.", {
              count: 200,
            })
          ),
        taxCode: yup
          .string()
          .nullable()
          .test("testTaxCode", t("{{name}} must not be blank", { name: t("Tax code") }), (value, schema) => {
            return !isNil(schema.parent.parentId) || !isEmpty(value?.trim());
          })
          .test(
            "testTaxCode",
            t("{{name}} is invalid.", {
              name: t("Tax code"),
            }),
            (value, schema) => {
              return (
                !isNil(schema.parent.parentId) || (!isEmpty(value?.trim()) && value.length >= 9 && value.length <= 120)
              );
            }
          ),
        facebook: yup
          .string()
          .nullable()
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        website: yup
          .string()
          .nullable()
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        twitter: yup
          .string()
          .nullable()
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        linkedIn: yup
          .string()
          .nullable()
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        banner: yup.string().nullable(),
        logo: yup
          .string()
          .nullable()
          .required(
            t("{{name}} must not be blank", {
              name: t("Logo"),
            })
          ),
        email: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Email") }))
          .trim(t("{{name}} must not be blank", { name: t("Email") }))
          .email(t("Invalid email"))
          .max(
            256,
            t("Please enter no more than {{count}} characters.", {
              count: 256,
            })
          ),
        phoneNumber: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Phone number") }))
          .trim(t("{{name}} must not be blank", { name: t("Phone number") }))
          .matches(/(^[0-9\-\+]{1})+([0-9]{9,12})$/g, t("You must enter a valid phone number.")),
        addresses: yup.array().of(
          yup.object().shape({
            address: yup
              .string()
              .nullable()
              .required(t("{{name}} must not be blank", { name: t("House number, road name") }))
              .trim(t("{{name}} must not be blank", { name: t("House number, road name") }))
              .min(5, t("{{name}} must be more than 5 characters.", { name: t("House number, road name") }))
              .max(
                200,
                t("Please enter no more than {{count}} characters.", {
                  count: 200,
                })
              ),
            stateId: yup.lazy((value) =>
              _.isString(value)
                ? yup
                    .string()
                    .required(t("{{name}} must not be blank", { name: t("Province/City") }))
                    .trim(t("{{name}} must not be blank", { name: t("Province/City") }))
                : yup
                    .number()
                    .nullable()
                    .required(t("{{name}} must not be blank", { name: t("Province/City") }))
            ),
            phoneNumber: yup
              .string()
              .nullable()
              .required(t("{{name}} must not be blank", { name: t("Phone number") }))
              .trim(t("{{name}} must not be blank", { name: t("Phone number") }))
              .matches(REGEX_PHONE, t("You must enter a valid phone number.")),
          })
        ),
        companySizeId: yup.lazy((value) =>
          _.isString(value)
            ? yup
                .string()
                .required(t("{{name}} must not be blank", { name: t("Company size") }))
                .trim(t("{{name}} must not be blank", { name: t("Company size") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Company size") }))
        ),
        businessAreaId: yup.lazy((value) =>
          _.isString(value)
            ? yup
                .string()
                .required(t("{{name}} must not be blank", { name: t("Business area") }))
                .trim(t("{{name}} must not be blank", { name: t("Business area") }))
            : yup
                .number()
                .nullable()
                .required(t("{{name}} must not be blank", { name: t("Business area") }))
        ),
        industryIds: yup
          .array()
          .nullable()
          .required(t("{{name}} must not be blank", { name: t("Industry") }))
          .min(1, t("{{name}} must not be blank", { name: t("Industry") })),
        description: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Description") }))
          .trim(t("{{name}} must not be blank", { name: t("Description") })),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
  } = methodForm;

  const addressesField = useFieldArray({
    control,
    name: "addresses",
  });

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

  const handleUpload = async (file: any) => {
    const isValid = validation(file);
    if (!isValid) {
      return null;
    }
    const res = await UploadService.upload(file, fileType.thumbnailContent);
    if (res?.data?.success && res?.data?.data?.url) {
      return res.data.data.url;
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
    return null;
  };

  const handleClickSubmit = () => {
    handleSubmit(async (data) => {
      setLoading(true);
      delete data.logoModel;
      delete data.bannerModel;
      const res = await RecruitmentService.companySave({
        ...data,
        industryIds: data.industryIds?.map((e) => +e),
        taxCode: isNil(data.parentId) ? data.taxCode : null,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        router.push("/company/management");
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
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
              href: `/company/management`,
              title: t("List company"),
            },
            {
              title: isUpdate ? t("Update company") : t("Create company"),
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
                    label={t("Name")}
                  />
                )}
              />
              <div className="grid gap-5 lg:grid-cols-2">
                <Controller
                  name="shortName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Short name")}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Email")}
                    />
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Phone number")}
                    />
                  )}
                />
                <Controller
                  name="logoModel"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      {...field}
                      error={errors.logo?.message as string}
                      onChange={(file) => {
                        field.onChange(file);
                        if (file) {
                          handleUpload(file).then((fileUrl: any) => {
                            setValue("logo", fileUrl, {
                              shouldValidate: true,
                            });
                          });
                        } else {
                          setValue("logo", null, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      clearable
                      accept="image/png,image/bmp,image/gif,image/jpeg"
                      withAsterisk
                      label={t("Logo")}
                    />
                  )}
                />
                <Controller
                  name="bannerModel"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      {...field}
                      error={errors.banner?.message as string}
                      onChange={(file) => {
                        field.onChange(file);
                        if (file) {
                          handleUpload(file).then((fileUrl: any) => {
                            setValue("banner", fileUrl, {
                              shouldValidate: true,
                            });
                          });
                        } else {
                          setValue("banner", null, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      clearable
                      accept="image/png,image/bmp,image/gif,image/jpeg"
                      label={t("Banner") + " (1920*400)"}
                    />
                  )}
                />
                <Controller
                  name="businessAreaId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={businessAreaOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Business area")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="companySizeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={companySizeOptions}
                      allowDeselect={false}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => field.onChange(+value)}
                      error={errors[field.name]?.message as string}
                      label={t("Company size")}
                      withAsterisk
                    />
                  )}
                />
                <Controller
                  name="industryIds"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      {...field}
                      data={industryOptions || []}
                      withAsterisk
                      error={errors[field.name]?.message as string}
                      label={t("Industry")}
                      maxSelectedValues={3}
                    />
                  )}
                />
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={parentCompanyOptions}
                      value={isNil(field.value) ? null : field.value.toString()}
                      onChange={(value) => {
                        field.onChange(value ? +value : null);
                        if (value) {
                          setValue("taxCode", "");
                        }
                        trigger("taxCode");
                      }}
                      error={errors[field.name]?.message as string}
                      label={t("Parent company")}
                      searchable
                      clearable
                    />
                  )}
                />
                <Controller
                  name="taxCode"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      withAsterisk={isNil(watch("parentId"))}
                      disabled={!isNil(watch("parentId"))}
                      error={errors[field.name]?.message as string}
                      autoComplete="off"
                      label={t("Tax code")}
                    />
                  )}
                />
              </div>
              <div>
                <label className="text-sm">
                  {t("Description")} <span className="text-[#fa5252]">*</span>
                </label>
                <RichEditor
                  value={watch("description")}
                  onChange={(value) =>
                    setValue("description", value, {
                      shouldValidate: true,
                    })
                  }
                />
                <Text color="red" size="xs">
                  {(errors as any)?.description?.message}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Workplace")}</div>
            <div className="flex flex-col gap-2">
              {addressesField.fields?.map((item, index) => (
                <div key={item.id} className="bg-[#F6F6F6]">
                  <div className="text-sm font-semibold flex items-center justify-between border-b px-5 py-3">
                    <div>
                      {t("Address")} {index + 1}
                    </div>
                    {addressesField.fields.length > 1 && (
                      <ActionIcon color="indigo" size="sm" onClick={() => addressesField.remove(index)}>
                        <Trash />
                      </ActionIcon>
                    )}
                  </div>
                  <div className="px-5 pt-2 pb-5 grid lg:grid-cols-3 gap-5">
                    <Controller
                      name={`addresses.${index}.stateId`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          searchable
                          clearable
                          withAsterisk
                          data={stateVNOptions}
                          allowDeselect={false}
                          error={errors.addresses?.[index]?.stateId?.message}
                          value={isNil(field.value) ? null : field.value.toString()}
                          onChange={(value) => field.onChange(+value)}
                          label={t("Province/City")}
                        />
                      )}
                    />
                    <Controller
                      name={`addresses.${index}.address`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          withAsterisk
                          autoComplete="off"
                          error={errors.addresses?.[index]?.address?.message}
                          label={t("House number, road name")}
                        />
                      )}
                    />
                    <Controller
                      name={`addresses.${index}.phoneNumber`}
                      control={control}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          withAsterisk
                          autoComplete="off"
                          error={errors.addresses?.[index]?.phoneNumber?.message}
                          label={t("Phone number")}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 my-2 px-4">
              <Button
                onClick={() => {
                  if (addressesField.fields.length >= 10) {
                    Notify.error(t("maximum 10 locations"));
                    return;
                  }
                  addressesField.append({ countryId: 0, address: "" });
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

          <div className="bg-white rounded-md shadow-md">
            <div className="px-5 py-3 border-b font-semibold">{t("Socials")}</div>
            <div className="px-5 pt-2 pb-5 grid gap-5 lg:grid-cols-2">
              <Controller
                name="facebook"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Facebook")}
                  />
                )}
              />
              <Controller
                name="linkedIn"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("LinkedIn")}
                  />
                )}
              />
              <Controller
                name="twitter"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Twitter")}
                  />
                )}
              />
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    label={t("Website")}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-5">
            <Button size="md" variant="outline" onClick={() => router.push("/company/management")}>
              {t("Cancel")}
            </Button>
            <Button
              size="md"
              disabled={isUpdate && data && !data.canEdit}
              loading={loading}
              onClick={handleClickSubmit}
            >
              {t("Save")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormCompany;
