import { Button, Modal, NumberInput, Select, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { LearnService } from "@src/services/LearnService/LearnService";
import _, { debounce, uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useState } from "react";

export default function ModalAddCourse(props: any) {
  const { modalAddCourse, setModalAddCourse, setListCourses, courseEdit, listCourses, setCourseEdit, indexEdit } =
    props;
  const { t } = useTranslation();
  const [dataCourse, setDataCourse] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    duration: 0,
    courseId: 0,
  });
  const [courseOptions, setCourseOptions] = useState<any[]>([]);

  useEffect(() => {
    if (courseEdit) {
      setDataCourse(courseEdit);
      setCourseOptions([
        {
          label: courseEdit.title,
          value: _.toString(courseEdit.courseId),
        },
      ]);
    }
  }, [courseEdit]);

  const handleSubmit = () => {
    if (courseEdit) {
      listCourses[indexEdit] = dataCourse;
      setListCourses((pre) => [...listCourses]);
    } else {
      setListCourses((pre) => [...pre, dataCourse]);
    }
    setCourseEdit(null);
    setDataCourse((pre) => ({
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      duration: 0,
      courseId: 0,
    }));
    setModalAddCourse(false);
  };

  const handleClose = () => {
    setCourseEdit(null);
    setDataCourse((pre) => ({
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      duration: 0,
      courseId: 0,
    }));
    setModalAddCourse(false);
  };

  const handleSearchCourses = useCallback(
    debounce((query: string) => {
      if (!query || query.trim().length < 2) return;
      LearnService.getCourseList({
        keyword: query,
      }).then((res) => {
        let data = res?.data?.data;
        if (data) {
          data = data.map((course) => ({
            label: course.title,
            value: _.toString(course.id),
          }));
          setCourseOptions((prev) => uniqBy([...prev, ...data], "value"));
        }
      });
    }, 300),
    []
  );

  return (
    <Modal
      opened={modalAddCourse}
      onClose={handleClose}
      title={<Text className="font-semibold text-[#25265e] uppercase">{t(courseEdit ? "Update" : "Add topic")}</Text>}
    >
      <div className="flex flex-col gap-3">
        <Select
          nothingFound={t("No result found")}
          data={courseOptions ?? []}
          value={dataCourse?.courseId ? _.toString(dataCourse?.courseId) : null}
          clearable
          searchable
          readOnly={!!courseEdit}
          onSearchChange={handleSearchCourses}
          onChange={(value: any) => {
            setDataCourse((pre) => ({
              ...pre,
              title: courseOptions?.find((e) => e.value === value)?.label,
              courseId: +value,
            }));
          }}
          label={<Text className="font-semibold">{t("Title")}</Text>}
        />
        {/* <TextInput
          value={dataCourse?.title}
          onChange={(value) => setDataCourse((pre) => ({ ...pre, title: value.target.value }))}
          label={<Text className="font-semibold">{t("Title")}</Text>}
          autoComplete="off"
        /> */}
        <DateTimePicker
          onChange={(value) => setDataCourse((pre) => ({ ...pre, startDate: value }))}
          value={dataCourse.startDate}
          label={<Text className="font-semibold">{t("Start Date")}</Text>}
          clearable
          dropdownType="modal"
        />
        <DateTimePicker
          onChange={(value) => setDataCourse((pre) => ({ ...pre, endDate: value }))}
          value={dataCourse.endDate}
          label={<Text className="font-semibold">{t("End Date")}</Text>}
          clearable
          dropdownType="modal"
        />
        <NumberInput
          onChange={(value: any) => setDataCourse((pre) => ({ ...pre, duration: parseInt(value) }))}
          label={<Text className="font-semibold">{t("Learning time")}</Text>}
          autoComplete="off"
          value={dataCourse.duration}
        />
        <div className="flex gap-3 pt-5 justify-end">
          <Button variant="outline" onClick={handleClose}>
            {t("Close")}
          </Button>
          <Button onClick={handleSubmit}>{t("Save")}</Button>
        </div>
      </div>
    </Modal>
  );
}
