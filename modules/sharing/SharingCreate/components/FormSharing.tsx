import { RichEditor } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FileInput, Image, MultiSelect, Text, Textarea, TextInput } from "@mantine/core";
import { CDN_URL, fileType } from "@src/config";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import SharingService from "@src/services/Sharing/SharingService";
import { UploadService } from "@src/services/UploadService/UploadService";
import yup from "@src/validations/yupGlobal";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormSharingProps {
  blogId?: any;
  isUpdate?: boolean;
}

const FormSharing = (props: FormSharingProps) => {
  const { blogId, isUpdate } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfileContext();
  const { t } = useTranslation();
  const router = useRouter();
  const initialValues = {
    title: "",
    content: "",
    tags: [],
    permalink: "",
  };
  const checkCreate = async () => {
    const res = await SharingService.blogCheckCreateBlog();
    if (res?.data?.success) {
    } else {
      return router.push("/403");
    }
  };
  const fetch = async () => {
    setIsLoading(true);
    const res = await SharingService.getBlogById({
      id: blogId,
      isPreview: true,
    });
    if (res?.data?.success) {
      reset({
        title: res.data.data.title,
        tags: res.data.data.tags,
        content: res.data.data.content,
        description: res.data.data.description,
        permalink: res.data.data.permalink,
        imageUrl: res.data.data.imageUrl,
      });
    } else {
      return router.push("/403");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (isUpdate) {
      fetch();
    }
    checkCreate();
  }, [blogId]);
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
  const schema = yup.object().shape({
    title: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(65, t("Title not allow null and must be less than 65 characters!")),
    permalink: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(40, t("Not allow null and must be less than 40 characters!"))
      .matches(/^[a-zA-Z0-9-]*$/),
    tags: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .min(1, t("Tags should not be empty"))
          .max(10, t("Each tag must be less than 10 characters"))
          .matches(/^[a-zA-Z0-9 ]+$/, t("Tags can only contain letters, numbers, and spaces"))
      )
      .min(1, t("Tags should not be empty"))
      .max(5, t("Tags must be less than 5")),
    description: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(256, t("Not allow null and must be less than 256 characters!")),
    content: yup.string().required(t("Content should not be empty")).trim(t("Content should not be empty")),
  });
  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
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
  const onSubmit = async (data: any) => {
    const res = !isUpdate
      ? await SharingService.createBlog({
          actionBy: profile?.userId,
          title: data.title,
          content: data.content,
          tags: data.tags,
          imageUrl: data.imageUrl,
          description: data.description,
          permalink: data.permalink,
          isDraft: data.isDraft,
        })
      : await SharingService.updateBlog({
          actionBy: profile?.userId,
          id: blogId,
          title: data.title,
          content: data.content,
          description: data.description,
          imageUrl: data.imageUrl,
          tags: data.tags,
          isPublish: false,
          isDraft: data.isDraft,
          permalink: data.permalink,
        });
    if (res.data.success) {
      router.push("/sharing");
    } else {
      Notify.error(t(res.data.message));
    }
  };
  return (
    <>
      <form className="bg-white p-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setValue("permalink", FunctionBase.slugify(event.target.value));
                }}
                label={t("Title")}
                autoComplete="off"
                variant="filled"
                error={errors[field.name]?.message as string}
                withAsterisk
              />
            )}
          />
          <Controller
            name="permalink"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                variant="filled"
                onChange={(event) => {
                  field.onChange(event.target.value);
                }}
                placeholder={t("Permalink accepts only characters a-z; A-Z; 0-9; -")}
                error={errors[field.name]?.message as string}
                withAsterisk
                autoComplete="off"
                label={t("Permalink (Friendly url)")}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                onChange={(event) => {
                  field.onChange(event.target.value);
                }}
                error={errors[field.name]?.message as string}
                minRows={4}
                variant="filled"
                label={t("SharingPage.Summary")}
                withAsterisk
                autoComplete="off"
              />
            )}
          />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                variant="filled"
                searchable
                creatable
                withAsterisk
                clearable
                data={field.value || []}
                error={errors[field.name]?.message as string}
                nothingFound={t("You have not entered a tag or the tag has been added to the list or tag have space")}
                getCreateLabel={(query: any) => `+ ${t("Create")} ${query}`}
                label={t("Tags")}
              />
            )}
          />

          <Controller
            name="imageUrlModel"
            control={control}
            render={({ field }) => (
              <FileInput
                {...field}
                error={errors.imagePoster?.message as string}
                onChange={(file) => {
                  field.onChange(file);
                  if (file) {
                    handleUpload(file).then((fileUrl: any) => {
                      setValue("imageUrl", fileUrl, {
                        shouldValidate: true,
                      });
                    });
                  } else {
                    setValue("imageUrl", null, {
                      shouldValidate: true,
                    });
                  }
                }}
                clearable
                accept="image/png,image/bmp,image/gif,image/jpeg"
                withAsterisk
                label={t("Thumbnail")}
              />
            )}
          />
          <Text className="">
            {t("Your image need to be sized at 460x817 pixels for displaying in the best quality.")}
          </Text>
          <div className="overflow-hidden max-w-full">
            {watch("imageUrl") && (
              <Image
                alt=""
                height="153px"
                width="272px"
                classNames={{ image: "aspect-[1140/240]" }}
                src={(watch("imageUrl") as string).startsWith("http") ? watch("imageUrl") : CDN_URL + watch("imageUrl")}
              />
            )}
          </div>

          <div>
            <label className="text-sm">
              {t("Description")} <span className="text-[#fa5252]">*</span>
            </label>
            <RichEditor
              value={watch("content")}
              onChange={(value) =>
                setValue("content", value, {
                  shouldValidate: true,
                })
              }
            />
            <Text color="red" size="xs">
              {(errors as any)?.posterDescription?.message}
            </Text>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="xs" variant="outline" onClick={() => router.push("/sharing")}>
            {t("Cancel")}
          </Button>
          <Button
            size="xs"
            type="submit"
            onClick={() => {
              setValue("isDraft", true);
            }}
          >
            {t("Save draft")}
          </Button>
          <Button
            size="xs"
            type="submit"
            onClick={() => {
              setValue("isDraft", false);
            }}
          >
            {t("Save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormSharing;
