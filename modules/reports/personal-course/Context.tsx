import { useRouter } from "@src/hooks/useRouter";
import React, { useCallback, useEffect, useState } from "react";
import { isNil, omitBy } from "lodash";
import { ReportService } from "@src/modules/reports/service/report.services";

export const PersonalCourseReportContext = React.createContext({
  data: {} as any,
  fetchData: () => {},
  search: (pageIndex?: number) => {},
  reset: () => {},
  model: {} as any,
  isLoading: false,
  changeModel: (field: string, value: any) => {},
});

export function PersonalCourseReportContextProvider(props: any) {
  const [model, setModel] = useState<any>({
    pageIndex: 1,
  });
  const [data, setData] = useState<any>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!router) return;
    const query = router.query as any;
    const model = omitBy(
      {
        ...query,
        courseStatus: query.courseStatus || "Published",
        paid: query.paid || "All",
        pageIndex: +query.pageIndex || 1,
      },
      isNil
    );
    delete model["slug"];
    setModel(model);
    let paid = null;
    if (model.paid === "Paid") {
      paid = true;
    } else if (model.paid === "Free") {
      paid = false;
    }
    try {
      const x = await ReportService.getPersonalCourseReport({
        ...model,
        courseName: model.courseName?.trim?.(),
        courseStatus: model.courseStatus === "All" ? "" : model.courseStatus,
        paid: paid,
      });
      if (x.data.success) {
        const o = x.data?.data;
        setData(o);
        return;
      }
      setData(null);
    } catch (e: any) {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const search = (pageIndex?: number) => {
    model["pageIndex"] = pageIndex || 1;
    delete model["slug"];
    setModel({ ...model });
    setIsLoading(true);
    router.push({
      pathname: "/reports/personal-courses",
      query: model,
    });
  };

  const reset = () => {
    router.push("/reports/personal-courses");
  };

  const changeModel = (field: string, value: any) => {
    if (isNil(value)) delete model[field];
    else model[field] = value;
    setModel({ ...model });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PersonalCourseReportContext.Provider
      value={{
        isLoading,
        data,
        model,
        fetchData,
        search,
        reset,
        changeModel,
      }}
    >
      {props.children}
    </PersonalCourseReportContext.Provider>
  );
}
