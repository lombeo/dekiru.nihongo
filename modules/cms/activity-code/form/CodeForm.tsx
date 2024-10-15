import { Breadcrumbs } from "@edn/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Text } from "@mantine/core";
import { ActivityCodeTypeEnum } from "@src/constants/cms/activity-code/activity-code.constant";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { useHasAnyRole } from "@src/helpers/helper";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { useActionPage } from "@src/hooks/useActionPage";
import { ActivityCodeSubTypeEnum } from "@src/packages/codelearn/src/configs";
import CmsService from "@src/services/CmsService/CmsService";
import CodingService from "@src/services/Coding/CodingService";
import { CodeScratchActivitySchema } from "@src/validations/codeScratchActivity.schemal";
import { Form, FormActionButton, Modal, Notify, confirmAction, getLevelId } from "components/cms";
import { ActivityTypeEnum, redirectRunTestToLMS } from "constants/cms/activity/activity.constant";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CodeActivitySchema } from "validations/cms/codeActivity.schemal";
import { handleMultipleLangActivity } from "../../activities/form/ActivityForm";
import { ListTestCase } from "../components/ListTestCase";
import { ModalAddTestCase } from "../components/ModalAddTestCase";
import { ActivityCodeBaseInput } from "./ActivityCodeBaseInput";

export const CodeForm = (props: any) => {
  const { data, fetch, actionType } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const actionRouter = useActionPage();
  const sectionId = actionRouter.get("sectionId") ?? null;
  const courseId = actionRouter.get("courseId") ?? null;
  const subType = useNextQueryParam("type");
  const activityCodeSubType: any = +subType || ActivityCodeTypeEnum.Code;

  const { profile } = useProfileContext();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [testCaseItemEdit, setTestCaseItemEdit] = useState<any>(null);
  const [indexEdit, setIndexEdit] = useState(-1);
  const [isTestCaseEdit, setIsTestCaseEdit] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.activity?.ownerId === profile?.userId || isManagerContent || actionType !== "edit";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      activityCodeSubType === ActivityCodeSubTypeEnum.SCRATCH ? CodeScratchActivitySchema : CodeActivitySchema
    ),
    defaultValues: {
      ...data,
      language: keyLocale,
      activityUsers: [],
      programingLanguages: activityCodeSubType === ActivityCodeSubTypeEnum.SCRATCH ? ["scratch"] : [],
    },
  });

  console.log("e", errors);

  useEffect(() => {
    reset({
      ...getValues(),
      ...data,
      activityUsers: data.activity?.activityUsers?.map((e: any) => _.omit({ ...e, _id: e.id }, "id")),
    });
  }, [data]);

  useEffect(() => {
    fetchSettings();
  }, []);

  //Check change type
  useEffect(() => {
    setIsDisabledSubmit(false);
  }, [actionType]);

  const fetchSettings = () => {
    CmsService.codeGetSettings()
      .then((data) => data["data"])
      .then((data: any) => {
        setSettings(data);
        if (actionType === "create") {
          setValue("maxMemory", data["listMemory"][0].id);
          setValue("outputType", data["listDataType"][0].id);
          setValue("generationCodeType", data["listGenerateCodeType"][0].id);
          setValue("level", data["listLevel"][0].id);
        }
      });
  };

  const onClickSave = (rs: any) => {
    setIsDisabledSubmit(true);
    const { activityId } = data;
    //Limit 30
    if (rs?.limitNumberSubmission > 30) {
      rs.limitNumberSubmission = 30;
    }
    rs.listTestCase = rs.listTestCase.map((item: any) => {
      return { ...item, executeLimitTime: item.executeLimitTime * 1000 };
    });
    const fdata = new FormData();
    const requestData = {
      ...rs,
      ...handleMultipleLangActivity(rs),
      activityCodeSubType,
      activityId,
      activity: {
        ...rs.activity,
        levelId: getLevelId(rs.level),
      },
      levelId: getLevelId(rs.level),
      sectionId: parseInt(sectionId),
      courseId: parseInt(courseId),
    };
    requestData.activityUsers = rs.activityUsers
      ?.filter((e: any) => !e.isDeleted || e._id)
      ?.map((e: any) => ({
        userId: e.userId,
        roles: [1],
        isDeleted: e.isDeleted || false,
        activityId: activityId || 0,
        id: e._id || 0,
      }));

    fdata.append("model", JSON.stringify(requestData));
    if (actionType == "edit") {
      CmsService.putCodeActivity(fdata)
        .then((data) => data["data"])
        .then(() => {
          Notify.success(t("Update activity successfully"));
          setIsDisabledSubmit(false);
          let queryString = `type=${data.activityCodeSubType}`;
          if (courseId && sectionId) {
            queryString += `&courseId=${courseId}&sectionId=${sectionId}`;
          }
          fetch();
        })
        .catch((ex: any) => {
          setIsDisabledSubmit(false);
          //Notify.error('Update activity error!')
          console.log("Exception", ex);
        });
    }
    if (actionType === "create") {
      CmsService.saveCodeActivity(fdata)
        .then((data) => data["data"])
        .then((res: any) => {
          Notify.success(t("Create activity successfully"));
          let queryString = `type=${res.activityCodeSubType}`;
          if (courseId && sectionId) {
            queryString += `&courseId=${courseId}&sectionId=${sectionId}`;
          }
          router.push(`/cms/activity-code/${res.activityType}/edit/${res.activityId}?${queryString}`);
        })
        .catch((ex: any) => {
          setIsDisabledSubmit(false);
          //Notify.error('Update activity error!')
          console.log("Exception", ex);
        });
    }
  };
  const onAddNewTestCase = () => {
    setIsOpenModal(true);
  };

  const removeItemTestCase = (index: any) => {
    let onConfirm = () => {
      let newList = [...watch("listTestCase")];
      newList.splice(index, 1);
      setValue("listTestCase", newList);
    };
    confirmAction({
      message: t("Are you sure you want to delete") + "?",
      onConfirm,
    });
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setIsTestCaseEdit(false);
  };

  useEffect(() => {
    !isTestCaseEdit ? setTestCaseItemEdit(null) : "";
  }, [isTestCaseEdit]);

  const onSaveTestCase = (value: any) => {
    value.input = value.input.map((item: any) => item.content).join(";#");
    var newList = [...(watch("listTestCase") || [])];
    if (isTestCaseEdit) newList[indexEdit] = value;
    else newList = [...(watch("listTestCase") || []), value];
    setValue("listTestCase", newList);
    setIsOpenModal(false);
    setIsTestCaseEdit(false);
  };

  const onEditTestCase = (index: number) => {
    setIndexEdit(index);
    setIsTestCaseEdit(true);
    const list = [...watch("listTestCase")];
    setIsOpenModal(true);
    var itemFormat = { ...list[index] };
    itemFormat.input = itemFormat.input.split(";#").map((item: any) => {
      return { content: item };
    });
    setTestCaseItemEdit(itemFormat);
  };

  useEffect(() => {
    renderTestCase();
  }, [watch("listInputs")]);

  const { listDataType } = settings || [];
  const renderTestCase = () => {
    const listTestCase = [...watch("listTestCase")];
    const listInput = [...watch("listInputs")];
    const newTestCase = listTestCase.map((tc: any) => {
      let inputs = tc.input ? tc.input.split(";#") : [];
      if (inputs) {
        for (let i = 0; i < listInput.length; i++) {
          inputs[i] =
            inputs[i] ||
            (listDataType && listDataType.find((x: any) => listInput[i].dataType == x.id)?.["defaultValue"]);
        }
        inputs = inputs.slice(0, listInput.length);
      }

      return {
        ...tc,
        input: inputs.join(";#"),
      };
    });
    setValue("listTestCase", newTestCase);
  };

  const onClose = () => {
    if (courseId && sectionId) {
      router.push(`/cms/course/${courseId}`);
    } else {
      router.push(`/cms/activities?activityType=${ActivityTypeEnum.Code}`);
    }
  };

  const runTestId: any = router ? router?.query?.slug : [];

  return (
    <>
      <Breadcrumbs
        className="items-baseline"
        data={[
          {
            href: "/cms/activities",
            title: t("Activity management"),
          },
          {
            href: `/cms/activities?activityType=${ActivityTypeEnum.Code}`,
            title: t("Code"),
          },
        ]}
      />
      <Text className="text-2xl filter mt-3 mb-1">
        {actionType === "create" ? t("Create") : t("Edit")}{" "}
        {activityCodeSubType === ActivityCodeSubTypeEnum.CODE ? t("Programming".toLowerCase()) : t("Scratch")}
      </Text>
      <Form onSubmit={handleSubmit(onClickSave)}>
        <Grid columns={12}>
          <Grid.Col span={12} md={6}>
            <ActivityCodeBaseInput
              settings={settings}
              register={register}
              control={control}
              errors={errors}
              subType={activityCodeSubType}
              watch={watch}
              setValue={setValue}
              actionType={actionType}
              disabled={!editable}
            />
          </Grid.Col>
          <Grid.Col span={12} md={6}>
            <ListTestCase
              data={watch("listTestCase")}
              register={register}
              onAddNew={onAddNewTestCase}
              codeType={activityCodeSubType}
              errors={errors}
              removeItem={removeItemTestCase}
              onEditTestCase={onEditTestCase}
              disabled={!editable}
            />
          </Grid.Col>
        </Grid>
        <Grid columns={12}>
          <Grid.Col span={6} md={6}>
            <FormActionButton
              saveDisabled={isDisabledSubmit}
              disabled={!editable}
              onDiscard={onClose}
              enableRuntest={actionType == "edit" ?? false}
              externalHref={redirectRunTestToLMS + "/" + runTestId[1]}
              enableRelease={actionType == "edit" ?? false}
              onRelease={() => {
                confirmAction({
                  message: t("Are you sure you want to release?"),
                  onConfirm: async () => {
                    const res = await CodingService.release({
                      cmsActivityId: data?.activity?.id,
                      activityGroup: 2,
                    });
                    if (res?.data?.success) {
                      Notify.success(t("Release successfully!"));
                    } else if (res?.data?.message) {
                      Notify.error(t(res.data.message));
                    }
                  },
                });
              }}
            />
          </Grid.Col>
        </Grid>
      </Form>
      <Modal size="lg" title={t("Test case")} opened={isOpenModal} onClose={onCloseModal}>
        <ModalAddTestCase
          data={testCaseItemEdit}
          outputType={watch("outputType")}
          onSave={onSaveTestCase}
          listDataType={listDataType}
          listInput={watch("listInputs")}
        />
      </Modal>
    </>
  );
};
