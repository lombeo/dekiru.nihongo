/* eslint-disable react/no-unknown-property */
import { Notify } from "@edn/components/Notify/AppNotification";
import { Anchor, Checkbox, Select } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { Form, FormActionButton, confirmAction } from "components/cms";
import RawText from "components/cms/core/RawText/RawText";
import { VIDEO_SUBTITLE_LANGUAGES } from "constants/cms/common.constant";
import { Subtitle } from "modules/cms/models/settings.model";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Editor from "react-simple-code-editor";
//@ts-ignore
import { WebVTTParser } from "webvtt-parser";

const parser = new WebVTTParser();
let languages = VIDEO_SUBTITLE_LANGUAGES;

interface VideoSubtitleFormProps {
  onSave: Function;
  onClose: Function;
  data: Subtitle | null;
  keysDisable: Array<string>;
  tabActiveDefault?: number;
}

/**
 * @param props
 * data: subtitle item data
 * keysDisable: keys value need disable in language select option, example: ["vi"]
 * onClose: Handle close button in form
 * onSave: Handle save button in form
 * @returns Form CRUD subtitle in video activity
 */
const SUBTITLE_TEMPLATE_URL =
  "https://edntestcode.s3.amazonaws.com/files/attachfiles/subtitle_template_b704d2b66d5e4daf8daa3947e2e84097.vtt";

export const VideoSubtitleForm = (props: VideoSubtitleFormProps) => {
  const { t } = useTranslation();
  const { onSave, data, onClose, keysDisable } = props;
  const [isSubtitleContentValid, setSubtitleContentValid] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    clearErrors,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: data?.text ?? "WEBVTT",
      lang: data?.lang ?? "",
      default: data?.default ?? false,
    },
  });

  const onSaveHandle = () => {
    const value = getValues();
    const subtitleIsValid = checkSubtitleContentValidate(value?.text);
    const languageIsValid = checkLanguageValidate(value?.lang);
    if (subtitleIsValid && languageIsValid) {
      const label = languages?.find((x) => x?.value == value?.lang)?.label;
      onSave && onSave({ ...value, label });
    }
  };

  const checkLanguageValidate = (text: any) => {
    if (text.trim().length == 0) {
      setError("lang", {
        type: "required",
        message: t("Language name is required"),
      });
      return false;
    }
    clearErrors("lang");
    return true;
  };
  const checkSubtitleContentValidate = (text: any) => {
    if (text.trim().length == 0) {
      setError("text", {
        type: "required",
        message: t("Subtitle content is required"),
      });
      return false;
    } else if (text.length > 0) {
      const tree = parser.parse(text, "metadata");
      if (tree?.errors && tree?.errors?.length > 0) {
        const errorFormat = tree?.errors.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex((t: any) => t.col === value.col && t.line === value.line && t.message == value.message)
        );
        const data = errorFormat.map((item: any, index: number) => {
          return `<div>${index + 1}. ${item?.line ? t("Line") + " " + item.line : ""} ${
            item?.col ? ", " + t("column") + " " + item?.col : ""
          }:  ${t(item.message)}</div>`;
        });

        setError("text", { type: "custom", message: data.join("") });
        return false;
      } else clearErrors("text");
    }
    return true;
  };

  useEffect(() => {
    languages = languages?.map((item: any) => {
      if (keysDisable?.includes(item?.value)) item.disabled = true;
      else item.disabled = false;
      return item;
    });
  }, [keysDisable]);

  useEffect(() => {
    const check = checkSubtitleContentValidate(watch("text"));
    setSubtitleContentValid(check);
  }, [watch("text")]);

  const showFile = async (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text: any = e?.target?.result || null;
      if (text && text?.length > 0) {
        confirmAction({
          message: t("This action will replace all your before subtitle content. Are you sure to do?"),
          onConfirm: () => {
            setValue("text", text);
            Notify.success(t("Import file content successfully"));
          },
        });
      } else {
        Notify.warning(t("File content is empty."));
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const onLanguageChange = (value: any, onChange: Function) => {
    checkLanguageValidate(value);
    onChange(value);
  };

  const selectFile = () => {
    let input: any = document.getElementById("file-upload");
    input.value = null;
    document.getElementById("file-upload")?.click();
  };

  return (
    <>
      <Form onSubmit={() => {}}>
        <Controller
          name="lang"
          control={control}
          render={({ field }) => {
            return (
              <Select
                {...field}
                label={t("Language")}
                placeholder={t("Choose a language")}
                data={languages}
                onChange={(value) => onLanguageChange(value, field.onChange)}
                value={field.value}
                required
                error={errors.lang?.message}
              />
            );
          }}
        />
        <div style={{ marginBottom: "4px" }} className="flex text-sm ">
          <label className="text-sm font-medium flex-1">
            {t("Subtitle")} <span style={{ color: "#f03e3e" }}>*</span>
          </label>
          <label className="flex">
            <Anchor href="#" size="sm" onClick={selectFile}>
              {t("Select file")}
            </Anchor>
            <input id="file-upload" accept=".vtt,.txt" className="hidden" type="file" onChange={(e) => showFile(e)} />
          </label>
        </div>
        <Controller
          name="text"
          control={control}
          render={({ field }) => {
            return (
              <div className="editor-wrapper">
                <Editor
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                  highlight={(code) =>
                    code
                      .split("\n")
                      .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
                      .join("\n")
                  }
                  padding={10}
                  textareaId="codeArea"
                  className="editor"
                />
              </div>
            );
          }}
        />
        <div style={{ fontSize: "14px" }}>
          {!isSubtitleContentValid && (
            <p style={{ color: "#f03e3e" }}>{errors?.text && RawText({ content: errors.text?.message || "" })}</p>
          )}

          {isSubtitleContentValid && (
            <p className="flex ">
              <AppIcon name="checkmark" className="text-green-500" size="sm" />
              <span style={{ color: "rgb(22 163 74)" }}>{t("Check valid data")}</span>
            </p>
          )}
        </div>

        <div className="notice text-sm text-gray-primary">
          (<span className="text-critical">*</span>) {t("Only Allow")}: {t("Web Video Text Tracks Format (WebVTT)")}
          <div className="mt-1">
            {t("You can download template in") + " "}
            <Anchor href={SUBTITLE_TEMPLATE_URL} target="_blank" size="sm">
              {t("here")}
            </Anchor>
          </div>
        </div>
        <Checkbox hidden {...register("default")} />
        <FormActionButton onDiscard={onClose} onSave={onSaveHandle} />
      </Form>
      <style global jsx>{`
        .editor-wrapper {
          min-height: 200px;
          max-height: 300px;
          overflow: scroll;
          overflow-x: unset;
          border: 1px solid #ced4da;
          border-radius: 4px;
          margin-top: 0 !important;
          font-size: 14px;
        }
        .editor {
          counter-reset: line;
        }

        .editor #codeArea {
          outline: none;
          padding-left: 60px !important;
        }

        .editor pre {
          padding-left: 60px !important;
        }

        .editor .editorLineNumber {
          position: absolute;
          left: 0px;
          color: #cccccc;
          text-align: right;
          width: 40px;
          font-weight: 100;
        }
      `}</style>
    </>
  );
};
