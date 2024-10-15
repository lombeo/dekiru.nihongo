import UserRole from "@src/constants/roles";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage, useHasAnyRole } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import { selectProfile } from "@src/store/slices/authSlice";
import { ActivityCodeTypeEnum } from "constants/cms/activity-code/activity-code.constant";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TypeCodeActivityPopup } from "./components/TypeCodeActivityPopup";
import { CodeForm } from "./form/CodeForm";
import { OOPForm } from "./form/OOPForm";
import { SQLForm } from "./form/SQLForm";

interface ActivityCodeProps {
  type: ActivityTypeEnum;
  activityId: number;
  activityType: number;
  activityCodeSubType: number;
  generationCodeType: string;
  codeSample: string;
  functionName: string;
  verifyCode: string;
  point: number;
  limitNumberSubmission: number;
  limitCodeCharacter: number;
  level: string;
  maxMemory: number;
  outputType: string;
  programingLanguages: Array<Object>;
  listCodeTemplates: Array<Object>;
  listInputs: Array<Object>;
  activity: any;
  listTestCase: Array<Object>;
  oopActivity: Object;
  title: string;
  summary: string;
  tags: Array<Object>;
  description: string;
  duration: number;
  extenalCompilerURL: string;
}

const dataDefault: ActivityCodeProps = {
  type: ActivityTypeEnum.Code,
  activityId: 0,
  activityType: 0,
  activityCodeSubType: 0,
  generationCodeType: "",
  codeSample: "",
  functionName: "",
  verifyCode: "",
  point: 100,
  limitNumberSubmission: 10,
  limitCodeCharacter: 3000,
  level: "",
  maxMemory: 0,
  outputType: "",
  programingLanguages: [],
  listCodeTemplates: [],
  listInputs: [],
  activity: {},
  listTestCase: [],
  oopActivity: {},
  title: "",
  summary: "",
  tags: [],
  description: "",
  duration: 5,
  extenalCompilerURL: "",
};

export const ActivityCode = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";
  const slug: any = router.query.slug;
  const type: any = FunctionBase.getParameterByName("type");
  const actionType = slug ? slug[0] : null;

  const profile = useSelector(selectProfile);

  const [data, setData] = useState<ActivityCodeProps>(dataDefault);
  const [isShowPopup, setIsShowPopup] = useState(false);

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);
  const editable = data?.activity?.ownerId === profile?.userId || isManagerContent;

  useEffect(() => {
    CmsService.checkCreateActivityPermission();
  }, []);

  useEffect(() => {
    const typeCode = FunctionBase.getParameterByName("type");
    if (typeCode == null) {
      setIsShowPopup(true);
    } else {
      setIsShowPopup(false);
    }
  }, [type]);

  useEffect(() => {
    if (actionType === "edit") {
      fetch();
    }
  }, [actionType]);

  const fetch = () => {
    const id = slug[1];
    CmsService.getById(id)
      .then((data) => data?.data)
      .then((data) => {
        if (data?.activity) {
          const { tags, duration, multiLangData } = data.activity;
          setData({
            ...data,
            multiLangData: multiLangData,
            language: keyLocale,
            title: resolveLanguage(data.activity, locale)?.title,
            description: resolveLanguage(data.activity, locale)?.description,
            summary: resolveLanguage(data.activity, locale)?.summary,
            duration,
            tags,
            listTestCase: data?.listTestCase?.map((item: any) => {
              return {
                ...item,
                executeLimitTime: item.executeLimitTime / 1000,
              };
            }),
            programingLanguages:
              data?.activityCodeSubType == ActivityCodeTypeEnum.OOP
                ? data?.programingLanguages[0]
                : data?.programingLanguages,
            extenalCompilerURL: data?.extenalCompilerURL ?? "",
          });
        }
      });
  };

  const ActivitySwitch = () => {
    switch (parseInt(type)) {
      case ActivityCodeTypeEnum.SQL:
        return <SQLForm fetch={fetch} data={data} actionType={actionType} />;
      case ActivityCodeTypeEnum.OOP:
        return <OOPForm fetch={fetch} data={data} actionType={actionType} />;
      default:
        return <CodeForm fetch={fetch} data={data} actionType={actionType} />;
    }
  };

  return (
    <>
      {ActivitySwitch()}
      <TypeCodeActivityPopup isOpen={isShowPopup} />
    </>
  );
};
