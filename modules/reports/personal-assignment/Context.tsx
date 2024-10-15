import { useRouter } from "@src/hooks/useRouter";
import React, { useCallback, useEffect, useState } from "react";
import { isNil, omitBy } from "lodash";
import { ReportService } from "@src/modules/reports/service/report.services";
import QueryUtils from "@src/helpers/query-utils";
import { useTranslation } from "next-i18next";
import { Notify } from "@edn/components/Notify/AppNotification";
import useListUser from "@src/hooks/useListUser";

export const PersonalAssignmentReportContext = React.createContext({
  data: {} as any,
  fetchData: () => {},
  search: (pageIndex?: number) => {},
  reset: () => {},
  model: {} as any,
  isLoading: false,
  changeModel: (field: string, value: any) => {},
});

export function PersonalAssignmentReportContextProvider(props: any) {
  const [model, setModel] = useState<any>({});
  const [data, setData] = useState<any>();
  const router = useRouter();
  const { t } = useTranslation();
  const { fetchUserById } = useListUser();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!router) return;
    const query = router.query as any;
    const model = omitBy(
      {
        ...query,
        pageIndex: +query.pageIndex || 1,
        assignmentStatus: +query.assignmentStatus || 0,
        userAssignmentStatus: +query.userAssignmentStatus || 0,
        assignmentScore: isNaN(+query.assignmentScore) || isNil(query.assignmentScore) ? null : +query.assignmentScore,
        assignmentIds: query.assignmentIds?.split?.(",")?.map((strId) => +strId),
        userId: +query.userId || null,
      },
      isNil
    );
    if (model.userId) {
      const user = await fetchUserById(model.userId);
      if (user) {
        model["user"] = user;
      } else {
        delete model["userId"];
      }
    }
    delete model["slug"];
    setModel(model);
    if (!model.classId) {
      setData(null);
      return;
    }
    try {
      const x = await ReportService.getClassAssignment(
        omitBy(
          {
            ...model,
            assignmentScore: isNaN(model.assignmentScore) || isNil(model.assignmentScore) ? -1 : model.assignmentScore,
          },
          "user"
        )
      );
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
    if (!model.coursePermalink) {
      Notify.error(t("Course cannot be empty"));
      return;
    }
    if (!model.classId) {
      Notify.error(t("Class cannot be empty"));
      return;
    }
    if (model["user"]) {
      model["userId"] = model["user"].id;
    }
    delete model["slug"];
    model["pageIndex"] = pageIndex || 1;
    setModel({ ...model });
    setIsLoading(true);
    router.push({
      pathname: "/reports/personal-assignments",
      query: QueryUtils.buildQueryString(omitBy(model, "user")),
    });
  };

  const reset = () => {
    router.push("/reports/personal-assignments");
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
    <PersonalAssignmentReportContext.Provider
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
    </PersonalAssignmentReportContext.Provider>
  );
}
