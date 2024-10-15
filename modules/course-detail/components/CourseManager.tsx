import { ActionIcon, Button } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Table } from "@mantine/core";
import Link from "@src/components/Link";
import { CourseUserRole } from "@src/constants/courses/courses.constant";
import { useProfileContext } from "@src/context/Can";
import AddUserModal from "@src/modules/course-detail/components/ModalAddManagerCourse";
import { LearnCourseService } from "@src/services/LearnCourseService";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { Edit, Plus, Trash } from "tabler-icons-react";

interface UserCourseProps {
  data?: any[];
  courseId: number;
  ownerId: number;
  refreshCourse: () => any;
}

const CourseManager = (props: UserCourseProps) => {
  const { courseId, ownerId, refreshCourse } = props;

  const data = props.data?.reduce((prev, obj) => {
    let user = prev.find((e) => e.userId === obj.userId);
    if (user) {
      user.roles?.push({
        role: obj.role,
        value: obj.value,
      });
    } else {
      prev.push({
        ...obj,
        roles: obj.role
          ? [
              {
                role: obj.role,
                value: obj.value,
              },
            ]
          : [],
      });
    }
    return prev;
  }, []);

  const { profile } = useProfileContext();

  const { t } = useTranslation();

  const [openModalAddManager, setOpenModalAddManager] = useState(false);

  const refSelected = useRef<any>(null);

  const colGroup = (
    <colgroup>
      <col
        style={{
          minWidth: "40px",
        }}
      />
      <col
        style={{
          minWidth: "200px",
        }}
      />
      <col
        style={{
          minWidth: "280px",
        }}
      />
      <col
        style={{
          minWidth: "300px",
        }}
      />
      <col
        style={{
          minWidth: "100px",
        }}
      />
    </colgroup>
  );

  const getRoleLabel = (role?: number) => {
    switch (role) {
      case CourseUserRole.CourseManager:
        return t("Course manager");
      case CourseUserRole.StudentManager:
        return t("Student manager");
      case CourseUserRole.ViewReport:
        return t("View report");
      case CourseUserRole.GradeAssignment:
        return t("Grade assignment");
      case CourseUserRole.CreateVoucher:
        return t("Create voucher");
      default:
        return t("Owner");
    }
  };

  const handleRemoveAddUser = async (id: any) => {
    const res = await LearnCourseService.addRemoveManager({
      courseId: courseId,
      managerId: id,
    });
    if (res?.data?.success) {
      Notify.success(t("Delete successfully!"));
      refreshCourse();
    }
  };

  return (
    <>
      <div className="flex flex-col pt-10 pb-20">
        <div className="flex justify-between gap-5 items-center mb-5">
          <h2 className="font-semibold text-xl my-0"></h2>
          <Button
            size="sm"
            onClick={() => {
              refSelected.current = false;
              setOpenModalAddManager(true);
            }}
            leftIcon={<Plus width={20} height={20} />}
          >
            {t("Add")}
          </Button>
        </div>
        <Table captionSide="bottom" className="border">
          {colGroup}
          <thead>
            <tr>
              <th className="!text-center">{t("No.")}</th>
              <th>{t("User")}</th>
              <th>{t("Role")}</th>
              <th className="!text-center">{t("Maximum allowed number of vouchers")}</th>
              <th className="!text-center w-10"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((e, idx) => {
              const isCurrentUser = profile?.userId == e.userId;
              return (
                <tr key={`${e.userId}-${e?.username}`}>
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    <Link className="text-primary" href={`/profile/${e?.userId}`}>
                      <TextLineCamp>{e?.username}</TextLineCamp>
                    </Link>
                  </td>
                  <td>{e.roles?.map?.((role) => getRoleLabel(role.role))?.join(", ") || t("Owner")}</td>
                  <td className="text-center">{e.roles?.find((e) => e.role === 5)?.value}</td>
                  <td className="text-center">
                    {!isCurrentUser && e.userId !== ownerId ? (
                      <div className="flex gap-2 items-center justify-center">
                        <ActionIcon
                          onClick={() => {
                            refSelected.current = e;
                            setOpenModalAddManager(true);
                          }}
                          color="blue"
                          variant="transparent"
                        >
                          <Edit width={20} height={20} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            confirmAction({
                              message: t("Do you want to remove the account from the list?"),
                              onConfirm: () => {
                                handleRemoveAddUser(e.userId);
                              },
                            });
                          }}
                          color="red"
                          variant="transparent"
                        >
                          <Trash width={20} height={20} />
                        </ActionIcon>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {openModalAddManager && (
        <AddUserModal
          courseId={courseId}
          selected={refSelected.current}
          onSuccess={refreshCourse}
          onClose={() => setOpenModalAddManager(false)}
        />
      )}
    </>
  );
};

export default CourseManager;
