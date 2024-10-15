import { Breadcrumbs } from "@edn/components";
import { clsx } from "@mantine/core";
import { TypeMenuBar } from "@src/config";
import { FunctionBase, formatDateGMT } from "@src/helpers/fuction-base.helpers";
import { useMenuBar } from "@src/hooks/useMenuBar";
import { IdentityService } from "@src/services/IdentityService";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Container } from "../Layout";
import MenuBar from "../MenuBar/MenuBar";
import BoxChart from "./components/BoxChart";
import BoxFilter from "./components/BoxFilter";

export enum UserReportType {
  Week = "week",
  Day = "day",
}

const UserReport = () => {
  const { t } = useTranslation();

  const listItem = useMenuBar(TypeMenuBar.UserManagement);

  const [filter, setFilter] = useState<any>({
    week: 5,
    to: moment().add(1, "day").startOf("day").toDate(),
    from: moment().subtract(7, "days").startOf("day").toDate(),
    type: UserReportType.Week,
  });

  const { data } = useQuery({
    queryKey: ["new-user-report", filter],
    queryFn: async () => {
      const res = await IdentityService.newUserReport({
        from: filter.type === UserReportType.Day ? filter.from : null,
        to: filter.type === UserReportType.Day ? filter.to : null,
        week: filter.type === UserReportType.Day ? null : filter.week,
      });
      return res?.data?.data?.map((item) => ({
        ...item,
        name: filter.type === UserReportType.Week ? item.weekNumber : formatDateGMT(item.date),
      }));
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 100 * 60 * 5,
  });

  const totalNewUserCount = _.sumBy(data, "newUserCount") || 0;
  const totalNewUserActivityCount = _.sumBy(data, "newUserActivityCount") || 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row border-b">
        <div className="px-4">
          <MenuBar title="User management" listItem={listItem} />
        </div>
        <Container size="xl">
          <Breadcrumbs
            data={[
              {
                title: t("Home"),
                href: "/",
              },
              {
                title: t("User report"),
              },
            ]}
          />
          <div className="flex flex-col gap-6 mb-20">
            <div className="text-right">
              <BoxFilter value={filter} onChange={setFilter} />
            </div>

            <div className="font-semibold grid lg:grid-cols-4 gap-6">
              {data &&
                [
                  {
                    id: "totalNewUserActivityCount",
                    label: t("User active"),
                    number: totalNewUserActivityCount,
                    percent: ((totalNewUserActivityCount * 100) / (totalNewUserCount || 1)).toFixed(1),
                    color: "#36C09C",
                  },
                  {
                    id: "totalNewUserActivityCount",
                    label: t("New user"),
                    number: totalNewUserCount,
                    color: "#28577B",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    style={{ background: item.color }}
                    className={clsx("text-white rounded-md shadow-md overflow-hidden p-6 flex flex-col gap-2", {})}
                  >
                    <div className="font-bold flex items-baseline gap-2">
                      <div className="text-[32px] leading-[40px]"> {FunctionBase.formatNumber(item.number)}</div>
                      {item.percent && <div className="text-sm">({item.percent}%)</div>}
                    </div>
                    <div>{item.label}</div>
                  </div>
                ))}
            </div>

            <div className="bg-white rounded-md shadow-md p-6">
              <BoxChart data={data} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default UserReport;
