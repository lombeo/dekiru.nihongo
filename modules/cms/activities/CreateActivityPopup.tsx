import { Card, Modal } from "@mantine/core";
import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import UserRole from "@src/constants/roles";
import { useHasAnyRole } from "@src/helpers/helper";
import { ActivityTypeEnum, menuItemsPersonalCourse } from "constants/cms/activity/activity.constant";
import { GroupCourseTypeEnum } from "constants/cms/course/course.constant";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import styles from "./CreateActivityPopup.module.css";

export const CreateActivityPopup = (props: any) => {
  const { t } = useTranslation();
  const { isOpen, onClose, data, isFullyActivity = true } = props;

  const courseId = data?.courseId ?? 0;
  const sectionId = data?.sectionId ?? 0;

  const isAdmin = useHasAnyRole([
    UserRole.Administrator,
    UserRole.OwnerCourse,
    UserRole.ManagerContent,
    UserRole.SiteOwner,
  ]);

  const types: any[] = isAdmin
    ? menuItemsPersonalCourse
    : [
        {
          label: "Quiz",
          icon: "IconQuiz",
          type: ActivityTypeEnum.Quiz,
          name: "quiz",
        },
        {
          label: "Code",
          icon: "IconCode",
          type: ActivityTypeEnum.Code,
          name: "code",
        },
      ];

  const getLinkCreateActivity = (x: any) => {
    if (x.type == ActivityTypeEnum.Code) {
      return `/cms/activity-code/${x.type}/create${
        sectionId && courseId ? `?sectionId=${sectionId}&courseId=${courseId}` : ""
      }`;
    }

    return `/cms/activity/create/${x.type}${
      sectionId && courseId
        ? `?sectionId=${sectionId}&courseId=${courseId}&courseType=${
            data.courseType ? data.courseType : GroupCourseTypeEnum.Organization
          }`
        : ""
    }`;
  };
  return (
    <>
      <Modal
        opened={isOpen}
        onClose={onClose}
        closeOnClickOutside={false}
        title={t(LocaleKeys["Choose Activity"])}
        size="lg"
      >
        <div className={styles.wrapper}>
          {types
            .filter((x: any) => !x.hideInModal)
            .map((x: any, idx: any) => {
              return (
                <Link key={idx} href={getLinkCreateActivity(x)}>
                  <Card className={styles.item} padding="lg">
                    <AppIcon name={x.icon} size="lg" />
                    <div>{t(x.label)}</div>
                  </Card>
                </Link>
              );
            })}
        </div>
      </Modal>
    </>
  );
};
