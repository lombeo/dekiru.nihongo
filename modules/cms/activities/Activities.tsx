import { Notify } from "@edn/components/Notify/AppNotification";
import { AppTabs, LoadingOverlay, Space, confirmAction } from "@src/components/cms";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import CmsService from "@src/services/CmsService/CmsService";
import {
  ActivityTypeEnum,
  activitySupportType,
  menuItemsPersonalCourse,
} from "constants/cms/activity/activity.constant";
import { useRouter } from "hooks/useRouter";
import _ from "lodash";
import { ActivityList } from "modules/cms/activities/ActivityList";
import { ActivityFilterModel, FilterBar } from "modules/cms/activities/FilterBar";
import { useTranslation } from "next-i18next";
import nextConfig from "next.config";
import { LocaleKeys } from "public/locales/locale";
import PubSub from "pubsub-js";
import { useCallback, useEffect, useState } from "react";
import styles from "./Activities.module.css";

let filter: any = new ActivityFilterModel();
export const Activities = (props: {
  selectable?: boolean;
  onSelectChange?: (item: any, checked: boolean) => void;
  isSelected?: (activityId: any) => boolean;
  isSelectedOld?: (activityId: any) => boolean;
  pickedData?: any;
  isActivitiesListPage?: boolean;
  courseId?: number;
}) => {
  const { t } = useTranslation();
  const {
    selectable,
    onSelectChange,
    isSelected,
    isSelectedOld,
    pickedData,
    isActivitiesListPage = false,
    courseId,
  } = props;

  const router = useRouter();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = useHasAnyRole([
    UserRole.Administrator,
    UserRole.OwnerCourse,
    UserRole.ManagerContent,
    UserRole.SiteOwner,
  ]);

  let supportTypes = isAdmin ? activitySupportType : [ActivityTypeEnum.Quiz, ActivityTypeEnum.Code];

  let menuItemsArray = isAdmin
    ? menuItemsPersonalCourse
    : [
        {
          label: "All activities",
          selected: true,
          icon: "IconAll",
          type: ActivityTypeEnum.All,
          hideInModal: true,
        },
        {
          label: "Code",
          icon: "IconCode",
          type: ActivityTypeEnum.Code,
          name: "code",
        },
        {
          label: "Quiz",
          icon: "IconQuiz",
          type: ActivityTypeEnum.Quiz,
          name: "quiz",
        },
      ];

  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;
  const params = parts ? new URLSearchParams(parts[1]) : new URLSearchParams();

  const type = params.get("activityType") || 0;
  const viewType = params.get("viewType") || 1;
  const menuIndex = menuItemsArray.findIndex((x) => x.type.toString() === type);
  const pageIndex = params.get("pageIndex");
  const text = params.get("filter");
  const languageId = params.get("languageId");

  useEffect(() => {
    return () => {
      filter = {};
    };
  }, [leftPart]);

  const fetchData = useCallback(() => {
    setLoading(true);
    const pickedIds = pickedData
      ? pickedData.map((x: any) => {
          if (x.refId) {
            return x.refId;
          }
          return x.id;
        })
      : [];

    CmsService.getActivities(filter, pickedIds, supportTypes, courseId)
      .then((res: any) => {
        if (res && res?.data) setData(res.data);
        if (res?.data?.items?.length == 0 && res?.data?.pageIndex > 1) {
          refeshPage(res?.data?.pageIndex);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      filter = {};
    };
  }, []);

  useEffect(() => {
    const onActivityChange = PubSub.subscribe("ACTIVITY_CHANGED", () => fetchData());
    return () => {
      PubSub.unsubscribe(onActivityChange);
    };
  }, []);

  useEffect(() => {
    filter = Object.fromEntries(params);
    if (_.isNil(filter.viewType) || filter.viewType === "") {
      filter.viewType = 1;
    }
    router.push({ pathname: leftPart, search: params.toString() }, null, { shallow: true });
    fetchData();
  }, [fetchData, pageIndex, type, viewType, menuIndex, text, languageId]);

  const refeshPage = (items: number) => {
    params.set("pageIndex", (items - 1).toString());
    filter = Object.fromEntries(params);
    router.push({ pathname: leftPart, search: params.toString() });
    fetchData();
  };

  const onChangePage = (pageIndex: number) => {
    params.set("pageIndex", pageIndex.toString());
    router.push({ pathname: leftPart, search: params.toString() });
  };

  const onFilter = (args: any) => {
    router.push({ pathname: leftPart, query: args });
  };

  const onReset = () => {
    filter = {};
    setTimeout(() => {
      const path = nextConfig.basePath ? location.pathname.replace(nextConfig.basePath, "") : location.pathname;
      router.push(path);
    }, 500);
  };

  const onResetTextInputOnly = () => {
    params.delete("filter");
    router.push({ pathname: leftPart, search: params.toString() });
  };

  const onChangeTab = (tabKey: string) => {
    params.set("activityType", tabKey);
    params.delete("pageIndex");
    router.push({ pathname: leftPart, search: params.toString() });
  };

  const onEdit = (activityData?: any) => {
    if (!activityData.id) return;
    if (activityData.type != ActivityTypeEnum.Code) {
      params.set("activityId", activityData?.id?.toString());
      router.push({ pathname: leftPart, search: params.toString() });
    } else {
      let codeType = activityData.activityCodeSubType;
      router.push(`/cms/activity-code/${ActivityTypeEnum.Code}/edit/${activityData.id}?type=${codeType}`);
    }
  };

  const onClone = (activityId: any) => {
    let onConfirm = () => {
      CmsService.cloneActivity(activityId, null, true).then((x: any) => {
        if (x) {
          Notify.success(t("Clone activity successfully"));
          fetchData();
        }
      });
    };
    confirmAction({
      message: t("Are you sure you want to clone?"),
      onConfirm,
    });
  };

  const onDelete = (activityId?: number) => {
    const onConfirm = () => {
      CmsService.deleteActivity(activityId).then((x: any) => {
        if (x) {
          Notify.success(
            t(LocaleKeys.D_MESSAGE_DELETE_SPECIFIC_ITEM_SUCCESSFUL, {
              name: t(LocaleKeys.Activity).toLocaleLowerCase(),
            })
          );
        }

        fetchData();
      });
    };
    confirmAction({
      message: t(LocaleKeys["Are you sure to delete this item?"]),
      onConfirm,
    });
  };

  //filter = { ...filter, ...Object.fromEntries(params) }
  return (
    <>
      <LoadingOverlay visible={loading} />

      <FilterBar
        isActivitiesListPage={isActivitiesListPage}
        data={filter}
        onFilter={onFilter}
        onReset={onReset}
        onResetTextInputOnly={onResetTextInputOnly}
      />
      <div className={styles.body}>
        <div className="col-span-1 mb-6">
          <AppTabs
            active={type + ""}
            onSelect={onChangeTab}
            items={menuItemsArray?.map((e) => ({ ...e, type: e.type + "" }))}
          />
        </div>
        <div className="col-span-1 md:col-span-3 h-full">
          <ActivityList
            activities={data?.items}
            pagination={data as any}
            onChangePage={onChangePage}
            onClickEdit={onEdit}
            onClone={onClone}
            selectable={selectable}
            onSelectChange={onSelectChange}
            onClickDelete={onDelete}
            isSelected={isSelected}
            isSelectedOld={isSelectedOld}
          />
          <Space h="sm" />
        </div>
      </div>
    </>
  );
};
