import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Flex, Table, Text, Textarea, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Container } from "@src/components";
import { ClassRoleEnum } from "@src/constants/class/class.constant";
import UserRole from "@src/constants/roles";
import { convertDate, formatDateGMT, FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useHasAnyRole } from "@src/helpers/helper";
import ModalAddManager from "@src/modules/classmanagement/ClassEdit/components/ModalAddManager";
import { LearnClassesService } from "@src/services";
import { selectProfile } from "@src/store/slices/authSlice";
import yup from "@src/validations/yupGlobal";
import _, { uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Pencil, Plus, Trash } from "tabler-icons-react";
import ModalAddCourse from "../ClassCreate/components/ModalAddCourse";

const ClassEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;

  const profile = useSelector(selectProfile);

  const [modalAddCourse, setModalAddCourse] = useState(false);
  const [courseEdit, setCourseEdit] = useState();
  const [listCourses, setListCourses] = useState([]);
  const [indexEdit, setIndexEdit] = useState();
  const [users, setUsers] = useState<any[]>([]);

  const [openModalAddManager, setOpenModalAddManager] = useState(false);
  const refSelectedManager = useRef<any>(null);

  const initialValues = {
    className: "",
    position: "",
    description: "",
    isShowDuration: false,
    isShowLearningPath: false,
    startDate: new Date(),
    endDate: new Date(),
  };

  const fetch = async () => {
    const res = await LearnClassesService.getClassDetail({
      classId: id,
    });
    if (res?.data?.success) {
      const data = res?.data?.data;
      if (!data?.isClassManager && !data.isOrgManager) {
        router.push("/403");
      }
      setUsers((prev) =>
        uniqBy(
          [...prev, ...(data.listManagers || []).map((e) => ({ label: e.userName, value: `${e.userId}` }))],
          "value"
        )
      );

      const classUserRoleDTOs = _.sortBy(
        data.listManagers?.reduce((prev, obj) => {
          let user = prev.find((e) => e.userId === obj.userId);
          if (user) {
            user.roles?.push(obj.role);
          } else {
            prev.push({ ...obj, roles: obj.role ? [obj.role] : [] });
          }
          return prev;
        }, []),
        [
          (o: any) => {
            return _.toLower(o.userName);
          },
        ]
      );

      reset({
        isClassManager: data.isClassManager,
        isOrgManager: data.isOrgManager,
        className: FunctionBase.htmlDecode(data.className),
        position: FunctionBase.htmlDecode(data.position),
        description: FunctionBase.htmlDecode(data.description),
        isShowDuration: data.isShowDuration,
        isShowLearningPath: data.isShowLearningPath,
        startDate: convertDate(data.startDate),
        endDate: convertDate(data.endDate),
        classUserRoleDTOs,
        ownerId: data.ownerId,
      });
      setListCourses(data.learningPaths);
    } else {
      router.push("/403");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const handleEditLearningPath = (value: any, index) => {
    setCourseEdit({
      title: value.title,
      startDate: convertDate(value.startDate),
      endDate: convertDate(value.endDate),
      duration: value.duration,
      courseId: value.courseId,
    } as any);
    setIndexEdit(index);
    setModalAddCourse(true);
  };

  const handleDelete = (index) => {
    confirmAction({
      message: t("Are you sure?"),
      onConfirm: () => {
        setListCourses((pre) => pre.slice(0, index).concat(pre.slice(index + 1)));
      },
    });
  };

  const schema = yup.object().shape({
    className: yup
      .string()
      .max(50, "Class name maximum 50 characters")
      .required(t("Class name should not be empty."))
      .trim(t("Class name should not be empty.")),
    position: yup
      .string()
      .max(50, "Position maximum 50 characters")
      .required(t("Position should not be empty."))
      .trim(t("Position should not be empty.")),
    description: yup
      .string()
      .max(256, "Description maximum 256 characters")
      .required(t("Description should not be empty."))
      .trim(t("Description should not be empty.")),
  });

  const onSubmit = async (rawData) => {
    const res = await LearnClassesService.saveClass({
      id: id,
      className: rawData.className,
      position: rawData.position,
      description: rawData.description,
      startDate: rawData.startDate,
      endDate: rawData.endDate,
      isShowDuration: rawData.isShowDuration,
      isShowLearningPath: rawData.isShowLearningPath,
      learningPaths: listCourses,
      classUserRoleDTOs: rawData.classUserRoleDTOs,
    });
    if (res?.data?.success) {
      Notify.success(t("Edit successfully"));
      router.push(`/classmanagement/classdetails/${id}`);
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;

  const isManagerContent = useHasAnyRole([UserRole.ManagerContent]);

  const classUserRoleDTOsField = useFieldArray({
    control,
    name: "classUserRoleDTOs",
  });

  const canEditManager =
    profile?.userId == watch("ownerId") ||
    watch("classUserRoleDTOs")?.some(
      (e) =>
        (e.role === ClassRoleEnum.ClassManager || e.role === ClassRoleEnum.AssignedClassManager) &&
        e.userId === profile?.userId
    ) ||
    watch("isOrgManager") ||
    isManagerContent;

  const getRoleLabel = (role?: number) => {
    switch (role) {
      case ClassRoleEnum.ClassManager:
        return t("Class manager");
      case ClassRoleEnum.AssignedClassManager:
        return t("Assigned class manager");
      case ClassRoleEnum.StudentManager:
        return t("Student manager");
      case ClassRoleEnum.ViewReport:
        return t("View report");
      case ClassRoleEnum.EditContent:
        return t("Edit content");
    }
    return null;
  };

  return (
    <form className="pb-20" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Container>
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/classmanagement",
                title: t("List class"),
              },
              {
                href: `/classmanagement/classdetails/${id}`,
                title: t("Class detail"),
              },
              {
                title: t("Edit Class"),
              },
            ]}
          />
        </Flex>
        <div className="bg-white">
          <div className="flex flex-col gap-6">
            <Controller
              name="className"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  disabled={!watch("isClassManager")}
                  label={t("Your class name")}
                  autoComplete="off"
                  withAsterisk
                  error={errors[field.name]?.message as string}
                />
              )}
            />
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  disabled={!watch("isClassManager")}
                  label={t("Position")}
                  autoComplete="off"
                  withAsterisk
                  error={errors[field.name]?.message as string}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  disabled={!watch("isClassManager")}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  error={errors[field.name]?.message as string}
                  minRows={4}
                  label={t("Description")}
                  withAsterisk
                  autoComplete="off"
                />
              )}
            />
            <div className="flex justify-between gap-5">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    disabled={!watch("isClassManager")}
                    label={t("Start Date")}
                    withAsterisk
                    className="w-[45%]"
                    clearable
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    disabled={!watch("isClassManager")}
                    label={t("End Date")}
                    className="w-[45%]"
                    clearable
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
            </div>
            <Controller
              name="isShowDuration"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  disabled={!watch("isClassManager")}
                  checked={field.value}
                  label={t("Display of class status")}
                />
              )}
            />
            <Controller
              name="isShowLearningPath"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  disabled={!watch("isClassManager")}
                  checked={field.value}
                  label={t("Show learning path")}
                />
              )}
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-2 md:flex-row justify-between">
            <Text className="text-2xl font-semibold">{t("Learning Path")}</Text>
            <Button disabled={!watch("isClassManager")} leftIcon={<Plus />} onClick={() => setModalAddCourse(true)}>
              {t("Add Course")}
            </Button>
          </div>
          <div className="overflow-auto">
            <Table withBorder withColumnBorders className="mt-5">
              <thead>
                <tr>
                  <th className="w-[60px]">#</th>
                  <th>{t("Title")}</th>
                  <th>{t("Start date")}</th>
                  <th>{t("End date")}</th>
                  <th>{t("Learning times")}</th>
                  <th className="w-[120px]">{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {listCourses.length > 0 &&
                  listCourses.map((value, index) => {
                    return (
                      <tr key={`${value.title}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{value.title}</td>
                        <td>{formatDateGMT(value.startDate)}</td>
                        <td>{formatDateGMT(value.endDate)}</td>
                        <td>{value.duration}</td>
                        <td className="flex gap-4">
                          <Pencil
                            className="cursor-pointer"
                            color="blue"
                            onClick={() => handleEditLearningPath(value, index)}
                          />
                          <Trash className="cursor-pointer" color="red" onClick={() => handleDelete(index)} />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col md:flex-row  justify-between">
            <Text className="text-2xl font-semibold">{t("Class manager")}</Text>
            {canEditManager && (
              <Button
                leftIcon={<Plus />}
                onClick={() => {
                  refSelectedManager.current = null;
                  setOpenModalAddManager(true);
                }}
                className="mt-4 md:mt-0"
              >
                {t("Add manager")}
              </Button>
            )}
          </div>
          <Table withBorder withColumnBorders className="mt-5">
            <thead>
              <tr>
                <th className="w-[60px]">#</th>
                <th>{t("Username")}</th>
                <th>{t("Role")}</th>
                {canEditManager && <th className="w-[110px] !text-center">{t("Action")}</th>}
              </tr>
            </thead>
            <tbody>
              {classUserRoleDTOsField.fields.length > 0 &&
                classUserRoleDTOsField.fields.map((data: any, index) => {
                  return (
                    <tr key={data.id}>
                      <td>{index + 1}</td>
                      <td>{data.userName}</td>
                      <td>{data.roles?.map?.((role) => getRoleLabel(role))?.join(", ")}</td>
                      {canEditManager && (
                        <td>
                          {data.roles?.every((role) => role !== ClassRoleEnum.ClassManager) &&
                            profile?.userId !== data.userId && (
                              <div className="flex gap-4 items-center justify-center">
                                <Pencil
                                  className="cursor-pointer"
                                  color="blue"
                                  onClick={() => {
                                    refSelectedManager.current = {
                                      ...data,
                                      index,
                                    };
                                    setOpenModalAddManager(true);
                                  }}
                                />
                                <Trash
                                  className="cursor-pointer"
                                  color="red"
                                  onClick={() => {
                                    confirmAction({
                                      message: t("Are you sure?"),
                                      onConfirm: () => {
                                        classUserRoleDTOsField.remove(index);
                                        Notify.success(t("Delete successfully!"));
                                      },
                                    });
                                  }}
                                />
                              </div>
                            )}
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <div className="pt-5 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push(`/classmanagement/classdetails/${id}`)}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Save")}</Button>
        </div>
      </Container>
      <ModalAddCourse
        courseEdit={courseEdit}
        indexEdit={indexEdit}
        setCourseEdit={setCourseEdit}
        modalAddCourse={modalAddCourse}
        setModalAddCourse={setModalAddCourse}
        listCourses={listCourses}
        setListCourses={setListCourses}
      />
      {openModalAddManager && (
        <ModalAddManager
          onClose={() => setOpenModalAddManager(false)}
          selected={refSelectedManager.current}
          excludeIds={watch("classUserRoleDTOsField")?.map((e) => e.userId)}
          onSuccess={(data: any) => {
            if (_.isNil(data.index)) {
              classUserRoleDTOsField.append(data);
            } else {
              classUserRoleDTOsField.update(data.index, _.omit(data, ["index"]));
            }
          }}
        />
      )}
    </form>
  );
};

export default ClassEdit;
