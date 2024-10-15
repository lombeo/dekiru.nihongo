import { Container } from "@src/components";
import { useEffect, useRef, useState } from "react";
import CodingService from "@src/services/Coding/CodingService";
import { useRouter } from "next/router";
import { Breadcrumbs } from "@mantine/core";
import { Calendar, ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "@edn/components";
import dayjs from "dayjs";
import { useHasAnyRole } from "@src/helpers/helper";
import UserRole from "@src/constants/roles";

export default function EventReport() {
  const router = useRouter();
  const { eventName } = router.query;
  const { t } = useTranslation();

  const [filter, setFilter] = useState<any>({
    eventId: 1,
    fromDate: null,
    toDate: null,
  });
  const preElement = useRef(null);

  const currentLocale = localStorage.getItem("locale");

  const isManager = useHasAnyRole([UserRole.Administrator, UserRole.SiteOwner, UserRole.ManagerContent]);

  const { data } = useQuery({
    queryKey: ["reportEvent", filter],
    queryFn: async () => {
      const res = await CodingService.getEventReport(filter);
      return JSON.stringify(res?.data?.data, null, 2);
    },
  });

  useEffect(() => {
    if (!isManager) {
      router.push("/403");
    }
  }, [isManager]);

  return (
    <Container size="xl" className="pb-10">
      <Breadcrumbs className="flex-wrap gap-y-3 py-3 md:py-5" separator={<ChevronRight color={"black"} size={15} />}>
        <Link href={"/"} className={`text-[black] text-[13px] hover:underline`}>
          {t("Home")}
        </Link>
        <Link href="/event" className={`text-[black] text-[13px] hover:underline`}>
          {t("Event")}
        </Link>
        <Link
          href={`/event/${eventName}`}
          className={`text-[black] text-[13px] hover:underline max-w-[90px] screen1024:max-w-max text-ellipsis leading-5 overflow-hidden`}
        >
          {eventName}
        </Link>
        <span className="text-[black] text-[13px] leading-normal">{t("Report")}</span>
      </Breadcrumbs>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Event Report</div>
        <div className="flex gap-4 w-2/5">
          <DatePicker
            onChange={(value) => setFilter({ ...filter, fromDate: value })}
            value={filter.fromDate}
            icon={<Calendar size={16} />}
            clearable
            size="md"
            valueFormat="DD/MM/YYYY"
            locale={currentLocale}
            label={t("Start date")}
            placeholder={t("Start date")}
            className="w-full"
          />
          <DatePicker
            onChange={(value) => setFilter({ ...filter, toDate: value })}
            value={filter.toDate}
            icon={<Calendar size={16} />}
            clearable
            size="md"
            maxDate={dayjs(new Date()).endOf("day").toDate()}
            valueFormat="DD/MM/YYYY"
            locale={currentLocale}
            label={t("End date")}
            placeholder={t("End date")}
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-5 border border-[#c4c4c4] rounded-[6px] overflow-hidden">
        <pre ref={preElement} className="h-[70vh] overflow-auto outline-none p-2" contentEditable>
          {data}
        </pre>
      </div>
    </Container>
  );
}
