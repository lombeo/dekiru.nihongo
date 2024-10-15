import CmsService from "@src/services/CmsService/CmsService";
import { Button, confirmAction, Notify, Space } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { ActivityTypeEnum } from "constants/cms/activity/activity.constant";
import { GroupCourseTypeEnum } from "constants/cms/course/course.constant";
import { useRouter } from "hooks/useRouter";
import { CreateActivityPopup } from "modules/cms/activities/CreateActivityPopup";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useState } from "react";
import { SectionService } from "services/section";
import { ActivityPicker } from "./ActivityPicker";
import { ConsumingActivity } from "./ConsumingActivity";

export const SectionActivityList = (props: any) => {
  const { t } = useTranslation();
  const {
    section,
    selectable,
    actionable,
    onSelectActivity,
    checkSelectedActivity,
    checkSelectedOldActivity,
    courseType = 0,
    data,
    fetchData,
  } = props;

  const { id, courseId } = section;
  const [isOpenActivityPicker, setIsOpenActivityPicker] = useState(false);
  const [isOpenCreateActivityPicker, setIsOpenCreateActivityPicker] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const onConfirmSelectedActivities = (activities: any) => {
    setIsDisabled(true);
    const attachParams = activities.map((x: any) => {
      return {
        sectionId: id,
        activityId: x.id,
      };
    });
    SectionService.acttactActivity(attachParams).then((x: any) => {
      if (x) {
        Notify.success("Add activity to section successfully");
        // setIsOpenActivityPicker(false)
        onClosePicker();
        fetchData();
        setIsDisabled(false);
      } else {
        setIsDisabled(false);
      }
    });
  };

  const onDetachActivity = (activity: any) => {
    const onConfirm = () => {
      SectionService.detachActivity({
        sectionId: id,
        activityId: activity.id,
      }).then((x: any) => {
        if (x) {
          Notify.success(t("Remove activity successfully"));
          fetchData();
        }
      });
    };

    confirmAction({
      message: t("Are you sure to remove this item?"),
      onConfirm,
    });
  };

  const checkHasMajor = async (courseId: number) => {
    return await CmsService.hasMajor({ courseId })
      .then((data) => data?.data)
      .then((data) => {
        return data;
      });
  };

  const onSetMajor = (activity: any, setOrUnset: boolean) => {
    const onConfirm = () => {
      SectionService.setMajorActivity({
        sectionId: id,
        activityId: activity.id,
        setOrUnset,
        courseId: courseId,
      }).then((x: any) => {
        if (x) {
          if (setOrUnset) Notify.success("Set final test successfully");
          else Notify.success("Unset final test successfully");
          fetchData();
        }
      });
    };
    checkHasMajor(courseId).then((data) => {
      if (data?.hasMajor && data?.activityId != activity.id) {
        confirmAction({
          message: "",
          htmlContent: (
            <div>
              <span className="font-bold italic ">{data.activityName}</span>
              {t("has set final test. Do you want to change?")}
            </div>
          ),
          onConfirm,
        });
      } else {
        confirmAction({
          message: setOrUnset ? t("Are you sure to set final test?") : t("Are you sure to unset final test?"),
          onConfirm,
        });
      }
    });
  };

  const router = useRouter();
  const params = new URLSearchParams(router.asPath.split("?")[1]);
  const parts = router.asPath.split("?");
  const leftPart = parts ? parts[0] : router.asPath;

  const onEditActivity = (activity: any) => {
    if (activity.type === ActivityTypeEnum.Code) {
      const { type, id, activityCodeSubType } = activity;
      window.open(`/cms/activity-code/${type}/edit/${id}?type=${activityCodeSubType}`, "_blank");
    } else {
      params.set("activityId", activity.id.toString());
      router.push("/cms/course/" + courseId + "/?" + params.toString());
    }
  };
  const onMoveUp = (activity: any) => {
    SectionService.moveActivity({
      sectionId: id,
      activityId: activity.id,
      up: true,
    }).then((x: any) => {
      if (x) {
        Notify.success(t("Move activity successfully"));
        // onMoveItem && onMoveItem()
        fetchData();
      }
    });
  };

  const onMoveDown = (activity: any) => {
    SectionService.moveActivity({
      sectionId: id,
      activityId: activity.id,
      up: false,
    }).then((x: any) => {
      if (x) {
        Notify.success(t("Move activity successfully"));
        // onMoveItem && onMoveItem()
        fetchData();
      }
    });
  };

  const onClone = (activity: any) => {
    let onConfirm = () => {
      CmsService.cloneActivity(activity.id, id, false).then((x: any) => {
        if (x) {
          Notify.success("Clone activity successfully");
          fetchData();
        }
      });
    };
    confirmAction({
      message: t("Are you sure you want to clone?"),
      onConfirm,
    });
  };

  const onStore = (activity: any) => {
    let onConfirm = () => {
      CmsService.cloneActivity(activity.id, null, true).then((x: any) => {
        if (x) {
          Notify.success(t("Store activity successfully"));
          router.push("/cms/activities");
        }
      });
    };
    confirmAction({
      message: t("Are you sure you want to store?"),
      onConfirm,
    });
  };

  const sectionActivities = data?.sectionActivities || [];
  if (section.activityOrdersArray) {
    if (sectionActivities)
      sectionActivities.sort(
        (a: any, b: any) =>
          section.activityOrdersArray.indexOf(a.activityId) - section.activityOrdersArray.indexOf(b.activityId)
      );
  }

  const getPickedData = () => {
    if (selectable) {
      return sectionActivities.map((x: any) => x.activity);
    }
    return sectionActivities.map((x: any) => {
      return {
        ...x.activity,
        id: x.activity.refId,
      };
    });
  };

  const onClosePicker = () => {
    setIsOpenActivityPicker(false);
    // const { type } = router.query;
    //router.push(`/cms/course/${courseId}`)
    if (params.get("learningPathId")) {
      router.push(
        {
          pathname: leftPart,
          query: { learningPathId: params.get("learningPathId") },
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else {
      router.push({ pathname: leftPart });
    }
  };

  return (
    <div className="py-4">
      <Visible visible={sectionActivities.length}>
        {sectionActivities.map((x: any, i: any) => {
          return (
            <ConsumingActivity
              key={i}
              data={{
                ...x.activity,
                sectionId: section.id,
                sectionActivity: x,
              }}
              fetch={fetchData}
              onDetach={onDetachActivity}
              selectable={selectable}
              onSelect={onSelectActivity}
              isChecked={checkSelectedActivity}
              isCheckedOld={checkSelectedOldActivity}
              onEdit={onEditActivity}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onStore={onStore}
              onClone={onClone}
              onSetMajor={(activity: any) => onSetMajor(activity, !x.major)}
              actionable={actionable}
              courseType={courseType}
            />
          );
        })}
      </Visible>
      <Visible visible={!sectionActivities.length}>
        <div className="px-4 mb-1 text-sm">{t(LocaleKeys["No activity"])}</div>
      </Visible>
      <div className="px-4">
        {data?.sectionActivities?.length > 0 && <Space h="sm" />}

        <Visible visible={!selectable}>
          <>
            <Button
              onClick={() => setIsOpenActivityPicker(true)}
              size="sm"
              preset="subtle"
              className="p-0 leading-6"
              hidden={!actionable}
            >
              {t(LocaleKeys["Select Activity"])}
            </Button>
            <Button
              onClick={() => setIsOpenCreateActivityPicker(true)}
              size="sm"
              preset="subtle"
              className="p-0 ml-3 leading-6"
              hidden={!actionable}
            >
              {t(LocaleKeys["Create Activity"])}
            </Button>
            <ActivityPicker
              isOpen={isOpenActivityPicker}
              pickedData={getPickedData()}
              onConfirm={onConfirmSelectedActivities}
              onDiscard={onClosePicker}
              isDisabled={isDisabled}
              courseId={courseId}
            />
            <CreateActivityPopup
              data={{
                courseId: courseId,
                sectionId: id,
                courseType: courseType,
              }}
              isFullyActivity={courseType != GroupCourseTypeEnum.Personal}
              isOpen={isOpenCreateActivityPicker}
              onClose={() => setIsOpenCreateActivityPicker(false)}
            />
          </>
        </Visible>
      </div>
    </div>
  );
};
