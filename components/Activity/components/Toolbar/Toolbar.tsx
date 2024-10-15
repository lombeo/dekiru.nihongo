import { Select, Tooltip } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, Flex, Overlay } from "@mantine/core";
import { useActivityContext } from "@src/components/Activity/context";
import ArrowCorner from "@src/components/Svgr/components/ArrowCorner";
import InFull from "@src/components/Svgr/components/InFull";
import { selectProfile } from "@src/store/slices/authSlice";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Edit, Refresh } from "tabler-icons-react";
import classes from "./TabCodeControl.module.scss";
import { convertDate } from "@src/helpers/fuction-base.helpers";
import moment from "moment";
import { ActivityContextType } from "@src/services/Coding/types";
import clsx from "clsx";
import { LiveVideo } from "@src/components/Svgr/components";
import Image from "next/image";

const Toolbar = (props: any) => {
  const {
    onReset,
    onToggleFullEditor,
    supportedLanguages,
    setLanguage,
    currentLanguage,
    tabCodes,
    onChangeTabCode,
    onRemoveTabCode,
    addNewTab,
    onUpdateTabName,
    isOop,
    loading,
    onSubmit,
    notShowEdit,
  } = props;
  const profile = useSelector(selectProfile);
  const {
    fullSize,
    isAdminContext,
    diffTime,
    contextData,
    activityDetails,
    codeActivity,
    remainRetry,
    isRunCodeSuccess,
    contextDetail,
    isNotStart,
    contextType,
    data,
    token,
    hideSubmit,
  } = useActivityContext();

  const limitNumberSubmission = codeActivity?.limitNumberSubmission;

  let isHiddenSubmit = contextDetail == null ? true : Object.keys(contextDetail).length == 0;

  if (contextType === ActivityContextType.Evaluating) {
    isHiddenSubmit = hideSubmit;
  } else {
    isHiddenSubmit =
      contextType === ActivityContextType.Warehouse ||
      ((!(remainRetry > 0 || activityDetails?.limitNumberSubmission == 0) || (!isHiddenSubmit && remainRetry == 0)) &&
        limitNumberSubmission != 0 &&
        !isAdminContext &&
        contextType !== ActivityContextType.Challenge);
  }

  const now = moment().subtract(diffTime);

  const isInTimeContest =
    !!contextData &&
    now.isSameOrAfter(convertDate(contextData.startDate)) &&
    now.isBefore(convertDate(contextData.endTimeCode)) &&
    !isNotStart;

  let disabledRunTest = !isAdminContext && !isInTimeContest;

  if (contextType === ActivityContextType.Training) {
    disabledRunTest = false;
  } else if (contextType === ActivityContextType.Challenge) {
    disabledRunTest = !isAdminContext && !data?.allowSubmit;
  } else if (contextType === ActivityContextType.Evaluating) {
    disabledRunTest = false;
  }

  const { t } = useTranslation();
  const removeTabCode = (idx: number) => {
    const onConfirm = () => {
      onRemoveTabCode(idx);
    };
    confirmAction({
      message: "Are you sure you want to remove this tab?",
      onConfirm,
    });
  };

  const TabCodeControlItem = (data: any) => {
    const { item, index, count } = data;
    const isActive = item.isActive;
    const classCss = isActive ? classes["active"] : "text-gray";
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState(item.title);

    const updateTitle = (val: string) => {
      if (val.length > 0 && val !== item.title) {
        onUpdateTabName({ idx: index, name: val });
      } else {
        setTitle(item.title);
      }
      setIsEdit(false);
    };

    //Blur input
    const onBlurInput = (field: any) => {
      const currentVal = field.currentTarget.value.trim();
      updateTitle(currentVal);
    };

    const changeInput = (field: any) => {
      setTitle(field.currentTarget.value);
    };

    const keyPress = (field: any) => {
      if (field.which == 13) {
        const currentVal = field.currentTarget.value.trim();
        updateTitle(currentVal);
      } else if (field.which == 27) {
        updateTitle(item.title);
      }
    };

    return (
      <div
        className={`text-xs item-center px-2 tab-code-control relative transition inline-flex border-r border-r-gray-600 ${
          classes["tab-code-control"]
        } ${classCss} ${isActive ? "bg-gray-700" : ""}`}
      >
        <div
          className={"py-2  cursor-pointer"}
          onClick={() => !isActive && onChangeTabCode(index)}
          onDoubleClick={() => setIsEdit(true)}
        >
          {isEdit && (
            <input
              type="text"
              value={title}
              onChange={(val) => changeInput(val)}
              onBlur={onBlurInput}
              onKeyPress={keyPress}
              autoFocus
              maxLength={64}
            />
          )}
          {!isEdit && (
            <span className={`${isActive ? "font-semibold text-white" : "font-normal text-gray-300"}`}>
              {item.title}
            </span>
          )}
        </div>
        {isActive && (
          <span className="ml-2 inline-flex items-center">
            <Tooltip label={isEdit ? t("Cancel") : t("Rename")}>
              <span
                className="p-1 inline-flex item-center cursor-pointer hover:text-blue"
                onClick={() => setIsEdit(!isEdit)}
              >
                <Icon size={18} name={isEdit ? "close" : "edit"} className="text-white" />
              </span>
            </Tooltip>
            {count > 1 && !isEdit && (
              <Tooltip label={t("Remove")}>
                <span
                  className="p-1 inline-flex item-center cursor-pointer hover:text-red"
                  onClick={() => removeTabCode(index)}
                >
                  <Icon size={18} name="close" className="text-white" />
                </span>
              </Tooltip>
            )}
          </span>
        )}
      </div>
    );
  };

  //Render list control for multi tabcode of Oop
  const TabCodeControl = () => (
    <Flex className="pl-2 mb-2 w-full flex-grow flex-wrap">
      {tabCodes &&
        tabCodes?.map((item: any, index: number) => (
          <TabCodeControlItem key={item.id} index={index} count={tabCodes.length} item={item} />
        ))}
      <Tooltip label={t("Add new")}>
        <span
          className="text-sm h-full item-center cursor-pointer hover:text-blue inline-flex p-2 text-white"
          onClick={addNewTab}
        >
          <Icon name="plus" />
        </span>
      </Tooltip>
    </Flex>
  );

  return (
    <section className={classes.wrapper}>
      {loading && <Overlay opacity={0.6} color="#000" zIndex={5} />}
      <div className={classes.commands}>
        <div className="flex items-center gap-2">
          <ActionIcon
            variant="transparent"
            size="xs"
            onClick={onToggleFullEditor}
            className={"h-[30px] rounded-md w-[30px] text-white bg-[#0E2643]"}
          >
            {fullSize ? <InFull /> : <ArrowCorner height={12} width={12} />}
          </ActionIcon>
          <Select
            size="xs"
            radius={0}
            classNames={{ input: classes.select }}
            onChange={setLanguage}
            value={currentLanguage}
            data={supportedLanguages}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {profile ? (
            <Button
              onClick={() => {
                confirmAction({
                  title: t("CONFIRMATION"),
                  labelConfirm: t("Yes"),
                  message: t("Are you sure you want to reset your code?"),
                  onConfirm: onReset,
                });
              }}
              leftIcon={<Refresh width={16} />}
              size="xs"
              className="text-sm bg-[#0E2643]"
              color="gray"
            >
              {t("Reset")}
            </Button>
          ) : null}
          {profile || contextType === ActivityContextType.Evaluating ? (
            <>
              {isAdminContext &&
                ((notShowEdit ?? false) || (
                  <Button
                    onClick={() => {
                      window.open(
                        `/cms/activity-code/12/edit/${activityDetails?.externalCode}?type=${codeActivity?.activityCodeSubType}`
                      );
                    }}
                    size="xs"
                    className={clsx(classes.button, "bg-navy-primary")}
                  >
                    <Edit width={14} height={14} />
                    {t("Edit task")}
                  </Button>
                ))}
              <div className={isHiddenSubmit ? "hidden" : ""}>
                <Button
                  variant="filled"
                  color="brand"
                  size="xs"
                  title={t("Run Code")}
                  onClick={() => onSubmit()}
                  className={clsx(classes.button, {
                    "opacity-60 cursor-not-allow pointer-events-none": disabledRunTest,
                  })}
                >
                  <LiveVideo width={14} height={14} />
                  {t("Run Code")}
                </Button>
              </div>
              <Button
                variant="filled"
                color="red"
                size="xs"
                onClick={() => onSubmit(true)}
                disabled={!isRunCodeSuccess}
                title={t("Submit")}
                className={clsx(classes.button, "bg-[#F84F39]", {
                  "opacity-60 cursor-not-allow pointer-events-none": !isRunCodeSuccess,
                  hidden: contextType === ActivityContextType.Warehouse || hideSubmit,
                })}
              >
                <Image
                  className={clsx({
                    "invert opacity-30": !isRunCodeSuccess,
                  })}
                  alt="one-finger-tap"
                  src="/images/learning/one-finger-tap.png"
                  width={14}
                  height={14}
                />
                {t("Submit")}
                {remainRetry > 0 && contextType !== ActivityContextType.Challenge ? `(${remainRetry})` : ""}
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {isOop && <TabCodeControl />}
    </section>
  );
};

export default Toolbar;
