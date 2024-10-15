import { Breadcrumbs, RichEditor } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { Container } from "@src/components";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { CDN_URL } from "@src/config";
import { processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import { useRouter } from "@src/hooks/useRouter";
import SharingService from "@src/services/Sharing/SharingService";
import DOMPurify from "isomorphic-dompurify";
import { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const HelpForm = (props: any) => {
  const { isUpdate, data, lang } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const [isLoading, setIsLoading] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);

  DOMPurify.addHook("afterSanitizeAttributes", function (node) {
    if ("target" in node) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener");
      let href = node.getAttribute("href");
      if (href && !href.startsWith("http")) {
        href = window.location.origin + href;
        node.setAttribute("href", href);
      }
    }
    if ("src" in node) {
      let href = node.getAttribute("src");
      if (href && !href.startsWith("http") && !href.startsWith("data")) {
        href = CDN_URL + href;
        node.setAttribute("src", href);
      }
    }
  });

  const fetchListParent = async () => {
    const res = await SharingService.helpSearch({ pageIndex: 1, pageSize: 100, isManagerView: true });
    if (res?.data?.success) {
      setParentOptions(
        res?.data?.data?.flatMap((e) => {
          if (e.parentId) return [];
          const dataMultiLang = e?.multiLang?.find((e) => e.languageKey === keyLocale) || data?.multiLang?.[0];
          return {
            label: dataMultiLang?.title || "",
            value: `${e.id}`,
          };
        })
      );
    }
  };

  useEffect(() => {
    fetchListParent();
  }, [keyLocale]);

  let defaultValues: any = {
    title: "",
    description: "",
    priority: 0,
    parentId: null,
    languageKey: "en",
  };

  if (isUpdate) {
    const dataMultiLang = data?.multiLang?.find((e) => e.languageKey === keyLocale) || data?.multiLang?.[0];
    defaultValues = {
      ...defaultValues,
      languageKey: dataMultiLang?.languageKey || "en",
      title: dataMultiLang?.title,
      description: dataMultiLang?.description,
      multiLang: data?.multiLang,
      parentId: data?.parentId,
      priority: data?.priority,
    };
  }

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: defaultValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        title: yup
          .string()
          .required(t("{{name}} must not be blank", { name: t("Title") }))
          .trim(t("{{name}} must not be blank", { name: t("Title") }))
          .max(
            256,
            t("{{name}} must be less than {{count}} characters", {
              count: 256,
              name: t("Title"),
            })
          ),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (formData) => {
      let description = processBreakSpaceComment(formData.description);
      if (isNil(description) || description == "") {
        Notify.error(t("{{name}} must not be blank", { name: t("Description") }));
        return;
      }

      setIsLoading(true);
      const res = await SharingService.helpCreate({
        id: isUpdate ? data?.id : 0,
        priority: formData.priority,
        parentId: formData.parentId || 0,
        updateMultiLang: {
          description,
          title: formData.title,
          languageKey: formData.languageKey,
        },
      });
      setIsLoading(false);
      if (res?.data?.success) {
        Notify.success(isUpdate ? t("Update successfully!") : t("Create successfully!"));
        if (!isUpdate) {
          router.push(`/help/create?id=${res.data.data}`);
        } else {
          fetchDetail();
        }
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const fetchDetail = async () => {
    const res = await SharingService.helpDetail(data?.id);
    if (res?.data?.success) {
      const data = res?.data?.data;
      const dataMultiLang = data?.multiLang?.find((e) => e.languageKey === watch("languageKey"));
      setValue("title", dataMultiLang?.title);
      setValue("description", dataMultiLang?.description);
      setValue("multiLang", data?.multiLang);
    }
  };

  const handleChangeLanguage = (lang: string) => {
    setValue("languageKey", lang);
    const dataMultiLang = data?.multiLang?.find((e) => e.languageKey === lang);
    setValue("title", dataMultiLang?.title || "");
    setValue("description", dataMultiLang?.description || "");
    document.getElementById("top")?.scrollIntoView();
  };

  const listLangNeedCreate = ["en", "vn", "jp"].filter((e) => !watch("multiLang")?.some((e2) => e2.languageKey === e));

  return (
    <div className="mb-20" id="top">
      <HeadSEO
        title={t("Helps management")}
        description={t(
          "The set of answers and information about frequent questions or concerns such as personal information, programming courses, coding contest, etc."
        )}
        ogImage="/codelearn-share.jpeg"
      />
      <Container>
        <Breadcrumbs
          data={
            isUpdate
              ? [
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/help/manager",
                    title: t("Helps management"),
                  },
                  {
                    title: t("Edit"),
                  },
                ]
              : [
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/help/manager",
                    title: t("Helps management"),
                  },
                  {
                    title: t("Create"),
                  },
                ]
          }
        />
        <div className="justify-between flex gap-5 items-center">
          <div className="text-xl font-semibold">
            {isUpdate ? t("Edit") : t("Create")}&nbsp;({t("Language")}:&nbsp;
            <span className="uppercase">{watch("languageKey")})</span>
          </div>
        </div>

        <div className="flex gap-4 flex-col mt-5">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                withAsterisk
                error={errors[field.name]?.message as string}
                autoComplete="off"
                label={t("Title")}
              />
            )}
          />

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
          </div>

          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data={parentOptions?.filter((e) => e.value != data?.id)}
                clearable
                value={isNil(field.value) ? null : field.value.toString()}
                onChange={(value) => field.onChange(isNil(value) ? null : +value)}
                error={errors[field.name]?.message as string}
                label={t("Select parent")}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <NumberInput {...field} error={errors[field.name]?.message as string} label={t("Priority")} />
            )}
          />

          {isUpdate && (
            <>
              {listLangNeedCreate?.length > 0 && (
                <div>
                  <div>{t("List version need create")}</div>
                  <div className="flex gap-1 flex-col">
                    {listLangNeedCreate.map((e) => (
                      <div
                        onClick={() => handleChangeLanguage(e)}
                        key={e}
                        className="w-fit pr-2 hover:underline text-blue-500 cursor-pointer"
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div>{t("List version created")}</div>
                <div className="flex gap-1 flex-col">
                  {watch("multiLang")?.map((e) => (
                    <div
                      onClick={() => handleChangeLanguage(e.languageKey)}
                      key={e.languageKey}
                      className="w-fit pr-2 hover:underline text-blue-500 cursor-pointer"
                    >
                      {e.languageKey}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-5">
          <Group position="right">
            <Button variant="outline" onClick={() => router.push("/help/manager")}>
              {t("Cancel")}
            </Button>
            <Button loading={isLoading} onClick={submit}>
              {isUpdate ? t("Save") : t("Create")}
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
};

export default HelpForm;
