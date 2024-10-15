import { Button, Group } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Select } from "@mantine/core";
import { processBreakSpaceComment } from "@src/helpers/fuction-base.helpers";
import styles from "@src/modules/mentor/MentorIndex/components/ModalRegisterMentor/ModalRegisterMentor.module.scss";
import { FriendService } from "@src/services/FriendService/FriendService";
import SharingService from "@src/services/Sharing/SharingService";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "isomorphic-dompurify";
import { debounce, isNil, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const ModalAddBlogger = (props: any) => {
  const { t } = useTranslation();
  const { onClose, onSuccess } = props;

  const initialValues: any = {
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object().shape({
        userId: yup.number().required(t("{{name}} must not be blank", { name: t("User") })),
      })
    ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methodForm;

  const submit = () => {
    handleSubmit(async (data) => {
      let description = processBreakSpaceComment(data.description);
      description = DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ["p", "strong", "b", "em", "span", "div", "img", "a"],
        ALLOWED_ATTR: ["style"],
      });
      if (isNil(description) || description == "") {
        Notify.error(t("{{name}} must not be blank", { name: t("Further description") }));
        return;
      }
      if (description.length > 10000) {
        Notify.error(t(`Description exceeds allowed length` + `: ${description.length}/10000`));
        return;
      }

      setLoading(true);
      const res = await SharingService.blogAddBlogger({
        userId: data.userId,
        description: data.description,
      });
      setLoading(false);
      if (res?.data?.success) {
        Notify.success(t("Save successfully!"));
        onSuccess?.();
        onClose();
      } else if (res?.data?.message) {
        Notify.error(t(res.data.message));
      }
    })();
  };

  const handleSearchUsers = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      FriendService.searchUser({
        filter: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((user) => ({
            label: user.userName,
            value: user.userId,
          }));
          setUserOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  return (
    <Modal
      classNames={{ title: "font-semibold text-lg" }}
      size="lg"
      centered
      onClose={onClose}
      opened
      title={t("Information")}
    >
      <div className="flex gap-4 flex-col">
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Select
              nothingFound={t("No result found")}
              data={userOptions}
              clearable
              searchable
              withAsterisk
              classNames={{
                label: "font-semibold",
              }}
              error={errors?.[field.name]?.message as any}
              onSearchChange={handleSearchUsers}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              label={t("User")}
            />
          )}
        />

        <div>
          <div className="text-sm font-semibold">
            {t("Further description")}&nbsp;<span className="text-[#fa5252]">*</span>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className={styles["editor"]}>
                <Editor
                  value={field.value}
                  onEditorChange={(e) => {
                    field.onChange(e);
                  }}
                  init={{
                    indent: false,
                    branding: false,
                    menubar: false,
                    // toolbar: false,
                    file_browser_callback: false,
                    quickbars_selection_toolbar: false,
                    quickbars_insert_toolbar: false,
                    statusbar: false,
                    convert_urls: false,
                    placeholder: "",
                    content_css: "/editor.css",
                  }}
                  tinymceScriptSrc={"https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.0/tinymce.min.js"}
                />
              </div>
            )}
          />
        </div>
      </div>
      <Group position="right" mt="lg">
        <Button onClick={() => onClose()} variant="outline">
          {t("Close")}
        </Button>
        <Button loading={loading} onClick={submit}>
          {t("Save")}
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalAddBlogger;
