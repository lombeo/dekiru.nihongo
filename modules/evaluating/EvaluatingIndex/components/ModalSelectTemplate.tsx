import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Card, CloseButton, Divider, Modal, Pagination, Text, TextInput } from "@mantine/core";
import { Clock, EasyTask, HardTask, MediumTask, Skill, Task } from "@src/components/Svgr/components";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import useDebounce from "@src/hooks/useDebounce";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Heart, Search } from "tabler-icons-react";
import styles from "./ModalSelectTemplate.module.scss";

export const ModalSelectTemplate = (props: any) => {
  const { onClose } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  const [data, setData] = useState<any>({});
  const [filter, setFilter] = useState({
    pageSize: 8,
    pageIndex: 1,
    keyWord: "",
    includeInformation: true,
  });
  const filterDebounce = useDebounce(filter);
  const [loading, setLoading] = useState(true);

  const fetchListTemplate = async () => {
    const res = await CodingService.searchEvaluateTemplate(filter);
    if (res?.data?.success) {
      setData(res?.data?.data);
    } else {
      Notify.error(t(res?.data?.message));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListTemplate();
  }, [filterDebounce, locale]);

  return (
    <Modal
      size={1200}
      classNames={{
        title: "text-xl font-semibold",
        body: "px-0",
        header: "py-3",
      }}
      withCloseButton={false}
      opened
      onClose={onClose}
    >
      <div className="border-b-2 flex justify-between px-4 pb-2">
        <Text className="font-semibold text-xl">{t("Select Template")}</Text>
        <CloseButton size={24} color="#2C31CF" onClick={onClose} />
      </div>
      <div>
        <TextInput
          icon={<Search />}
          placeholder={t("Enter name template")}
          onChange={(event) =>
            setFilter((pre) => ({
              ...pre,
              keyWord: event.target.value.trim(),
            }))
          }
          className="md:w-[350px] mx-4 mt-4"
        />
        <Text className="mx-4 pt-2 font-semibold">{t("Evaluating template list") + ` (${data.rowCount ?? 0})`}</Text>
        {loading ? (
          <div className="flex justify-center py-48 mb-4"></div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 py-2 max-h-[calc(100vh_-_366px)]  md:max-h-[calc(100vh_-_336px)]  px-4 overflow-auto">
            {data?.results?.map((template) => {
              return (
                <Card
                  className={styles.card}
                  key={template.id}
                  onClick={() => router.push(`/evaluating/create/${template.id}`)}
                >
                  <div className="flex gap-4 justify-between px-4 h-[36px] items-center font-semibold bg-[#E8EDEE]">
                    <TextLineCamp
                      className="text-[#2C31CF] font-extrabold"
                      data-tooltip-id="global-tooltip"
                      data-tooltip-content={template.name}
                      data-tooltip-place="top"
                    >
                      {template.name}
                    </TextLineCamp>
                    <div className="flex gap-1 items-center text-sm font-semibold">
                      <Heart color="#F600B1" className="stroke-[1px]" />
                      <span>{FunctionBase.formatNumber(template.point)}</span>
                    </div>
                  </div>

                  <div className="py-2 text-sm bg-white px-4 flex flex-col gap-1">
                    <div className="pb-2 flex">
                      <div className="flex gap-1">
                        <Clock size={20} />
                        <Text className="w-[150px]">{t("Duration")}</Text>
                      </div>
                      <Text className="font-semibold">{`${template.duration} ${t("minutes")}`}</Text>
                    </div>

                    <Divider />
                    <div className="pt-2 flex">
                      <div className="flex gap-1">
                        <EasyTask size={20} />
                        <Text className="w-[150px]">{t("Easy")}</Text>
                      </div>
                      <Text className="font-semibold">
                        {template.minNumberEasyTask}-{template.maxNumberEasyTask}
                      </Text>
                    </div>
                    <div className="flex">
                      <div className="flex gap-1">
                        <MediumTask size={20} />
                        <Text className="w-[150px]">{t("Medium")}</Text>
                      </div>
                      <Text className="font-semibold">
                        {template.minNumberMediumTask}-{template.maxNumberMediumTask}
                      </Text>
                    </div>
                    <div className="flex pb-2">
                      <div className="flex gap-1">
                        <HardTask size={20} />
                        <Text className="w-[150px]">{t("Hard")} </Text>
                      </div>
                      <Text className="font-semibold">
                        {template.minNumberHardTask}-{template.maxNumberHardTask}
                      </Text>
                    </div>
                    <Divider />

                    <div className="flex pt-2">
                      <div className="flex gap-1">
                        <Task size={20} />
                        <Text className="w-[150px]">{t("Completed")}&nbsp;</Text>
                      </div>
                      <Text className="font-semibold">
                        <span className="text-green-600">{template.numberPassed}</span>/{template.numberSolved}
                      </Text>
                    </div>
                    <div className="flex">
                      <div className="flex gap-1">
                        <Skill size={20} />
                        <Text className="w-[150px]">{t("Skill")}</Text>
                      </div>
                      <Text className="font-semibold">{template.evaluateTemplateWarehouses?.length}</Text>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {!loading && (
          <div className="flex justify-center m-4">
            <Pagination
              withEdges
              total={data?.pageCount}
              value={filter?.pageIndex}
              onChange={(value) => {
                setFilter((pre) => ({
                  ...pre,
                  searchText: "",
                  pageIndex: value,
                }));
              }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
