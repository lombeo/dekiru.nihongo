import { Button, Select } from "@mantine/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { CodeActivityReportContext } from "./Context";
import { useTranslation } from "next-i18next";
import Icon from "@edn/font-icons/icon";
import { isNil, omit } from "lodash";
import { LearnCourseService } from "@src/services";
import { ActivityTypeEnum } from "@src/constants/common.constant";
import { Notify } from "@edn/components/Notify/AppNotification";
import { DataSource } from "@src/components/TagField/TagField";
import SelectInfinite from "@src/components/SelectInfinite/SelectInfinite";
import { LearnExportServices } from "@src/services/LearnExportService";
import { X } from "tabler-icons-react";
import { ReportService } from "@src/modules/reports/service/report.services";
import { FriendService } from "@src/services/FriendService/FriendService";

const Head = () => {
  const { t } = useTranslation();
  const { search, reset, changeFilter, filter, isLoading, disabledExport } = useContext(CodeActivityReportContext);
  const [activities, setActivities] = useState([]);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingExportCode, setLoadingExportCode] = useState(false);

  const fetchActivities = useCallback(
    async (permalink: string | null = filter.permalink) => {
      if (isNil(permalink)) {
        setActivities([]);
        return;
      }
      const response = await LearnCourseService.getCourseDetail({ permalink: permalink, progress: false });
      let schedules: any = response?.data?.data?.courseSchedule?.courseScheduleList || [];
      if (schedules.length > 0) {
        const items: any[] = schedules.flatMap((item) => {
          return item.sections?.flatMap((section) =>
            section.activities
              ?.filter((e) => e.activityType === ActivityTypeEnum.Code)
              ?.flatMap((e) =>
                e?.activityTitle
                  ? {
                      value: e?.activityId,
                      label: e?.activityTitle,
                    }
                  : []
              )
          );
        });
        setActivities(items);
      } else {
        setActivities([]);
      }
    },
    [filter.permalink]
  );

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleExportCode = (activityId = filter.activityId) => {
    if (!filter.courseId) {
      Notify.error(t("Course cannot be empty"));
      return;
    }
    if (!activityId) {
      Notify.error(t("Activity cannot be empty"));
      return;
    }
    setLoadingExportCode(true);
    LearnExportServices.exportActivityCode({
      courseId: filter.courseId,
      activityId: filter.activityId,
    })
      .then((response: any) => {
        const type = response?.data?.type;
        if (type === "application/octet-stream") {
          const blob = new Blob([response.data], { type: "application/zip" });
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `ExportDataCode_${filter.courseId}_${activityId}.zip`;
          link.click();
        } else {
          Notify.error(t("Export data failed"));
        }
      })
      .catch(() => {
        Notify.error(t("Export data failed"));
      })
      .finally(() => {
        setLoadingExportCode(false);
      });
  };

  const handleExport = () => {
    if (!filter.courseId) {
      Notify.error(t("Course cannot be empty"));
      return;
    }
    setLoadingExport(true);
    ReportService.exportCodeActivitiesReport({
      ...omit(filter, ["permalink", "user", "pageIndex", "course"]),
      userId: filter.user?.userId || 0,
      activityId: filter.activityId || 0,
    })
      .then((response: any) => {
        if (response?.data?.success && response.data.data?.url) {
          const a = document.createElement("a");
          a.href = response.data.data?.url;
          a.click();
        } else {
          Notify.error(t("Export data failed"));
        }
      })
      .finally(() => {
        setLoadingExport(false);
      });
  };

  const handleFetchUsers = useCallback(async (query: string, page: number) => {
    try {
      let data: any[];
      let total: number;
      let limit = 10;
      if (!query || query.trim().length < 2) return;
      const response = await FriendService.searchUser({
        filter: query,
      });
      data = response?.data?.data;
      total = data?.length;
      if (!data) return;
      return Promise.resolve({
        data,
        total,
        limit,
      } as DataSource);
    } catch (e) {}
  }, []);

  const handleFetchCourses = useCallback(async (query: string, page: number) => {
    try {
      let data: any[];
      let total: number;
      let limit = 10;
      const response = await ReportService.getPersonalCourseReport({
        pageIndex: page,
        pageSize: 20,
        courseName: query,
      });
      data = response.data.data?.results;
      total = response.data.data.rowCount;
      if (!data) return;
      return Promise.resolve({
        data,
        total,
        limit,
      } as DataSource);
    } catch (e) {}
  }, []);

  return (
    <div className="p-5 border w-full rounded-md mb-8 bg-white">
      <div className="md:grid flex flex-col lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <SelectInfinite
          fetchOptions={handleFetchCourses}
          uniqueKey="permalink"
          value={filter["course"]}
          required
          label={t("Course name")}
          getOptionLabel={(item) => item.title}
          onChange={(value) => {
            changeFilter("course", value);
            changeFilter("permalink", value?.permalink);
            changeFilter("courseId", value?.courseId);
            changeFilter("activityId", null);
          }}
        />
        <Select
          searchable
          clearable
          key={new Date().toString()}
          size="md"
          data={activities}
          value={filter.activityId}
          onChange={(value) => {
            changeFilter("activityId", value);
          }}
          label={t("Activity")}
        />
        <SelectInfinite
          fetchOptions={handleFetchUsers}
          uniqueKey="userId"
          value={filter["user"]}
          label={t("User")}
          getOptionLabel={(item) => item.userName}
          onChange={(value) => {
            changeFilter("user", value);
          }}
        />
      </div>
      <div className="mt-5 flex gap-5 items-end flex-wrap">
        <Button
          onClick={() => {
            search();
          }}
          loading={isLoading}
          size="md"
          leftIcon={<Icon size={20} name="search" />}
        >
          {t("Filter")}
        </Button>
        <Button variant="light" size="md" onClick={reset} leftIcon={<X size={20} />}>
          {t("Reset")}
        </Button>
        <Button
          variant="light"
          loading={loadingExport}
          onClick={handleExport}
          disabled={disabledExport}
          size="md"
          leftIcon={<Icon size={20} name="download" />}
        >
          {t("Export")}
        </Button>
        <Button
          variant="light"
          loading={loadingExportCode}
          onClick={() => handleExportCode()}
          disabled={disabledExport}
          size="md"
          leftIcon={<Icon size={20} name="download" />}
        >
          {t("Export code")}
        </Button>
      </div>
    </div>
  );
};

export default Head;
