import { Visible } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import { yupResolver } from "@hookform/resolvers/yup";
import { Collapse, Textarea } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { MoveDirection } from "@src/constants/cms/course/course.constant";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import ActionMenu from "@src/modules/cms/courses/components/ActionMenu";
import { ActivitySectionFormSchema } from "@src/validations/cms/activity.schemal";
import { NotificationLevel } from "constants/common.constant";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { confirmAction } from ".";
import { Button, ValidationNotification } from "../../core";

export type ParentType = "schedule" | "section" | "activity" | "session" | "";

export type FeatureItemProps = {
  editable?: boolean;
  defaultOpen?: boolean;
  defaultEditing?: boolean;
  label?: string;
  id?: number;
  title?: string;
  index?: number;
  onAddOrUpdate?: any;
  onRemove?: any;
  children?: any;
  checkExisted?: any;
  type?: ParentType;
  onMove?: any;
};

export const FeatureItem = (props: FeatureItemProps) => {
  const { t } = useTranslation();
  const {
    label = t("Section"),
    children,
    index,
    id,
    title,
    onAddOrUpdate,
    onRemove,
    defaultOpen = true,
    editable,
    defaultEditing = false,
    //checkExisted,
    type,
    onMove,
  } = props;
  const [editting, setEditing] = useState(defaultEditing);
  const [opened, setOpen] = useState(defaultOpen);

  const { hovered, ref } = useHover();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ActivitySectionFormSchema),
    defaultValues: {
      id: id,
      title: title,
    },
  });

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);
  const onEdit = () => {
    onNormalizeSpace();
    setEditing(true);
  };

  const onCancel = () => {
    reset();
    setEditing(false);
  };

  const onNormalizeSpace = () => {
    const request: any = getValues();
    const requestTitle = FunctionBase.normalizeSpace(request?.title);
    reset({
      ...request,
      title: requestTitle,
    });
  };

  const onOk = (values: any) => {
    // const isExisted = checkExisted(values.title, index, values?.id);
    // if (!isExisted) {
    if (!values.title) {
      setValue("title", "Loading...");
    }
    const requestTitle = FunctionBase.normalizeSpace(values.title);
    onAddOrUpdate && onAddOrUpdate(id, requestTitle);
    setEditing(false);
    // } else {
    // Notify.error(`Course ${label?.toLowerCase()} cannot duplicate`);
    // }
  };

  const onDelete = () => {
    const onConfirm = () => {
      onRemove && onRemove(index);
      setEditing(false);
    };

    confirmAction({
      message: t("Are you sure to delete this item?"),
      onConfirm,
    });
  };

  const collapse = () => {
    setOpen(!opened);
  };

  return (
    <div className={`border  rounded overflow-hidden mb-5`}>
      <div className={`flex gap-2 items-start p-2 bg-smoke`} ref={ref}>
        <Visible visible={editting}>
          <form onSubmit={handleSubmit(onOk)} className="flex gap-2 items-start flex-grow cursor-pointer" noValidate>
            <div className="flex-grow" onClick={collapse}>
              <Textarea
                placeholder={t("D_ENTER_SPECIFIC", {
                  name: t(`${label?.toLowerCase()}`),
                })}
                classNames={{
                  input: "font-semibold",
                }}
                autoFocus={true}
                // defaultValue={title}
                className="flex-grow"
                {...register("title")}
              />
              <ValidationNotification message={t(errors?.title?.message ?? "")} type={NotificationLevel.ERROR} />
            </div>
            <Button preset="primary" size="sm" isSquare={true} type="submit">
              <Icon name="checkmark" />
            </Button>
            {id != undefined && (
              <Button preset="secondary" title={t("Cancel")} size="sm" color="red" onClick={onCancel} isSquare={true}>
                <Icon name="dismiss" />
              </Button>
            )}
            <Button preset="primary" title={t("Delete")} color="red" size="sm" isSquare={true} onClick={onDelete}>
              <Icon name="delete" />
            </Button>
          </form>
        </Visible>
        <Visible visible={!editting}>
          <>
            <div
              className="font-semibold py-1.5 px-2 cursor-pointer flex items-start gap-2"
              style={{ width: "calc(100% - 4rem)" }}
              onClick={collapse}
            >
              <div onClick={collapse}>
                <Icon size="sm" className="px-1 w-6 pt-1" name={opened ? "chevron_up" : "chevron_down"} />
              </div>

              <label style={{ width: "calc(100% - 1.5rem)" }} className="cursor-pointer">
                {/* {label +
                  " " +
                  (index ? index + 1 : 1) +
                  ": "} */}
                <span className="whitespace-pre-line">
                  <span
                    style={{
                      maxWidth: "calc(100% - 40px)",
                      wordBreak: "break-word",
                    }}
                  >
                    {title}
                  </span>
                </span>
              </label>
            </div>

            <div className="pl-4">
              <ActionMenu
                isVisible={hovered && editable}
                onEdit={onEdit}
                onDelete={onDelete}
                type={type}
                onMoveUp={() => onMove(MoveDirection.UP)}
                onMoveDown={() => onMove(MoveDirection.DOWN)}
              />
            </div>
          </>
        </Visible>
      </div>

      <Collapse in={opened}>{opened && <>{children}</>}</Collapse>
    </div>
  );
};
