import React, { useRef, useState } from "react";
import { isNil, omit } from "lodash";
import { ReportService } from "@src/modules/reports/service/report.services";
import { Notify } from "@edn/components/Notify/AppNotification";
import { useTranslation } from "next-i18next";

export const CodeActivityReportContext = React.createContext({
  data: {} as any,
  fetchData: () => {},
  search: (model?: any) => {},
  reset: () => {},
  disabledExport: false,
  isLoading: false,
  filter: {} as any,
  changeFilter: (field: string, value: any) => {},
});

export function CodeActivityReportContextProvider(props: any) {
  const [filter, _setFilter] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
  });
  const refFilter = useRef(filter);
  const setFilter = (value) => {
    refFilter.current = value;
    _setFilter(value);
  };
  const [data, setData] = useState<any>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [disabledExport, setDisabledExport] = useState(true);

  const fetchData = async () => {
    const filter = refFilter.current;
    if (!filter.courseId) return;
    try {
      setIsLoading(true);
      const response = await ReportService.getCodeActivitiesReport({
        ...omit(filter, ["permalink", "user", "course"]),
        courseId: filter.courseId,
        userId: filter.user?.userId || 0,
        activityId: filter.activityId || 0,
      });
      if (response.data?.success) {
        setData(response.data?.data);
        return;
      }
      setData(null);
    } catch (e: any) {
      setData(null);
    } finally {
      setIsLoading(false);
      setDisabledExport(false);
    }
  };

  const search = (filter?: any) => {
    const prevFilter = refFilter.current;
    const newFilter = { ...prevFilter, ...filter, pageIndex: filter?.pageIndex || 1 };
    setFilter(newFilter);
    if (!newFilter.courseId) {
      Notify.error(t("Course cannot be empty"));
      return;
    }
    fetchData();
  };

  const reset = () => {
    setFilter({
      pageIndex: 1,
      pageSize: 10,
    });
    fetchData();
  };

  const changeFilter = (field: string, value: any) => {
    if (isNil(value)) delete filter[field];
    else filter[field] = value;
    setFilter({ ...filter });
  };

  return (
    <CodeActivityReportContext.Provider
      value={{
        isLoading,
        data,
        filter,
        fetchData,
        search,
        reset,
        changeFilter,
        disabledExport,
      }}
    >
      {props.children}
    </CodeActivityReportContext.Provider>
  );
}
