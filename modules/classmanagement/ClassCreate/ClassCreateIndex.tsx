import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Flex, Table, Text, Textarea, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Container } from "@src/components";
import { ClassRoleEnum } from "@src/constants/class/class.constant";
import { formatDateGMT } from "@src/helpers/fuction-base.helpers";
import ModalAddManager from "@src/modules/classmanagement/ClassEdit/components/ModalAddManager";
import { LearnClassesService } from "@src/services";
import yup from "@src/validations/yupGlobal";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Pencil, Plus, Trash } from "tabler-icons-react";
import ModalAddCourse from "./components/ModalAddCourse";

const ClassCreateIndex = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [modalAddCourse, setModalAddCourse] = useState(false);
  const [courseEdit, setCourseEdit] = useState();
  const [listCourses, setListCourses] = useState([]);
  const [indexEdit, setIndexEdit] = useState(0);
  const handleEditLearningPath = (value, index) => {
    setCourseEdit(value);
    setIndexEdit(index);
    setModalAddCourse(true);
  };

  const [openModalAddManager, setOpenModalAddManager] = useState(false);
  const refSelectedManager = useRef<any>(null);

  const initialValues = {
    className: "",
    position: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    classUserRoleDTOs: [],
  };

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

  const checkCreate = async () => {
    const res = await LearnClassesService.checkRoleCreateClass();
    if (res?.data?.success) {
      if (!res.data.data?.canCreateClass) {
        router.push("/403");
      }
    }
  };

  useEffect(() => {
    checkCreate();
  }, []);

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
      .max(50, t("Class name maximum is 50 characters"))
      .required(t("Class name should not be empty."))
      .trim(t("Class name should not be empty.")),
    position: yup
      .string()
      .max(50, t("Position maximum is 50 characters"))
      .required(t("Position should not be empty."))
      .trim(t("Position should not be empty.")),
    description: yup
      .string()
      .max(256, t("Description maximum is 256 characters"))
      .required(t("Description should not be empty."))
      .trim(t("Description should not be empty.")),
  });

  const onSubmit = async (rawData) => {
    const res = await LearnClassesService.saveClass({
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
      Notify.success(t("Create successfully!"));
      router.push("/classmanagement");
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

  const classUserRoleDTOsField = useFieldArray({
    control,
    name: "classUserRoleDTOs",
  });

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
                title: t("Create Class"),
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
              render={({ field }) => <Checkbox {...field} label={t("Display of class status")} />}
            />
            <Controller
              name="isShowLearningPath"
              control={control}
              render={({ field }) => <Checkbox {...field} label={t("Show learning path")} />}
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <Text className="text-2xl font-semibold">{t("Learning Path")}</Text>
            <Button leftIcon={<Plus />} onClick={() => setModalAddCourse(true)}>
              {t("Add Course")}
            </Button>
          </div>
          <div className="overflow-auto">
            <Table withBorder withColumnBorders className="mt-5">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t("Title")}</th>
                  <th>{t("Start date")}</th>
                  <th>{t("End date")}</th>
                  <th>{t("Learning times")}</th>
                  <th>{t("Action")}</th>
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
          <div className="flex flex-col md:flex-row gap-2 justify-between">
            <Text className="text-2xl font-semibold">{t("Class manager")}</Text>
            <Button
              leftIcon={<Plus />}
              onClick={() => {
                refSelectedManager.current = null;
                setOpenModalAddManager(true);
              }}
            >
              {t("Add manager")}
            </Button>
          </div>
          <Table withBorder withColumnBorders className="mt-5">
            <thead>
              <tr>
                <th className="w-[60px]">#</th>
                <th>{t("Username")}</th>
                <th>{t("Role")}</th>
                <th className="w-[120px]">{t("Action")}</th>
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
                      <td>
                        <div className="flex gap-4 items-center">
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
                                },
                              });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>

        <div className="pt-5 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/classmanagement")}>
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

export default ClassCreateIndex;
