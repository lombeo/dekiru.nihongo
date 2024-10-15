import { Breadcrumbs } from "@edn/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Space, Text } from "@mantine/core";
import UserRole from "@src/constants/roles";
import { useProfileContext } from "@src/context/Can";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import { useActionPage } from "@src/hooks/useActionPage";
import CmsService from "@src/services/CmsService/CmsService";
import CodingService from "@src/services/Coding/CodingService";
import { Form, FormActionButton, Notify, confirmAction, getLevelId } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { ActivityCodeTypeEnum } from "constants/cms/activity-code/activity-code.constant";
import { ActivityTypeEnum, redirectRunTestToLMS } from "constants/cms/activity/activity.constant";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { OOPActivitySchema } from "validations/cms/oopActivity.schemal";
import { handleMultipleLangActivity } from "../../activities/form/ActivityForm";
import { ListTestCase } from "../components/ListTestCase";
import { ActivityCodeBaseInput } from "./ActivityCodeBaseInput";
const activityCodeSubType = ActivityCodeTypeEnum.OOP;

export const OOPForm = (props: any) => {
  const { profile } = useProfileContext();

  const actionRouter = useActionPage();
  const { data, actionType, fetch } = props;

  const sectionId = actionRouter.get("sectionId") ?? null;
  const courseId = actionRouter.get("courseId") ?? null;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.activity?.ownerId === profile?.userId || isManagerContent || actionType !== "edit";

  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>({});
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(OOPActivitySchema),
    defaultValues: {
      ...data,
      language: keyLocale,
      activityCodeSubType,
      activityUsers: [],
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      ...data,
      activityCodeSubType,
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
          setValue("programingLanguages", data["listProgramingLanguage"][0].id);
        }
      });
  };

  const onClickSave = (rs: any) => {
    setIsDisabledSubmit(true);
    const { activityId } = data;
    const { importedLibs, globalVariables, commonMethods } = rs.oopActivity;
    //Limit 30
    if (rs?.limitNumberSubmission > 30) {
      rs.limitNumberSubmission = 30;
    }
    let fdata = new FormData();

    const requestData = {
      ...rs,
      ...handleMultipleLangActivity(rs),
      activity: {
        ...rs.activity,
        levelId: getLevelId(rs.level),
      },
      levelId: getLevelId(rs.level),
      activityId,
      importedLibs,
      sectionId: parseInt(sectionId),
      courseId: parseInt(courseId),
      globalVariables,
      commonMethods,
      programingLanguages: [rs.programingLanguages],
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
          fetch();
        })
        .catch((ex: any) => {
          //Notify.error('Update activity error!')
          setIsDisabledSubmit(false);
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
          //Notify.error('Update activity error!')
          setIsDisabledSubmit(false);
          console.log("Exception", ex);
        });
    }
  };
  const onAddNewTestCase = () => {
    const newList = [...(watch("listTestCase") || []), {}];
    setValue("listTestCase", newList);
  };

  const removeTestCaseItem = (index: number) => {
    let onConfirm = () => {
      let newList = [...watch("listTestCase")];
      newList.splice(index, 1);
      setValue("listTestCase", newList);
      reset({ ...getValues(), listTestCase: newList });
    };
    confirmAction({
      message: t("Are you sure you want to delete") + "?",
      onConfirm,
    });
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
      <Visible
        rules={[
          FunctionBase.ruleOperation(data?.activity?.ownerId == parseInt(profile?.userId), isManagerContent, "or"),
          actionType == "create",
        ]}
        ruleOperation="or"
      >
        <Breadcrumbs
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
        <Space h="sm" />
        <Text className="text-2xl filter">
          {actionType === "create" ? t(LocaleKeys["Create"]) : t(LocaleKeys["Edit"])} OOP
        </Text>
        <Form onSubmit={handleSubmit(onClickSave)}>
          <Grid columns={12}>
            <Grid.Col span={12} md={6}>
              {
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
              }
            </Grid.Col>
            <Grid.Col span={12} md={6}>
              <ListTestCase
                data={watch("listTestCase")}
                register={register}
                onAddNew={onAddNewTestCase}
                codeType={activityCodeSubType}
                errors={errors}
                removeItem={removeTestCaseItem}
                disabled={!editable}
              />
            </Grid.Col>
          </Grid>
          <Grid columns={12}>
            <Grid.Col span={6} md={6}>
              <FormActionButton
                saveDisabled={isDisabledSubmit}
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
      </Visible>
    </>
  );
};
