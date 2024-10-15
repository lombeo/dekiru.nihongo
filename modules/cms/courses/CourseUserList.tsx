import { useProfileContext } from "@src/context/Can";
import { CourseHelper } from "@src/helpers/course.helper";
import CmsService from "@src/services/CmsService/CmsService";
import { Button, Card, confirmAction, Notify } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { CourseUserListItem } from "./CourseUserListItem";
import { PopupCourseUser } from "./PopupCourseUser";
import { PopupCourseUserRole } from "./PopupCourseUserRole";

let currentSelectedUser: any = null;
export const CourseUserList = (props: any) => {
  const { ownerId, courseId } = props;
  const [data, setData] = useState<any>();
  const [isOpenCourseUserModal, setIsOpenCourseUserModal] = useState(false);
  const [isOpenCourseUserRoleModal, setIsOpenCourseUserRoleModal] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const fetchUserInfoData = (courseUserList: any) => {
    let mappingIdsToUserCourseIds: any = {};
    let listIds: any = [];

    courseUserList.forEach((z: any) => {
      mappingIdsToUserCourseIds[z.userId] = {
        id: z.id,
        roles: z.roles,
      };
      listIds.push(z.userId);
    });
    // if (listIds) {
    //   AccountService.getListUserByIds(listIds).then((z: any) => {
    //     if (!z) return;
    //
    //     const results = z.data.map((x: any) => {
    //       return {
    //         ...x,
    //         userCourseId: mappingIdsToUserCourseIds[x.id].id,
    //         roles: mappingIdsToUserCourseIds[x.id].roles,
    //       };
    //     });
    //     setData(results);
    //   });
    // }
  };

  const fetchData = () => {
    CmsService.getCourseUser(courseId).then((x: any) => {
      if (x?.data) {
        const courseUserList: any = x.data;
        fetchUserInfoData(courseUserList);
      }
    });
  };
  const onRemoveUserFromCourse = (data: any) => {
    const onConfirm = () => {
      CmsService.removeUser({
        courseId: courseId,
        userId: data.userId,
      }).then((x: any) => {
        //Notify.success("Remove user from course successfully");
        fetchData();
      });
    };

    confirmAction({
      message: t(LocaleKeys["Are you sure to remove this account from course"]),
      onConfirm,
    });
  };

  const onAddUserToCourse = (data: any) => {
    CmsService.addUser({
      courseId: courseId,
      userId: data.id,
    }).then((x: any) => {
      //Notify.success("Add new user to course successfully");
      fetchData();
    });
  };

  const onClosePopup = () => {
    setIsOpenCourseUserModal(false);
  };

  const onCloseUserRolePopup = () => {
    setIsOpenCourseUserRoleModal(false);
  };

  const handleAddUser = (data: any) => {
    onAddUserToCourse(data);
    onClosePopup();
  };

  const onSaveUserRole = (data: any) => {
    const requestParams = {
      ...data,
      roles: CourseHelper.convertUserRoleEnumObject(data.roles),
    };
    CmsService.setUserRole(requestParams).then((x: any) => {
      fetchData();
      setIsOpenCourseUserRoleModal(false);
      Notify.success(t("Set user's course role successfully"));
    });
  };

  const onClickOpenUserRolePopup = (data: any) => {
    currentSelectedUser = data;
    setIsOpenCourseUserRoleModal(true);
  };
  //const hasCreateCourseRight = useRight("course.create");

  const { profile } = useProfileContext();
  //console.log(profile, data)
  const isCourseOwner = data?.find((x: any) => x.userId.toString() === profile?.userId);
  return (
    <>
      {isCourseOwner && (
        <Card withBorder>
          {/* <div className="py-2 px-4 flex justify-between items-center border-b  ">
            <label className="text-sm">
              {t(LocaleKeys["Course managers"])}
            </label>
          </div> */}
          <h3 className="mb-2 font-bold">{t(LocaleKeys["Course managers"])}</h3>
          <div className="flex flex-col gap-2">
            {data?.map((x: any) => (
              <CourseUserListItem
                key={x.userId}
                data={x}
                onOpenSetting={onClickOpenUserRolePopup}
                onRemove={onRemoveUserFromCourse}
                isCourseOwner={isCourseOwner}
                canDelete={ownerId !== x?.userId}
              />
            ))}
          </div>
          <div className="mt-4">
            <Button onClick={() => setIsOpenCourseUserModal(true)} preset="secondary" fullWidth>
              {t(LocaleKeys["Add Manager"])}
            </Button>
            <PopupCourseUser
              isOpen={isOpenCourseUserModal}
              onClose={onClosePopup}
              onAddUser={handleAddUser}
              selectedUser={data}
            />
            <PopupCourseUserRole
              isOpen={isOpenCourseUserRoleModal}
              onClose={onCloseUserRolePopup}
              onSubmit={onSaveUserRole}
              onAddUser={handleAddUser}
              selectedUser={currentSelectedUser}
            />
          </div>
        </Card>
      )}
    </>
  );
};
