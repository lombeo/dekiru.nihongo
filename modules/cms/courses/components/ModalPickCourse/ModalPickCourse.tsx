import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Button, Checkbox, Pagination } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { resolveLanguage } from "@src/helpers/helper";
import { LocaleKeys } from "@src/public/locales/locale";
import CmsService from "@src/services/CmsService/CmsService";
import { Card, Image, Modal, Text } from "components/cms/core";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import styles from "./ModalPickCourse.module.scss";

interface ModalPickCourseProps {
  onClose: () => void;
  onSuccess: (course: any) => void;
  selectedItems: any;
  localeForm: any;
}

const ModalPickCourse = (props: ModalPickCourseProps) => {
  const { onClose, localeForm, onSuccess } = props;
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [filter, setFilter] = useState({
    pageIndex: 1,
    pageSize: 20,
    isCombo: false,
    excludeIds: props.selectedItems?.map((e: any) => e.courseId),
  });
  const [selectedItems, setSelectedItems] = useState<any>(props.selectedItems);

  const fetchCourse = async () => {
    if (filter.excludeIds?.length <= 0) {
      delete filter.excludeIds;
    }
    const res = await CmsService.getCourses(filter);
    const data = res?.data;
    if (data) {
      setData({
        ...data,
        items: data.items?.map((e: any) =>
          _.omit(
            {
              ...e,
              courseId: e.id,
              originalPrice: e.price,
            },
            "id"
          )
        ),
      });
    }
  };

  const getCoursePrice = (price: number, moneyType: number) => {
    if (moneyType === 1) {
      return price ? FunctionBase.formatNumber(price) : t(LocaleKeys["FREE"]);
    } else {
      return price ? FunctionBase.formatNumber(price * 25000) : t(LocaleKeys["FREE"]);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [filter]);

  const handleSelect = (event: any, course: any) => {
    event.stopPropagation();
    const idSelected = selectedItems.map((e: any) => e.courseId);
    if (idSelected?.includes(course.courseId)) {
      setSelectedItems((prev: any) => _.cloneDeep(prev?.filter((e: any) => e.courseId !== course.courseId)));
    } else {
      setSelectedItems((prev: any) => ([...prev, course]));
    }
  };

  const hasSelected = (course: any) => {
    const idSelected = selectedItems.map((e: any) => e.courseId);
    return idSelected?.includes(course.courseId);
  };

  return (
    <Modal
      opened
      onClose={onClose}
      title={t("Select course")}
      closeOnClickOutside={true}
      // overflow="inside"
      size="1140px"
      classNames={{
        body: "max-w-desktop mx-auto pr-3 h-screen flex flex-col justify-between",
      }}
    >
      <div>
        <div className="grid gap-5 lg:grid-cols-5">
          {data?.items?.map((data: any) => (
            <Card
              onClick={(e) => handleSelect(e, data)}
              withBorder
              key={data.courseId}
              className="hover:border-blue-primary relative h-full cursor-pointer rounded duration-300 p-4 overflow-hidden"
            >
              <Card.Section className={styles.wrapThumb}>
                <div className={styles.thumbnail}>
                  <Image src={data.thumbnail} height={180} alt="Dekiru" fit="cover" withPlaceholder />
                </div>
              </Card.Section>
              <div className="absolute top-4 right-4 z-10">
                <Checkbox checked={hasSelected(data)} onClick={(e) => handleSelect(e, data)} />
              </div>
              <TextLineCamp className="font-semibold mb-1 h-6">{resolveLanguage(data, localeForm)?.title}</TextLineCamp>
              <TextLineCamp className="font-semibold text-sm text-blue-500">
                {resolveLanguage(data.category, localeForm)?.title}
              </TextLineCamp>
              <Text className="font-semibold text-sm mt-1">{getCoursePrice(data.price, data.moneyType)}</Text>
            </Card>
          ))}
        </div>
        <div className="flex mt-5 justify-end">
          <Pagination
            total={data?.totalPages}
            value={filter.pageIndex}
            onChange={(value) => setFilter((prev) => ({ ...prev, pageIndex: value }))}
          />
        </div>
        <div className="flex justify-end gap-5 mt-5">
          <Button size="md" onClick={onClose} variant="outline">
            {t("Close")}
          </Button>
          <Button
            onClick={() => {
              onSuccess(selectedItems);
              onClose();
            }}
            size="md"
          >
            {t("Save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPickCourse;
