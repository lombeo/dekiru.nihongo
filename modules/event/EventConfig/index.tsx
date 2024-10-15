import { Button } from "@mantine/core";
import { Container } from "@src/components";
import { useEffect, useRef, useState } from "react";
import CodingService from "@src/services/Coding/CodingService";
import { Notify } from "@src/components/cms";
import { useRouter } from "next/router";
import { Breadcrumbs } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";
import Link from "@src/components/Link";
import { useTranslation } from "next-i18next";

export default function EventConfig() {
  const [value, setValue] = useState("");
  const [eventData, setEventData] = useState(null);

  const preElement = useRef(null);

  const router = useRouter();
  const { eventName } = router.query;

  const { t } = useTranslation();

  useEffect(() => {
    handleGetEventData();
  }, []);

  const handleGetEventData = async () => {
    const res = await CodingService.getEventDataForEdit();

    if (res?.data?.data) {
      const data = res.data.data;
      setEventData(data);
      setValue(JSON.stringify(data, null, 2));
    }
  };

  const onSave = async () => {
    try {
      const res = await CodingService.saveEventData(JSON.parse(preElement.current.innerText));
      if (res?.data?.success) {
        Notify.success("Lưu thành công");
        router.push(`/event/${eventName}`);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Container size="xl" className="pb-10">
      {eventData && (
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
            {eventData?.name}
          </Link>
          <span className="text-[black] text-[13px] leading-normal">{t("Config")}</span>
        </Breadcrumbs>
      )}

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Event config</div>
        <Button onClick={onSave}>Lưu</Button>
      </div>
      <div className="mt-5 border border-[#c4c4c4] rounded-[6px] overflow-hidden">
        <pre ref={preElement} className="h-[70vh] overflow-auto outline-none p-2" contentEditable>
          {value}
        </pre>
      </div>
    </Container>
  );
}
