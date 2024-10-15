import { Button, Loader, Modal, Paper, Text } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import PieChartComponent from "@src/modules/organization/OrganizationReport/components/PieChartComponent";
import { LearnCourseService } from "@src/services";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const ModalViewStatistic = (props: any) => {
  const { courseId, setViewStatistic } = props;
  const { t } = useTranslation();

  const [dataStatistic, setDataStatistic] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchStatistic = async () => {
    const res = await LearnCourseService.getCourseStatic({
      courseId: courseId,
    });
    if (res?.data?.success) {
      setDataStatistic(res?.data?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (courseId) {
      fetchStatistic();
    }
  }, [courseId]);

  return (
    <Modal
      size={920}
      opened
      title={<Text className="font-semibold pb-2">{t("Statistic")}</Text>}
      onClose={() => setViewStatistic(false)}
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <div
          className={clsx("grid gap-4 justify-center", {
            "lg:grid-cols-2": !dataStatistic?.isFree,
            "grid-cols-1": dataStatistic.isFree,
          })}
        >
          <Paper p="md" className="flex flex-col border w-full max-w-[500px] mx-auto">
            <div className="flex justify-between">
              <Text className="font-semibold">{t("Course Status")} (%)</Text>
            </div>
            <div className="flex items-center flex-col md:flex-row justify-between">
              <PieChartComponent
                data={[
                  { name: "Complete", value: parseFloat((dataStatistic?.completedPercent * 100).toFixed(2)) },
                  { name: "Learning", value: parseFloat((dataStatistic?.learningPercent * 100).toFixed(2)) },
                  { name: "Pending", value: parseFloat((dataStatistic?.pendingPercent * 100).toFixed(2)) },
                ]}
              />
              <div className="flex gap-2 flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#77C148]"></div>
                  <Text className="text-center font-semibold">
                    {t("Complete") + " (" + FunctionBase.formatNumber(dataStatistic?.completedCount) + ")"}
                  </Text>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#FAA05E]"></div>
                  <Text className="text-center font-semibold">
                    {t("Learning") + " (" + FunctionBase.formatNumber(dataStatistic?.learningCount) + ")"}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F1646C]"></div>
                  <Text className="text-center font-semibold">
                    {t("Pending") + " (" + FunctionBase.formatNumber(dataStatistic?.pendingCount) + ")"}
                  </Text>
                </div>
              </div>
            </div>
          </Paper>
          {!dataStatistic?.isFree && (
            <Paper p="md" className="flex flex-col border w-full max-w-[500px] mx-auto">
              <Text className="font-semibold">{t("Payment")} (%)</Text>
              <div className="flex justify-center flex-col md:flex-row items-center">
                <PieChartComponent
                  data={[
                    { name: "Payment", value: parseFloat((dataStatistic?.paymentPercent * 100).toFixed(2)) },
                    { name: "Voucher", value: parseFloat((dataStatistic?.voucherPercent * 100).toFixed(2)) },
                    { name: "Other", value: parseFloat((dataStatistic?.addByAdminPercent * 100).toFixed(2)) },
                  ]}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#77C148]"></div>
                    <Text className="text-center font-semibold">
                      {t("Payment") + " (" + FunctionBase.formatNumber(dataStatistic?.paymentCount) + ")"}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#FAA05E]"></div>
                    <Text className="text-center font-semibold">
                      {t("Voucher") + " (" + FunctionBase.formatNumber(dataStatistic?.voucherCount) + ")"}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#F1646C]"></div>
                    <Text className="text-center font-semibold">
                      {t("Other") + " (" + FunctionBase.formatNumber(dataStatistic?.addByAdminCount) + ")"}
                    </Text>
                  </div>
                </div>
              </div>
            </Paper>
          )}
        </div>
      )}
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="w-[100px]" onClick={() => setViewStatistic(false)}>
          {t("Close")}
        </Button>
      </div>
    </Modal>
  );
};
export default ModalViewStatistic;
