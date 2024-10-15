import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RichEditor } from "@edn/components";
import { Button, Group, MultiSelect, Skeleton, Text, TextInput } from "@mantine/core";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SharingService from "@src/services/Sharing/SharingService";
import { Notify } from "@edn/components/Notify/AppNotification";

interface FormTopicProps {
  topicId?: any;
  isUpdate?: boolean;
}

const FormTopic = (props: FormTopicProps) => {
  const { t } = useTranslation();
  const { topicId, isUpdate } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const initialValues = {
    title: "",
    tags: [],
    content: "",
  };

  const schema = yup.object().shape({
    title: yup
      .string()
      .required(t("This field is invalid."))
      .trim(t("This field is invalid."))
      .max(300, t("Title not allow null and must be less than 301 characters!")),
    tags: yup.array().min(1, t("Tags should not be empty")),
    content: yup.string().required(t("Content should not be empty")).trim(t("Content should not be empty")),
  });

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });
  const fetch = async () => {
    setIsLoading(true);
    const res = await SharingService.getTopicDetail(topicId);
    if (res?.data) {
      reset({
        title: res.data.data.title,
        tags: res.data.data.tags,
        content: res.data.data.content,
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetch();
  }, [topicId]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const onSubmit = async (data) => {
    const res = isUpdate
      ? await SharingService.editTopic({
          id: parseInt(topicId),
          title: data.title,
          content: data.content,
          tags: data.tags,
          isPublic: true,
        })
      : await SharingService.postTopic({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
    if (res?.data?.success) {
      Notify.success(t("Success"));
      router.push("/discussion");
    } else {
      Notify.error(t(res.data.message));
    }
  };
  return (
    <div className="mt-6">
      <div>
        <div>
          <Text size={24} fw={700}>
            Topic
          </Text>
        </div>
        {isLoading ? (
          <div className="mt-8 flex flex-col gap-6">
            <Skeleton className="h-10"></Skeleton>
            <Skeleton className="h-10"></Skeleton>
            <Skeleton className="h-40"></Skeleton>
          </div>
        ) : (
          <form className="pt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={t("Title")}
                  autoComplete="off"
                  variant="filled"
                  error={errors[field.name]?.message as string}
                  withAsterisk
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
                  nothingFound={t("You have not entered a tag or the tag has been added to the list")}
                  getCreateLabel={(query: any) => `+ ${t("Create")} ${query}`}
                  label={t("Tags")}
                />
              )}
            />

            <div className="flex flex-col gap-1">
              <div>
                <Text className="text-[0.875rem]">
                  {t("Content")}
                  <span className="text-[#fa5252] font-medium pl-1">*</span>
                </Text>
              </div>

              <RichEditor
                value={watch("content")}
                onChange={(value) => {
                  setValue("content", value, {
                    shouldValidate: true,
                  });
                }}
              />
              <Text color="red" size="xs">
                {(errors as any)?.content?.message}
              </Text>
            </div>
            <Group className="flex justify-end gap-3">
              <Button
                variant="light"
                onClick={() => (isUpdate ? router.push(`/discussion/topic/${topicId}`) : router.push("/discussion"))}
              >
                {t("Cancel")}
              </Button>
              <Button loading={isLoading} type="submit">
                {t("Post")}
              </Button>
            </Group>
          </form>
        )}
      </div>
    </div>
  );
};

export default FormTopic;
