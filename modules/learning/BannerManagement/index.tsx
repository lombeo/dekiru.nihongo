import { useTranslation } from "next-i18next";
import { LearnService } from "@src/services/LearnService/LearnService";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PickImageModal } from "@src/modules/cms/courses/PickImageModal";
import { useDisclosure } from "@mantine/hooks";
import { Controller, useForm } from "react-hook-form";
import yup from "@src/validations/yupGlobal";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  InputTitle,
  Space,
  TextInput,
  ValidationNotification,
} from "@src/components/cms";
import { AppIcon } from "@src/components/cms/core/Icons";
import { LocaleKeys } from "public/locales/locale";
import { Select, Text } from "@edn/components";
import { NotificationLevel } from "@src/constants/cms/common.constant";
import _ from "lodash";

const BannerManagement: React.FC<{}> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const [isClickButton, setIsClickButton] = useState<any>(undefined);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { data: bannerData, refetch } = useQuery({
    queryKey: ["getBannerList", locale],
    queryFn: () => fetch(),
  });

  const fetch = async () => {
    const res = await LearnService.getLearningBanner();
    if (res?.data?.success) {
      return res.data.data;
    }
    return null;
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object({
        thumbnail: yup
          .string()
          .nullable()
          .required("Course thumbnail cannot be blank!")
          .trim("Course thumbnail cannot be blank!"),
        title: yup
          .string()
          .trim()
          .required("Course title is required")
          .max(64, "Course title must not exceed 64 characters"),
        permalink: yup.string().trim().required("Course permalink is required"),
      })
    ),
    defaultValues: {
      thumbnail: null,
      title: "",
      permalink: "",
      multiLang: [],
      language: keyLocale,
    } as any,
  });

  // const handleCreateBanner = async () => {
  //   const data = [
  //     {
  //       multiLang: [
  //         {
  //           title: "Python cơ bản",
  //           permalink: "python-basic-course",
  //           key: "vn",
  //           description: null,
  //           document: null,
  //           objective: null,
  //           summary: null,
  //           about: null,
  //           image: "https://s3-sgn09.fptcloud.com/duonghh/files/thumbnails/banner_1396d3a0d47d49e2ac441abd5afbfe7c.png",
  //         },
  //         {
  //           title: "Python Basic",
  //           permalink: "python-basic-course",
  //           key: "en",
  //           description: null,
  //           document: null,
  //           objective: null,
  //           summary: null,
  //           about: null,
  //           image:
  //             "https://s3-sgn09.fptcloud.com/duonghh/files/thumbnails/banner-EN_8f7d94e7984d46f3ad96f7b7d72f755f.png",
  //         },
  //       ],
  //       image: "",
  //     },
  //   ];
  //   const res = await LearnService.setLearningBanner(data);
  //   setIsClickButton(res?.data);
  // };

  const handleChangeLang = (value: string) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLang = watch("multiLang") || [];
    const data = {
      key: preLang,
      title: watch("title"),
      permalink: watch("permalink"),
      image: watch("thumbnail"),
      description: null,
      document: null,
      objective: null,
      summary: null,
      about: null,
    };
    multiLang = multiLang.filter((e: any) => e.key !== preLang);
    setValue("multiLang", [...multiLang, data]);
    const dataLang = multiLang.find((e: any) => e.key === value);
    setValue("title", dataLang?.title ?? "");
    setValue("permalink", dataLang?.permalink ?? "");
    setValue("thumbnail", dataLang?.permalink ?? "");
    setValue("language", value);
  };

  const selectThumb = (files: any) => {
    close();
    if (files.length) {
      const thumbnailData = files[0];
      if (thumbnailData?.url) {
        setValue("thumbnail", thumbnailData?.url, {
          shouldValidate: true,
        });
        // onChangeThumbnail(thumbnailData?.url);
      }
    }
  };

  const onSubmit = async (values: any) => {
    let multiLang = values.multiLang || [];

    const currentLang = values.language;
    const langData = {
      key: currentLang,
      title: values.title,
      permalink: values.permalink,
      image: values.thumbnail,
      description: null,
      document: null,
      objective: null,
      summary: null,
      about: null,
    };
    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      title: values.title,
      permalink: values.permalink,
      image: values.thumbnail,
      description: null,
      document: null,
      objective: null,
      summary: null,
      about: null,
    };

    multiLang = [...multiLang.filter((e: any) => e.key !== currentLang), langData];
    if (multiLang.length <= 1) {
      multiLang = [...multiLang, langDataOther];
    }
    multiLang.forEach((e: any) => {
      if (_.isEmpty(e.title)) {
        e.title = values.title;
      }
      if (_.isEmpty(e.permalink)) {
        e.permalink = values.permalink;
      }
      if (_.isEmpty(e.image)) {
        e.image = values.image;
      }
    });
    console.log("multiLang", multiLang)
    const params = [{ multiLang: [...multiLang], image: "" }];
    const res = await LearnService.setLearningBanner(params)
    setIsClickButton(res?.data);
    setIsCreate(false);
  };

  useEffect(() => {
    refetch();
  }, [isClickButton]);

  return (
    <div className="flex flex-col gap-6 items-start">
      {/* <Button onClick={handleCreateBanner}>Update</Button> */}
      <Button onClick={() => setIsCreate(true)}>Create</Button>
      <Button onClick={() => setIsEdit(true)}>Edit</Button>
      <div className="flex flex-col gap-6">
        {isCreate && (
          <div className="flex flex-wrap items-center gap-6">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      data={[
                        { label: "Tiếng Việt", value: "vn" },
                        { label: "English", value: "en" },
                      ]}
                      size="md"
                      label={t("Language")}
                      placeholder={t("Choose a language")}
                      required
                      onChange={handleChangeLang}
                    />
                  )}
                />
                <ValidationNotification message={t(errors.language?.message as any)} type={NotificationLevel.ERROR} />
              </div>
              <label>
                {t("Thumbnail")} <span className="text-red-500">*</span>
              </label>
              <Card shadow="md" padding={0} component="a" target="_blank" className="mt-2 relative cursor-pointer">
                <Card.Section>
                  <div className="relative" onClick={open}>
                    <Image
                      src={watch("thumbnail")}
                      alt={"CodeLearn"}
                      height={228}
                      classNames={{
                        figure: "h-full",
                      }}
                      withPlaceholder
                    />
                    <div className="absolute right-3 top-3 z-auto">
                      <Group>
                        <label htmlFor="contained-button-file">
                          <ActionIcon component="span" variant="filled" id="btnSelectImage">
                            <AppIcon name="camera" />
                          </ActionIcon>
                        </label>
                      </Group>
                    </div>
                  </div>
                </Card.Section>
                <div className="text-xs absolute z-50 bottom-0 bg-black opacity-50 py-1.5 text-white w-full">
                  <span>{t(LocaleKeys["Best banner image sizes 1200 x 280!"])}</span>
                </div>
              </Card>
              <Space h="sm" />
              <InputTitle register={register} errors={errors} />
              <Space h="sm" />
              <Controller
                name="permalink"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={<Text className="font-semibold inline-block">{t("Permalink")}</Text>}
                    autoComplete="off"
                    required
                    withAsterisk
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
              <Space h="sm" />
              <Group position="right">
                {/* <Button size="md" variant="light" onClick={discardFunc}>
                  {t("Discard")}
                </Button> */}
                <Button preset="primary" size="md" type="submit">
                  {t("Save")}
                </Button>
              </Group>
            </form>
            <PickImageModal onOpen={opened} onClose={close} onSelected={selectThumb} />
          </div>
        )}
        {bannerData &&
          !isCreate &&
          bannerData?.map((item, index) => (
            <div key={`banner-${index}`} className="flex flex-wrap items-center gap-6">
              <Image
                src={item?.image}
                alt={item?.title}
                width={600}
                height={140}
                className="rounded-br-md rounded-bl-md object-cover"
              />
              <div className="flex flex-wrap items-center gap-6">
                <span>
                  {t("Banner title")}: {item?.title}
                </span>
                <span>
                  {t("Banner link")}: /{item?.permalink}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BannerManagement;
